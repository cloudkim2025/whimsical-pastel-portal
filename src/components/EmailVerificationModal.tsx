
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
  const [mockCode] = useState("123456"); // In a real app, this would be generated on the backend
  
  useEffect(() => {
    // Reset state when modal opens
    if (isOpen) {
      setVerificationCode("");
      setError("");
    }
  }, [isOpen]);
  
  const handleVerify = () => {
    setIsVerifying(true);
    setError("");
    
    // Simulate API verification delay
    setTimeout(() => {
      if (verificationCode === mockCode) {
        onVerify(true);
        onClose();
      } else {
        setError("코드를 다시 확인해주세요");
      }
      setIsVerifying(false);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
              render={({ slots }) => (
                <InputOTPGroup className="gap-2">
                  {slots.map((slot, index) => (
                    <InputOTPSlot key={index} {...slot} />
                  ))}
                </InputOTPGroup>
              )}
            />
          </div>
          
          {error && (
            <p className="text-red-500 text-sm text-right mt-2">{error}</p>
          )}
        </div>
        
        <DialogFooter className="flex justify-between items-center">
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button 
            onClick={handleVerify}
            disabled={verificationCode.length !== 6 || isVerifying}
            className="bg-ghibli-meadow hover:bg-ghibli-forest"
          >
            {isVerifying ? "인증중..." : "인증하기"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailVerificationModal;
