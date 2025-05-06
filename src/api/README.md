
# API 서비스 모듈 (API Service Modules)

이 폴더에는 Aigongbu 백엔드 마이크로서비스와 통신하기 위한 API 모듈들이 포함되어 있습니다. 각 폴더는 특정 백엔드 서비스와 통신하는 함수들을 캡슐화하여, 프론트엔드 코드에서 API 호출을 일관되고 재사용 가능한 방식으로 처리할 수 있게 합니다.

## 폴더 구조

```
api/
├── auth/             # 인증 관련 API (Auth-Service: 9001)
├── payment/          # 결제 관련 API (Payment-Service: 9002)
├── verification/     # 확인 관련 API (Verification-Service: 9003)
├── lecture/          # 강의 관련 API (Lecture-Service: 9004)
├── video/            # 비디오 관련 API (Video-lecture-Service: 9005)
├── ai/               # AI 관련 API (AI-Service: 9006)
└── index.ts          # API 모듈 통합 및 내보내기
```

## 서비스별 API 모듈

### 1. auth API (인증 서비스)

**파일 경로**: `api/auth/index.ts`

**주요 기능**:
- 사용자 로그인 및 로그아웃
- 회원가입 및 이메일 인증
- 비밀번호 재설정
- 사용자 프로필 정보 조회 및 업데이트
- 액세스 토큰 재발급

**사용 예시**:
```typescript
import { authAPI } from '@/api';

// 로그인
const loginUser = async (email: string, password: string) => {
  try {
    const response = await authAPI.login(email, password);
    return response.data;
  } catch (error) {
    console.error('로그인 실패:', error);
    throw error;
  }
};
```

### 2. payment API (결제 서비스)

**파일 경로**: `api/payment/index.ts`

**주요 기능**:
- 결제 프로세스 시작 및 완료
- 결제 내역 조회
- 환불 요청 처리
- 결제 상태 확인
- 할인 코드 검증

**사용 예시**:
```typescript
import { paymentAPI } from '@/api';

// 결제 내역 조회
const fetchPaymentHistory = async (userId: string) => {
  try {
    const response = await paymentAPI.getPaymentHistory(userId);
    return response.data;
  } catch (error) {
    console.error('결제 내역 조회 실패:', error);
    throw error;
  }
};
```

### 3. verification API (확인 서비스)

**파일 경로**: `api/verification/index.ts`

**주요 기능**:
- 이메일 인증 코드 발송 및 확인
- SMS 인증 코드 발송 및 확인
- 본인 인증 처리
- 강사 자격 인증

**사용 예시**:
```typescript
import { verificationAPI } from '@/api';

// 이메일 인증 코드 발송
const sendVerificationEmail = async (email: string) => {
  try {
    const response = await verificationAPI.sendEmailVerification(email);
    return response.data;
  } catch (error) {
    console.error('이메일 인증 코드 발송 실패:', error);
    throw error;
  }
};
```

### 4. lecture API (강의 서비스)

**파일 경로**: `api/lecture/index.ts`

**주요 기능**:
- 강의 목록 조회 (카테고리별, 인기순, 최신순)
- 강의 상세 정보 조회
- 강의 검색
- 강의 평가 및 리뷰
- 강의 등록 및 관리 (강사용)

**사용 예시**:
```typescript
import { lectureAPI } from '@/api';

// 카테고리별 강의 조회
const fetchLecturesByCategory = async (category: string) => {
  try {
    const response = await lectureAPI.getLecturesByCategory(category);
    return response.data;
  } catch (error) {
    console.error('강의 목록 조회 실패:', error);
    throw error;
  }
};
```

### 5. video API (비디오 강의 서비스)

**파일 경로**: `api/video/index.ts`

**주요 기능**:
- 비디오 스트리밍 URL 요청
- 시청 기록 저장 및 조회
- 비디오 품질 설정
- 시청 진도율 관리
- 비디오 자료 다운로드

**사용 예시**:
```typescript
import { videoAPI } from '@/api';

// 비디오 스트리밍 URL 요청
const getVideoStreamUrl = async (lectureId: string, lessonId: string) => {
  try {
    const response = await videoAPI.getStreamingUrl(lectureId, lessonId);
    return response.data.streamUrl;
  } catch (error) {
    console.error('비디오 스트리밍 URL 요청 실패:', error);
    throw error;
  }
};
```

### 6. ai API (AI 서비스)

**파일 경로**: `api/ai/index.ts`

**주요 기능**:
- AI 추천 강의 조회
- 학습 경로 추천
- 학습 진도 분석
- 커리큘럼 자동 생성
- AI 챗봇 질의응답

**사용 예시**:
```typescript
import { aiAPI } from '@/api';

// AI 추천 강의 조회
const getRecommendedLectures = async (userId: string) => {
  try {
    const response = await aiAPI.getRecommendations(userId);
    return response.data.recommendations;
  } catch (error) {
    console.error('AI 추천 요청 실패:', error);
    throw error;
  }
};
```

## 통합 API 모듈 (index.ts)

**파일 경로**: `api/index.ts`

이 파일은 모든 API 모듈을 통합하고 내보내어, 애플리케이션의 다른 부분에서 쉽게 가져다 사용할 수 있게 합니다.

```typescript
// 예시 코드
import * as authAPI from './auth';
import * as paymentAPI from './payment';
import * as verificationAPI from './verification';
import * as lectureAPI from './lecture';
import * as videoAPI from './video';
import * as aiAPI from './ai';

export {
  authAPI,
  paymentAPI,
  verificationAPI,
  lectureAPI,
  videoAPI,
  aiAPI
};
```

## API 클라이언트 설정

모든 API 모듈은 `/utils/apiClient.ts`에 정의된 공통 Axios 인스턴스를 사용합니다. 이 인스턴스는 기본 URL, 헤더, 인터셉터 등의 설정을 포함하고 있습니다.

```typescript
// utils/apiClient.ts 예시
import axios from 'axios';
import { tokenManager } from './tokenManager';

const apiClient = axios.create({
  baseURL: 'https://api.aigongbu.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 설정 (인증 토큰 자동 추가)
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 설정 (토큰 만료 처리 등)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // 토큰 갱신 시도
        const newToken = await refreshToken();
        tokenManager.setToken(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그아웃 처리
        tokenManager.clearToken();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

## 에러 핸들링

각 API 모듈은 일관된 에러 처리 패턴을 따르고 있습니다. 가능한 모든 에러를 try-catch 블록으로 감싸고, 적절한 오류 메시지와 함께 상위 컴포넌트로 에러를 전파합니다.

## 비동기 처리

모든 API 호출은 Promise 기반의 비동기 함수로 구현되어 있으며, async/await 구문을 통해 호출할 수 있습니다. 대부분의 API 함수는 데이터를 직접 반환하거나, 에러 발생 시 예외를 throw합니다.
