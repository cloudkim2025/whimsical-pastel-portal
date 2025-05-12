import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { Card, CardContent } from '@/components/ui/card';
import { paymentAPI } from '@/api/payment';
import { lectureAPI } from '@/api/lecture';

interface PurchasedCourse {
    id: string;
    title: string;
    instructor: string;
    imageUrl: string;
    progress: number;
}

const PurchasedCoursesButton: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [purchasedCourses, setPurchasedCourses] = useState<PurchasedCourse[]>([]);

    useEffect(() => {
        const fetchPurchasedCourses = async () => {
            try {
                const res = await paymentAPI.getMyPurchases();
                const courses = await Promise.all(
                    res.data.map(async (purchase: any) => {
                        const lectureRes = await lectureAPI.getLectureDetail(purchase.productId);
                        return {
                            id: String(purchase.productId),
                            title: lectureRes.data.title,
                            instructor: lectureRes.data.instructorName,
                            imageUrl: lectureRes.data.thumbnailUrl,
                            progress: Math.floor(Math.random() * 100), // TODO: 실제 시청 기록 연동 시 교체
                        };
                    })
                );
                setPurchasedCourses(courses);
            } catch (err) {
                console.error('결제한 강의 조회 실패:', err);
            }
        };

        if (user) {
            fetchPurchasedCourses();
        }
    }, [user]);

    const handleCourseClick = (courseId: string) => {
        navigate(`/lecture/${courseId}`);
    };

    if (!user) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="fixed top-32 right-6 z-30" // ✅ right-6 → right-20 (왼쪽으로 이동)
        >
            <Drawer>
                <DrawerTrigger asChild>
                    <Button
                        className="rounded-full bg-ghibli-meadow hover:bg-ghibli-forest text-white shadow-lg flex items-center gap-2 px-6 py-3"
                        title="내 강의 보기"
                    >
                        <BookOpen className="w-5 h-5" />
                        <span className="text-sm font-medium">내 강의</span>
                    </Button>
                </DrawerTrigger>

                <DrawerContent className="max-h-[85vh] overflow-auto">
                    <DrawerHeader className="text-center">
                        <DrawerTitle className="text-xl font-bold text-ghibli-forest">내 수강 중인 강의</DrawerTitle>
                    </DrawerHeader>
                    <div className="px-4 pb-6">
                        {purchasedCourses.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">아직 구매한 강의가 없습니다.</div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {purchasedCourses.map((course) => (
                                    <Card
                                        key={course.id}
                                        className="border border-ghibli-meadow/20 hover:border-ghibli-meadow cursor-pointer transition-all"
                                        onClick={() => handleCourseClick(course.id)}
                                    >
                                        <CardContent className="p-3 flex items-center">
                                            <img
                                                src={course.imageUrl}
                                                alt={course.title}
                                                className="w-16 h-16 object-cover rounded-md mr-3"
                                            />
                                            <div className="flex-1">
                                                <h4 className="font-medium text-ghibli-forest">{course.title}</h4>
                                                <p className="text-sm text-ghibli-stone">{course.instructor}</p>
                                                <div className="mt-1 bg-ghibli-cloud rounded-full h-1.5">
                                                    <div
                                                        className="bg-ghibli-meadow h-1.5 rounded-full"
                                                        style={{ width: `${course.progress}%` }}
                                                    ></div>
                                                </div>
                                                <p className="text-xs text-right text-ghibli-stone mt-0.5">
                                                    {course.progress}% 완료
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                        <div className="flex justify-center mt-4">
                            <DrawerClose asChild>
                                <Button
                                    variant="outline"
                                    className="border-ghibli-meadow text-ghibli-forest hover:bg-ghibli-cloud"
                                    onClick={() => navigate('/profile?tab=purchases')}
                                >
                                    모든 강의 보기
                                </Button>
                            </DrawerClose>
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        </motion.div>
    );
};

export default PurchasedCoursesButton;
