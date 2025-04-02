
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface CheckoutSummaryProps {
  price: string;
  agreedToTerms: boolean;
  setAgreedToTerms: (value: boolean) => void;
  isProcessing: boolean;
  onCheckout: (e: React.FormEvent) => void;
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
  price,
  agreedToTerms,
  setAgreedToTerms,
  isProcessing,
  onCheckout
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="border border-ghibli-meadow/20">
        <CardContent className="p-6">
          <h2 className="text-xl font-medium text-ghibli-forest mb-6">최종 결제</h2>
          
          <div className="border-b border-ghibli-earth/10 pb-4 mb-4">
            <div className="flex justify-between text-lg font-bold">
              <span>총 결제금액</span>
              <span className="text-ghibli-forest">₩{price}</span>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <Checkbox 
                id="terms" 
                checked={agreedToTerms} 
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              />
              <Label 
                htmlFor="terms" 
                className="text-sm cursor-pointer"
              >
                이용약관 및 환불 정책에 동의합니다.
              </Label>
            </div>
            <p className="text-xs text-ghibli-stone">
              결제 완료 후 14일 이내 환불 가능합니다.
            </p>
          </div>
          
          <form onSubmit={onCheckout}>
            <Button 
              type="submit"
              disabled={isProcessing || !agreedToTerms}
              className="w-full bg-ghibli-meadow hover:bg-ghibli-forest text-white transition-all duration-300"
            >
              {isProcessing ? '처리 중...' : '결제 완료하기'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CheckoutSummary;
