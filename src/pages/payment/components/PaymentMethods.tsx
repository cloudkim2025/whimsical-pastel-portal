
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface PaymentMethodsProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ 
  paymentMethod, 
  setPaymentMethod 
}) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl text-ghibli-forest">결제 수단</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={paymentMethod} 
          onValueChange={setPaymentMethod}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2 border border-gray-200 rounded-md p-3">
            <RadioGroupItem value="kakao" id="kakao" />
            <Label htmlFor="kakao" className="flex items-center cursor-pointer">
              <div className="w-8 h-8 bg-yellow-400 rounded-md flex items-center justify-center mr-2">
                <span className="text-xs font-bold">카카오</span>
              </div>
              카카오페이
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 border border-gray-200 rounded-md p-3">
            <RadioGroupItem value="card" id="card" />
            <Label htmlFor="card" className="flex items-center cursor-pointer">
              <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center mr-2 text-white">
                <span className="text-xs font-bold">카드</span>
              </div>
              신용카드
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 border border-gray-200 rounded-md p-3">
            <RadioGroupItem value="bank" id="bank" />
            <Label htmlFor="bank" className="flex items-center cursor-pointer">
              <div className="w-8 h-8 bg-green-600 rounded-md flex items-center justify-center mr-2 text-white">
                <span className="text-xs font-bold">은행</span>
              </div>
              무통장입금
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default PaymentMethods;
