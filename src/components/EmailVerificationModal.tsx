
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

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (success: boolean) => void;
  email: string;
}

const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  isOpen,
  onClose,
  onVerify,
  email
}) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Reset state when modal opens
    if (isOpen) {
      setVerificationCode("");
      setError("");
    }
  }, [isOpen]);

  const handleVerify = async () => {
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
        onClose();
      } else {
        toast.error('인증 코드 확인에 실패했습니다.');
      }
    } finally {
      setIsVerifying(false);
    }
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

          <div className="flex justify-center">
            <InputOTP
                maxLength={6}
                value={verificationCode}
                onChange={setVerificationCode}
                type="text"
                inputMode="numeric"
                render={({ slots }) => (
                    <InputOTPGroup className="gap-2">
                      {slots.map((slot, index) => (
                          <InputOTPSlot key={index} {...slot} index={index} />
                      ))}
                    </InputOTPGroup>
                )}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
          )}
        </div>

        <DialogFooter className="flex justify-between items-center">
          <Button variant="outline" onClick={onClose} type="button">
            취소
          </Button>
          <Button
            onClick={handleVerify}
            disabled={verificationCode.length !== 6 || isVerifying}
            className="bg-ghibli-meadow hover:bg-ghibli-forest"
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
