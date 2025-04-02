
import API from '@/utils/apiClient';
import { CourseType } from '@/types/lecture';

export const lectureAPI = {
  // 강의 목록 조회
  getLectures: (category?: string) => {
    return API.get('/lectures', { params: { category } });
  },

  // 강의 상세 조회
  getLectureDetail: (lectureId: string) => {
    return API.get(`/lectures/${lectureId}`);
  },
  
  // 강의 등록 (강사용)
  createLecture: (lectureData: Partial<CourseType>) => {
    return API.post('/lectures', lectureData);
  }
};
