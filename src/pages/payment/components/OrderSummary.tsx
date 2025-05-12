import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OrderSummaryProps {
  lecture: {
    title: string;
    instructor: string;
    image: string;
    category: string;
    price: string | number;
    duration: string;
  };
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ lecture }) => {
  return (
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-ghibli-forest">주문 요약</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <div className="w-24 h-24 rounded-md overflow-hidden">
              <img
                  src={lecture.image}
                  alt={lecture.title}
                  className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-bold">{lecture.title}</h3>
              <p className="text-sm text-ghibli-stone">강사: {lecture.instructor}</p>
              <p className="text-sm text-ghibli-stone">분류: {lecture.category}</p>
              <p className="text-sm text-ghibli-stone">강의 시간: {lecture.duration}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="font-medium">강의 가격:</span>
              <span className="font-bold text-lg">
              {Number(lecture.price).toLocaleString('ko-KR')}원
            </span>
            </div>
          </div>
        </CardContent>
      </Card>
  );
};

export default OrderSummary;
