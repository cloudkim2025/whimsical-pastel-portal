
# 커스텀 훅 컬렉션 (Custom Hooks Collection)

이 폴더에는 Aigongbu 프로젝트에서 사용되는 다양한 커스텀 React 훅들이 포함되어 있습니다. 이 훅들은 재사용 가능한 로직을 캡슐화하여 컴포넌트의 가독성과 유지보수성을 향상시킵니다.

## 주요 훅 설명

### useAuthWithRedirect.ts

**역할**: 사용자 인증 관련 기능을 제공하는 훅
**사용하는 곳**: AuthContext와 함께 사용되어 로그인, 로그아웃, 인증 상태 확인 등을 처리

**주요 기능**:
- 로그인 및 로그아웃 처리
- 현재 사용자 정보 관리
- 인증 상태 확인 (isAuthenticated)
- 토큰 관리 (저장, 갱신, 제거)
- 사용자 정보 업데이트

**사용 예시**:
```typescript
import { useAuthWithRedirect } from '@/hooks/useAuthWithRedirect';

const LoginComponent = () => {
  const { login, isAuthenticated, user, error } = useAuthWithRedirect();
  
  const handleSubmit = async (email: string, password: string) => {
    await login(email, password);
  };
  
  return (
    <div>
      {isAuthenticated ? (
        <p>환영합니다, {user?.nickname}님!</p>
      ) : (
        <LoginForm onSubmit={handleSubmit} error={error} />
      )}
    </div>
  );
};
```

### useEmailVerification.ts

**역할**: 이메일 인증 프로세스를 처리하는 훅
**사용하는 곳**: 회원가입, 비밀번호 재설정, 이메일 변경 등의 기능에서 사용

**주요 기능**:
- 인증 코드 요청 처리
- 인증 코드 확인
- 인증 상태 및 타이머 관리
- 인증 실패 시 재시도 로직

**사용 예시**:
```typescript
import { useEmailVerification } from '@/hooks/useEmailVerification';

const EmailVerificationComponent = ({ email }) => {
  const {
    sendVerificationCode,
    verifyCode,
    isCodeSent,
    isVerifying,
    isVerified,
    timeLeft,
    error
  } = useEmailVerification();
  
  return (
    <div>
      {!isCodeSent ? (
        <button onClick={() => sendVerificationCode(email)}>인증 코드 요청</button>
      ) : (
        <>
          <p>인증 코드가 발송되었습니다. 남은 시간: {timeLeft}초</p>
          <input
            type="text"
            placeholder="인증 코드 입력"
            onChange={(e) => setCode(e.target.value)}
          />
          <button onClick={() => verifyCode(code)}>확인</button>
        </>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};
```

### use-mobile.tsx

**역할**: 현재 화면이 모바일 크기인지 확인하는 반응형 디자인을 위한 훅
**사용하는 곳**: 반응형 레이아웃 구현이 필요한 모든 컴포넌트

**주요 기능**:
- 화면 크기 변화 감지
- 미디어 쿼리 기반 모바일/데스크톱 상태 제공
- 리사이즈 이벤트 최적화 (디바운싱)

**사용 예시**:
```typescript
import { useMobile } from '@/hooks/use-mobile';

const ResponsiveComponent = () => {
  const isMobile = useMobile();
  
  return (
    <div>
      {isMobile ? (
        <MobileLayout />
      ) : (
        <DesktopLayout />
      )}
    </div>
  );
};
```

### use-toast.ts

**역할**: 사용자에게 토스트 알림을 표시하는 기능을 제공하는 훅
**사용하는 곳**: 사용자에게 알림, 성공, 오류, 경고 등을 표시해야 하는 모든 컴포넌트

**주요 기능**:
- 다양한 유형의 토스트 알림 표시 (성공, 오류, 경고, 정보)
- 토스트 지속 시간 설정
- 토스트 알림 큐 관리
- 액션 버튼이 있는 토스트 지원

**사용 예시**:
```typescript
import { useToast } from '@/hooks/use-toast';

const FormComponent = () => {
  const { toast } = useToast();
  
  const handleSubmit = async (data) => {
    try {
      await submitData(data);
      toast({
        title: "성공!",
        description: "데이터가 성공적으로 저장되었습니다.",
        variant: "success"
      });
    } catch (error) {
      toast({
        title: "오류 발생",
        description: "데이터를 저장하는 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
};
```

### useAiCurriculum.ts

**역할**: AI 기반 커리큘럼 생성 및 관리 기능을 제공하는 훅
**사용하는 곳**: 강의 업로드 페이지, AI 추천 커리큘럼 기능

**주요 기능**:
- 주제 기반 커리큘럼 자동 생성
- 커리큘럼 항목 추가/편집/삭제
- 생성 상태 관리 (로딩, 오류 등)
- 생성된 커리큘럼 최적화 및 포맷팅

**사용 예시**:
```typescript
import { useAiCurriculum } from '@/hooks/useAiCurriculum';

const CurriculumGeneratorComponent = () => {
  const {
    generateCurriculum,
    curriculum,
    isGenerating,
    error,
    updateCurriculumItem,
    addCurriculumItem,
    removeCurriculumItem
  } = useAiCurriculum();
  
  return (
    <div>
      <input
        type="text"
        placeholder="강의 주제 입력"
        onChange={(e) => setTopic(e.target.value)}
      />
      <button onClick={() => generateCurriculum(topic)} disabled={isGenerating}>
        {isGenerating ? '생성 중...' : '커리큘럼 생성하기'}
      </button>
      
      {curriculum && (
        <CurriculumEditor
          curriculum={curriculum}
          onUpdate={updateCurriculumItem}
          onAdd={addCurriculumItem}
          onRemove={removeCurriculumItem}
        />
      )}
      
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};
```

## 훅 설계 원칙

이 프로젝트의 커스텀 훅들은 다음 원칙을 따라 설계되었습니다:

1. **단일 책임 원칙**: 각 훅은 명확히 정의된 하나의 책임만을 가집니다.
2. **재사용성**: 여러 컴포넌트에서 공통으로 사용되는 로직을 캡슐화합니다.
3. **상태 관리 분리**: UI 컴포넌트에서 상태 관리 로직을 분리하여 코드의 가독성을 높입니다.
4. **일관된 인터페이스**: 유사한 훅들은 일관된 API 패턴을 따릅니다.
5. **에러 처리**: 모든 훅은 적절한 에러 처리 메커니즘을 포함합니다.
6. **타입 안전성**: TypeScript를 활용하여 타입 안전성을 보장합니다.

## 새로운 훅 추가 가이드라인

프로젝트에 새로운 훅을 추가할 때는 다음 가이드라인을 따르세요:

1. 재사용 가능한 로직인지 확인하세요. 하나의 컴포넌트에서만 사용된다면 훅으로 분리할 필요가 없을 수 있습니다.
2. 명확한 이름을 사용하세요 (예: `useProductSearch`, `useFormValidation`).
3. 반환 값과 매개변수에 대한 명확한 TypeScript 타입을 정의하세요.
4. 가능한 경우 `README.md`에 새 훅에 대한 문서를 추가하세요.
5. 훅이 의존하는 외부 라이브러리나 API를 명확하게 문서화하세요.
