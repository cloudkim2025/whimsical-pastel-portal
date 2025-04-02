
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface PaymentMethodsProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ paymentMethod, setPaymentMethod }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="border border-ghibli-meadow/20">
        <CardContent className="p-6">
          <h2 className="text-xl font-medium text-ghibli-forest mb-4">결제 수단</h2>
          
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
            <div className="flex items-center space-x-2 border border-ghibli-meadow/30 rounded-lg p-3 cursor-pointer hover:bg-ghibli-cloud/30 transition-colors">
              <RadioGroupItem value="kakao" id="payment-kakao" />
              <Label htmlFor="payment-kakao" className="cursor-pointer flex-grow">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-[#FEE500] rounded-md flex items-center justify-center mr-3">
                    <span className="text-[#3A1D1D] font-bold text-sm">K</span>
                  </div>
                  <div>
                    <div className="font-medium">카카오페이</div>
                    <div className="text-xs text-ghibli-stone">간편하고 빠른 결제</div>
                  </div>
                </div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 border border-ghibli-earth/30 rounded-lg p-3 cursor-pointer hover:bg-ghibli-cloud/30 transition-colors">
              <RadioGroupItem value="card" id="payment-card" />
              <Label htmlFor="payment-card" className="cursor-pointer flex-grow">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-bold text-sm">C</span>
                  </div>
                  <div>
                    <div className="font-medium">신용/체크카드</div>
                    <div className="text-xs text-ghibli-stone">모든 카드 사용 가능</div>
                  </div>
                </div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 border border-ghibli-earth/30 rounded-lg p-3 cursor-pointer hover:bg-ghibli-cloud/30 transition-colors">
              <RadioGroupItem value="bank" id="payment-bank" />
              <Label htmlFor="payment-bank" className="cursor-pointer flex-grow">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center mr-3">
                    <span className="text-green-600 font-bold text-sm">B</span>
                  </div>
                  <div>
                    <div className="font-medium">무통장 입금</div>
                    <div className="text-xs text-ghibli-stone">입금 확인 후 수강 가능</div>
                  </div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PaymentMethods;
