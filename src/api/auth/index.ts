// api/auth.ts
import API from '@/utils/apiClient';

export const authAPI = {
    registerPushToken: (payload: { fcmToken: string }) =>
        API.post('/noti/user/push-token', payload),
    // 이메일 인증 코드 전송
    sendVerificationCode: (email: string) =>
        API.post('/auths/email/send-code', { email }),

    // 이메일 인증 코드 검증
    verifyCode: (email: string, code: string) =>
        API.post('/auths/email/verify-code', { email, code }),

    // 회원가입 (FormData 기반)
    register: (formData: FormData) =>
        API.post('/auths/join', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    // 로그인
    login: (payload: { email: string; password: string }) =>
        API.post('/auths/login', payload),

    // 강제 로그인
    forceLogin: (payload: { email: string; password: string }) =>
        API.post('/auths/force-login', payload),

    // 로그아웃
    logout: () => API.delete('/auths/logout'),

    // 유저 정보 조회
    getUserInfo: () => API.get('/auths/api/info'),

    // 역할 조회 (권한 확인용)
    getUserRole: () => API.get('/auths/api/info-role'),

    getInstructorRole: () => API.get('/auths/teacher/role'),

    // 소셜 로그인 code/state 전달
    postOAuthCode: (payload: { code: string; state: string }) =>
        API.post('/auths/oauth/token', payload),

    // 닉네임 수정
    updateNickname: (nickname: string) =>
        API.put('/auths/api/nickname', { nickname }),

    // 비밀번호 수정
    updatePassword: (currentPassword: string, newPassword: string) =>
        API.put('/auths/api/password', { currentPassword, newPassword }),

    // 프로필 이미지 수정 (FormData 기반)
    updateProfileImage: (formData: FormData) =>
        API.put('/auths/api/profile-image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),

    // 회원 탈퇴
    deleteAccount: () => API.put('/auths/api/delete'),

    // 소셜 계정 연동 (쿼리 파라미터 방식)
    linkSocialAccount: (accessToken: string, provider: string) =>
        API.post(`/auths/oauth/link?provider=${provider}`, null, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
};
