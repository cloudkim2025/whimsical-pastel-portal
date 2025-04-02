
import API from '@/utils/apiClient';

export const verificationAPI = {
  // 강사 신청서 제출
  submitInstructorApplication: (applicationData: FormData) => {
    return API.post('/verification/instructor-apply', applicationData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  // 강사 신청 상태 확인
  checkInstructorStatus: () => {
    return API.get('/verification/instructor-status');
  }
};
