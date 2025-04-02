
import API from '@/utils/apiClient';

export const videoAPI = {
  // 비디오 스트리밍 URL 가져오기
  getVideoStreamUrl: (videoId: string) => {
    return API.get(`/video/${videoId}/stream`);
  },
  
  // 비디오 정보 가져오기
  getVideoInfo: (videoId: string) => {
    return API.get(`/video/${videoId}/info`);
  },
  
  // 시청 기록 저장
  saveWatchHistory: (videoId: string, progress: number) => {
    return API.post(`/video/${videoId}/progress`, { progress });
  }
};
