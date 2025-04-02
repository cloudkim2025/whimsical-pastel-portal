
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OrderSummaryProps {
  course: {
    title: string;
    instructor: string;
    image: string;
    category: string;
    price: string;
    duration: string;
  };
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ course }) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl text-ghibli-forest">주문 요약</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-4">
          <div className="w-24 h-24 rounded-md overflow-hidden">
            <img 
              src={course.image} 
              alt={course.title} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-bold">{course.title}</h3>
            <p className="text-sm text-ghibli-stone">강사: {course.instructor}</p>
            <p className="text-sm text-ghibli-stone">분류: {course.category}</p>
            <p className="text-sm text-ghibli-stone">강의 시간: {course.duration}</p>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="font-medium">강의 가격:</span>
            <span className="font-bold text-lg">{course.price}원</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
