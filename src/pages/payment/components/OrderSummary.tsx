
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

interface CourseData {
  id: string;
  title: string;
  instructor: string;
  image: string;
  category: string;
  price: string;
  duration: string;
}

interface OrderSummaryProps {
  course: CourseData;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ course }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border border-ghibli-meadow/20">
        <CardContent className="p-6">
          <h2 className="text-xl font-medium text-ghibli-forest mb-4">주문 요약</h2>
          
          <div className="flex mb-4">
            <img 
              src={course.image}
              alt={course.title}
              className="h-20 w-20 object-cover rounded-md mr-4"
            />
            <div>
              <h3 className="font-medium text-ghibli-midnight">{course.title}</h3>
              <p className="text-sm text-ghibli-stone">{course.instructor}</p>
              <p className="text-sm text-ghibli-stone">{course.duration}</p>
            </div>
          </div>
          
          <div className="border-t border-b border-ghibli-earth/10 py-4 my-4">
            <div className="flex justify-between mb-2">
              <span className="text-ghibli-stone">강의 가격</span>
              <span className="text-ghibli-midnight">₩{course.price}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>총 결제금액</span>
              <span className="text-lg text-ghibli-forest">₩{course.price}</span>
            </div>
          </div>
          
          <p className="text-sm text-ghibli-stone">
            *부가세 포함
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OrderSummary;
