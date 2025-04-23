
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { authAPI } from '@/api/auth';
import { toast } from 'sonner';
import { Timer } from 'lucide-react';

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (success: boolean) => void;
  email: string;
  onResendCode: () => Promise<void>;
}

const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  isOpen,
  onClose,
  onVerify,
  email,
  onResendCode
}) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const [isTimerExpired, setIsTimerExpired] = useState(false);
  
  useEffect(() => {
    // Reset state when modal opens
    if (isOpen) {
      setVerificationCode("");
      setError("");
      setTimer(300);
      setIsTimerExpired(false);
    }
  }, [isOpen]);
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isOpen && timer > 0 && !isTimerExpired) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          const newTime = prevTimer - 1;
          if (newTime <= 0) {
            setIsTimerExpired(true);
            if (interval) clearInterval(interval);
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, timer, isTimerExpired]);
  
  const handleVerify = async () => {
    if (isTimerExpired) {
      setError("인증 시간이 만료되었습니다. 코드를 다시 발급받아주세요.");
      return;
    }
    
    if (verificationCode.length !== 6) {
      setError("6자리 인증 코드를 입력해주세요.");
      return;
    }
    
    setIsVerifying(true);
    setError("");
    
    try {
      const response = await authAPI.verifyCode(email, verificationCode);
      
      if (response.data.success) {
        toast.success('이메일이 성공적으로 인증되었습니다.');
        onVerify(true);
        onClose();
      } else {
        setError("인증에 실패했습니다. 코드를 다시 확인해주세요.");
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      
      const errorMsg = 
        error.response?.data?.message || 
        "인증에 실패했습니다. 다시 시도해주세요.";
      
      setError(errorMsg);
      
      // 코드가 만료된 경우 (시간 초과)
      if (errorMsg.includes('시간이 초과')) {
        toast.error('인증 시간이 초과되었습니다. 코드를 다시 발송해주세요.');
        setIsTimerExpired(true);
      } else {
        toast.error('인증 코드 확인에 실패했습니다.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    try {
      await onResendCode();
      setTimer(300);
      setIsTimerExpired(false);
      setError("");
    } catch (error) {
      console.error('Failed to resend code:', error);
    }
  };

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">이메일 인증</DialogTitle>
        </DialogHeader>
        
        <div className="py-6">
          <p className="text-center text-muted-foreground mb-6">
            <span className="font-medium text-ghibli-forest">{email}</span>으로 발송된<br/>
            6자리 인증 코드를 입력해주세요
          </p>
          
          <div className="flex flex-col items-center gap-4">
            <InputOTP
              maxLength={6}
              value={verificationCode}
              onChange={setVerificationCode}
              render={({ slots }) => (
                <InputOTPGroup className="gap-2">
                  {slots.map((slot, index) => (
                    <InputOTPSlot key={index} {...slot} index={index} />
                  ))}
                </InputOTPGroup>
              )}
            />
            
            {!isTimerExpired ? (
              <div className="flex items-center text-sm text-ghibli-stone mt-2">
                <Timer className="h-4 w-4 mr-1" />
                <span>{formatTime(timer)}</span>
              </div>
            ) : (
              <div className="text-sm text-red-500 mt-2">
                인증 시간이 만료되었습니다. 코드를 다시 발급받아주세요.
              </div>
            )}
          </div>
          
          {error && (
            <p className="text-red-500 text-sm text-center mt-4">{error}</p>
          )}
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={onClose} type="button" className="flex-1 sm:flex-auto">
              취소
            </Button>
            {isTimerExpired && (
              <Button 
                onClick={handleResendCode}
                variant="outline"
                className="flex-1 sm:flex-auto"
                type="button"
              >
                코드 재발송
              </Button>
            )}
          </div>
          <Button 
            onClick={handleVerify}
            disabled={verificationCode.length !== 6 || isVerifying || isTimerExpired}
            className="bg-ghibli-meadow hover:bg-ghibli-forest w-full sm:w-auto"
            type="button"
          >
            {isVerifying ? "인증중..." : "인증하기"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailVerificationModal;
