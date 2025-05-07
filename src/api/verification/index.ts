
import API from '@/utils/apiClient';

export const verificationAPI = {
  // 강사 신청서 제출
  /**
   * 강사 신청
   * @param payload { name, bio, category, profileImage: File, resume: File }
   */
  applyForTeacher: (formData: FormData) => {
    return API.post('/auths/teacher/apply', formData); // return!!! 💥
  },

  /**
   * 강사 신청 상태 변경 (승인/거절)
   * @param userId - 대상 유저 ID
   * @param selectStatus - true: 승인, false: 거절
   */
  updateTeacherStatus: (id: number, selectStatus: boolean) => {
    const formData = new FormData();
    formData.append('id', String(id));
    formData.append('selectStatus', String(selectStatus));
    return API.put('/auths/teacher/status', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /**
   * 강사 목록 조회 (관리자)
   * @param page - 페이지 번호 (기본 1)
   * @param size - 페이지 사이즈 (기본 10)
   * @param status - 필터할 신청 상태 (optional)
   */
  getTeacherList: (page: number = 1, size: number = 10, status?: string) =>
      API.get('/auths/teacher/admin/getAdminTeacherDetailPage', {
        params: { page, size, status },
      }),

  /**
   * 강사 상세 조회 (관리자)
   * @param userId - 조회할 유저 ID
   */
  getAdminTeacherDetail: (id: number) =>
      API.post('/auths/teacher/admin/getAdminTeacherDetail', { id }),
};
