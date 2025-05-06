
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface CheckoutSummaryProps {
  price: string;
  agreedToTerms: boolean;
  setAgreedToTerms: (agreed: boolean) => void;
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
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl text-ghibli-forest">최종 결제</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <span className="font-medium">최종 결제 금액</span>
          <span className="font-bold text-2xl text-ghibli-forest">{price}원</span>
        </div>
        
        <div className="flex items-start space-x-2 pt-2">
          <Checkbox 
            id="terms" 
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(!!checked)}
          />
          <label
            htmlFor="terms"
            className="text-sm leading-tight cursor-pointer"
          >
            주문 내용을 확인하였으며, 결제진행에 동의합니다.
            <span className="block text-xs text-ghibli-stone mt-1">
              이용약관, 개인정보 처리방침, 환불 정책에 동의합니다.
            </span>
          </label>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onCheckout}
          disabled={!agreedToTerms || isProcessing}
          className="w-full bg-ghibli-meadow hover:bg-ghibli-forest transition-colors"
        >
          {isProcessing ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></span>
              처리중...
            </>
          ) : (
            '결제 완료하기'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CheckoutSummary;
