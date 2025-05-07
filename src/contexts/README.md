
# contexts 폴더

## 용도
전역 컨텍스트 기반 인증, 토글, 테마 등 상태관리 컨텍스트 저장.

## 주요 파일
- `AuthContext.tsx`: 로그인/회원가입/프로필 등 인증 상태 관리. 
  - 로그인, 로그아웃, 회원가입, 강제 로그인, 소셜 로그인 등 모든 인증 로직 담당.
  - `user` 오브젝트 유무로 전체 인증여부 처리.

## 개발자 참고
- 새 인증로직/상태 추가시 반드시 useContext, Provider 패턴 준수.
- 인증 관련 훅(예: useAuthWithRedirect)은 이 Context API를 확장해 사용.

### 제공하는 상태 및 기능

**상태:**
- `isAuthenticated`: 사용자 로그인 여부
- `user`: 현재 로그인한 사용자 정보 (null이면 로그인되지 않은 상태)
- `loading`: 인증 작업 중인지 여부
- `error`: 인증 과정에서 발생한 오류

**기능:**
- `login(email: string, password: string)`: 사용자 로그인 처리
- `register(userData: RegisterFormData)`: 새 사용자 등록
- `logout()`: 로그아웃 및 상태 초기화
- `updateProfile(userData: Partial<User>)`: 사용자 프로필 정보 업데이트
- `checkAuthStatus()`: 현재 인증 상태 확인 (페이지 새로고침시 등)
- `sendPasswordReset(email: string)`: 비밀번호 재설정 이메일 발송
- `resetPassword(token: string, newPassword: string)`: 비밀번호 재설정

### 사용 예시

```jsx
import { useAuthWithRedirect } from '@/contexts/AuthContext';

const ProfileComponent = () => {
  const { user, isAuthenticated, loading, updateProfile } = useAuthWithRedirect();

  if (loading) return <LoadingSpinner />;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  const handleNameUpdate = (newName) => {
    updateProfile({ nickname: newName });
  };
  
  return (
    <div>
      <h1>프로필: {user?.nickname}</h1>
      <p>이메일: {user?.email}</p>
      {/* 프로필 수정 폼 */}
    </div>
  );
};
```

### 구현 세부 사항

AuthContext는 JWT 기반 인증을 사용합니다. 토큰은 localStorage에 저장되며, API 요청 시 자동으로 인증 헤더에 포함됩니다. 토큰 만료 시 자동으로 재발급을 시도하며, 실패 시 사용자를 로그아웃 처리합니다.

```jsx
// AuthContext의 핵심 구현 부분
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // 토큰에서 사용자 정보 추출 및 상태 초기화
  const initializeAuth = async () => {
    try {
      const token = tokenManager.getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      
      const userData = tokenManager.getUserInfo();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('인증 초기화 오류:', err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    initializeAuth();
  }, []);
  
  // 로그인 함수
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authAPI.login(email, password);
      const { accessToken, user: userData } = response.data;
      
      tokenManager.setToken(accessToken);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (err) {
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
      console.error('로그인 오류:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // 로그아웃 함수
  const logout = () => {
    tokenManager.clearToken();
    setUser(null);
    setIsAuthenticated(false);
  };
  
  // Context 값 정의
  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    register,
    updateProfile,
    checkAuthStatus,
    sendPasswordReset,
    resetPassword
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

## 향후 추가될 컨텍스트

현재는 AuthContext만 구현되어 있지만, 애플리케이션의 필요에 따라 다음과 같은 컨텍스트를 추가할 수 있습니다:

### ThemeContext
사용자 테마 설정(라이트/다크 모드)과 언어 설정을 관리합니다.

### CartContext
강의 장바구니와 결제 과정을 관리합니다.

### NotificationContext
앱 내 알림을 관리합니다.

### LearningProgressContext
사용자의 학습 진도와 완료된 강의를 추적합니다.

## 컨텍스트 사용 가이드라인

1. **필요한 경우에만 사용**: 전역 상태가 정말 필요한 경우에만 컨텍스트를 사용하세요. 대부분의 상태는 컴포넌트 내부에서 관리하는 것이 좋습니다.

2. **성능 고려**: 컨텍스트 값이 자주 변경되는 경우, 불필요한 리렌더링을 방지하기 위해 `useMemo`와 `useCallback`을 사용하세요.

3. **분리된 컨텍스트**: 관련 없는 상태를 하나의 컨텍스트에 합치지 말고, 관심사에 따라 컨텍스트를 분리하세요.

4. **커스텀 훅 제공**: 각 컨텍스트에는 사용을 간편하게 하는 커스텀 훅을 함께 제공하세요 (예: `useAuthWithRedirect`, `useTheme`).

```jsx
// 커스텀 훅 예시
export const useAuthWithRedirect = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다');
  }
  return context;
};
```

5. **에러 처리**: 컨텍스트를 제대로 사용하지 않는 경우를 대비해 적절한 에러 메시지를 제공하세요.
