//pages/auth/OAuthRedirectHandler.tsx

import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '@/api/auth';
import { tokenManager } from '@/utils/tokenManager';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const OAuthRedirectHandler = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { updateUserFromToken } = useAuth();
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const returnedState = params.get('state');

        const savedState = localStorage.getItem('oauth_state'); // 이전에 저장해둔 state

        // 기본 예외 처리
        if (!code || !returnedState || !savedState || returnedState !== savedState) {
            toast.error('잘못된 접근입니다. 다시 시도해주세요.');
            navigate('/login');
            return;
        }
        localStorage.removeItem('oauth_state');

        const exchangeCode = async () => {
            try {
                const res = await authAPI.postOAuthCode({ code, state: returnedState });
                const { accessToken, needsLinking, message } = res.data;

                if (needsLinking) {
                    toast.custom((id) => (
                        <div className="flex flex-col gap-3 p-4">
                            <p className="text-sm">기존 계정이 존재합니다. 연동하시겠습니까?</p>
                            <div className="flex justify-end gap-2">
                                <button
                                    className="text-sm px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                                    onClick={() => {
                                        toast.dismiss(id);
                                        toast.info('연동이 취소되었습니다.');
                                        navigate('/login');
                                    }}
                                >
                                    취소
                                </button>
                                <button
                                    className="text-sm px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600"
                                    onClick={async () => {
                                        try {
                                            toast.dismiss(id);
                                            const provider = 'NAVER'; // or 가져온 값
                                            await authAPI.linkSocialAccount(accessToken, provider);
                                            tokenManager.setToken(accessToken);
                                            updateUserFromToken();
                                            toast.success('연동 완료! 로그인되었습니다.');
                                            navigate('/');
                                        } catch {
                                            toast.error('연동에 실패했습니다.');
                                            navigate('/login');
                                        }
                                    }}
                                >
                                    연동하기
                                </button>
                            </div>
                        </div>
                    ));
                    return;
                }

                tokenManager.setToken(accessToken);
                updateUserFromToken();
                toast.success(message || '소셜 로그인 성공!');
                navigate('/');
            } catch (e) {
                toast.error('소셜 로그인에 실패했습니다.');
                navigate('/login');
            }
        };

        exchangeCode();

        window.history.replaceState({}, document.title, '/login/oauth2/redirect');
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center text-lg text-ghibli-stone">
            로그인 처리 중입니다...
        </div>
    );
};

export default OAuthRedirectHandler;
