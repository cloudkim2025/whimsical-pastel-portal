
import API from '@/utils/apiClient';

export const aiAPI = {
  // AI 튜터 질문
  askAITutor: (courseId: string, question: string) => {
    return API.post('/ai/tutor', { courseId, question });
  },
  
  // AI 추천 강의
  getAIRecommendations: (userId?: string) => {
    return API.get('/ai/recommendations', { params: { userId } });
  }
};
