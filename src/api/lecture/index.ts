import API from '@/utils/apiClient';

export const lectureAPI = {
  // 강의 목록 조회
  getLectures: (category?: string) => {
    return API.get('/lectures', { params: { category } });
  },

  // 강의 상세 조회
  getLectureDetail: (lectureId: string) => {
    return API.get(`/lectures/detail/${lectureId}`);
  },

  // 강의 등록 (강사용)
  createLecture: (lectureFormData: FormData) => {
    return API.post('/lectures', lectureFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
};