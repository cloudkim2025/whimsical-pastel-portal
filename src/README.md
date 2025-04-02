
# MSA 기반 프론트엔드 아키텍처

## 서비스 포트 구성
- Front-service: 8082
- Edge-service 게이트웨이 (webflux): 9000
- Auth-service: 9001
- Payment-service (webflux): 9002
- Verification-service = dispatcher (function context): 9003
- Lecture-service: 9004
- Video-lecture-service: 9005
- AI-service: 9006

## 폴더 구조 설명

```
src/
├── api/                  # API 서비스 정의 및 모듈화 (백엔드 서비스별로 분리)
│   ├── auth/             # Auth-Service 관련 API
│   ├── payment/          # Payment-Service 관련 API
│   ├── lecture/          # Lecture-Service 관련 API
│   ├── verification/     # Verification-Service 관련 API
│   ├── video/            # Video-lecture-Service 관련 API
│   ├── ai/               # AI-Service 관련 API
│   └── index.ts          # API 모듈들을 모아 export
│
├── components/           # 공통 UI 컴포넌트들
│   ├── ui/               # shadcn/ui 컴포넌트들
│   ├── forms/            # 폼 관련 컴포넌트들
│   ├── Header.tsx        # 헤더 컴포넌트
│   └── Footer.tsx        # 푸터 컴포넌트
│
├── contexts/             # React Context API를 활용한 전역 상태
│   └── AuthContext.tsx   # 인증 관련 컨텍스트
│
├── hooks/                # 커스텀 훅 정의
│   ├── useAuth.ts        # 인증 관련 훅
│   └── useEmailVerification.ts # 이메일 인증 관련 훅
│
├── pages/                # 라우팅 단위로 분리된 페이지 컴포넌트들
│   ├── auth/             # 인증 관련 페이지
│   │   ├── Login.tsx     # 로그인 페이지
│   │   ├── Register.tsx  # 회원가입 페이지
│   │   └── Profile.tsx   # 프로필 페이지
│   ├── courses/          # 강의 관련 페이지
│   │   ├── DevCourses.tsx # 개발 강의 목록
│   │   ├── AICourses.tsx # AI 강의 목록
│   │   └── CourseDetail.tsx # 강의 상세 페이지
│   ├── payment/          # 결제 관련 페이지
│   │   ├── Checkout.tsx  # 결제 페이지
│   │   └── PaymentHistory.tsx # 결제 내역 페이지
│   ├── instructor/       # 강사 관련 페이지
│   │   ├── CourseUpload.tsx # 강의 업로드 페이지
│   │   └── InstructorApply.tsx # 강사 지원 페이지
│   ├── admin/            # 관리자 관련 페이지
│   │   └── Admin.tsx     # 관리자 페이지
│   ├── Index.tsx         # 메인 페이지
│   ├── CompanyInfo.tsx   # 회사 소개 페이지
│   └── NotFound.tsx      # 404 페이지
│
├── types/                # 타입 정의
│   ├── auth.ts           # 인증 관련 타입
│   ├── course.ts         # 강의 관련 타입
│   ├── payment.ts        # 결제 관련 타입
│   └── instructor.ts     # 강사 관련 타입
│
├── utils/                # 공통 유틸 함수들
│   ├── apiClient.ts      # axios 인스턴스 설정 등
│   └── tokenManager.ts   # 토큰 관리 유틸리티
│
├── App.tsx               # 루트 컴포넌트 (라우팅 설정 포함)
└── main.tsx              # ReactDOM 렌더링 진입점
```

## API 모듈 사용 예시

```typescript
import { authAPI } from '@/api/auth';

// 로그인
const login = async (email: string, password: string) => {
  try {
    const response = await authAPI.login(email, password);
    // 응답 처리
  } catch (error) {
    // 에러 처리
  }
};
```

## 토큰 관리 예시

```typescript
import { tokenManager } from '@/utils/tokenManager';

// 토큰 저장
tokenManager.setToken('accessToken');

// 토큰 조회
const token = tokenManager.getToken();

// 토큰에서 사용자 정보 조회
const userInfo = tokenManager.getUserInfo();
```

## 전역 상태 접근 예시

```typescript
import { useAuth } from '@/contexts/AuthContext';

const MyComponent = () => {
  const { isAuthenticated, user, login, logout } = useAuth();
  
  // 인증 상태에 따른 UI 렌더링
};
```

## 이 구조의 장점

1. 백엔드 MSA 구조와 일관성 있는 프론트엔드 구조
2. 서비스별 관심사 분리로 코드 유지보수성 향상
3. API 호출 로직 중앙화로 백엔드 인터페이스 변경 시 영향도 최소화
4. 타입 정의를 통한 타입 안정성 확보
5. 재사용 가능한 컴포넌트와 훅으로 개발 효율성 향상
