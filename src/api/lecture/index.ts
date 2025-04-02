
import API from '@/utils/apiClient';
import { CourseType } from '@/types/course';

export const lectureAPI = {
  // 강의 목록 조회
  getCourses: (category?: string) => {
    return API.get('/courses', { params: { category } });
  },

  // 강의 상세 조회
  getCourseDetail: (courseId: string) => {
    return API.get(`/courses/${courseId}`);
  },
  
  // 강의 등록 (강사용)
  createCourse: (courseData: Partial<CourseType>) => {
    return API.post('/courses', courseData);
  }
};
