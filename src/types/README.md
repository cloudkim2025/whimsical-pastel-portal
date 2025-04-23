
# 타입 정의 모듈 (Type Definition Modules)

이 폴더에는 Aigongbu 프로젝트에서 사용되는 TypeScript 타입 및 인터페이스 정의가 포함되어 있습니다. 일관된 타입 시스템을 통해 코드의 안정성을 높이고, 개발 시 자동 완성 및 타입 검사 기능을 활용할 수 있습니다.

## 주요 타입 모듈



사용자 인증 및 계정 관리와 관련된 타입을 정의합니다.

**주요 타입**:
- `User`: 사용자 정보 인터페이스
- `AuthContextType`: 인증 컨텍스트에서 제공하는 값의 타입
- `LoginRequest`: 로그인 요청 데이터 타입
- `RegisterRequest`: 회원가입 요청 데이터 타입
- `AuthResponse`: 인증 응답 데이터 타입

**예시**:
```typescript
export interface User {
  id: string;
  email: string;
  nickname: string;
  role: 'user' | 'instructor' | 'admin';
  avatar?: string;
  createdAt: string;
  isEmailVerified: boolean;
  bio?: string;
  socialProvider?: 'google' | 'kakao' | 'naver' | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}
```

### lecture.ts

강의 및 커리큘럼 관련 타입을 정의합니다.

**주요 타입**:
- `Lecture`: 강의 정보 인터페이스
- `LessonItem`: 강의 내 개별 수업 항목
- `Curriculum`: 강의 커리큘럼 구조
- `Category`: 강의 카테고리
- `LectureReview`: 강의 리뷰 정보

**예시**:
```typescript
export interface Lecture {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  instructorId: string;
  instructor: {
    id: string;
    name: string;
    avatar?: string;
    bio?: string;
  };
  thumbnail: string;
  price: number;
  discountPrice?: number;
  category: string;
  subcategory?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  totalDuration: number; // 분 단위
  totalLessons: number;
  rating: number;
  reviewCount: number;
  enrolledCount: number;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  tags: string[];
}

export interface LessonItem {
  id: string;
  title: string;
  description?: string;
  videoUrl?: string;
  duration: number;
  order: number;
  isPreview: boolean;
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: 'pdf' | 'code' | 'image' | 'other';
  }[];
}
```

### payment.ts

결제 및 주문 관련 타입을 정의합니다.

**주요 타입**:
- `PaymentMethod`: 지원되는 결제 수단
- `PaymentStatus`: 결제 상태
- `Order`: 주문 정보
- `PaymentRequest`: 결제 요청 데이터
- `PaymentResponse`: 결제 응답 데이터
- `PaymentHistory`: 결제 내역 조회 결과

**예시**:
```typescript
export type PaymentMethod = 'card' | 'kakaopay' | 'naverpay' | 'bank' | 'phone';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Order {
  id: string;
  userId: string;
  lectureId: string;
  lecture: {
    title: string;
    thumbnail: string;
    instructorName: string;
  };
  amount: number;
  originalAmount: number;
  discountAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  merchantUid: string;
  paymentKey?: string;
  receiptUrl?: string;
  orderedAt: string;
  completedAt?: string;
}
```

### instructor.ts

강사 및 강사 신청 관련 타입을 정의합니다.

**주요 타입**:
- `InstructorProfile`: 강사 프로필 정보
- `InstructorApplication`: 강사 지원 신청 정보
- `InstructorStats`: 강사 통계 정보
- `ApplicationStatus`: 지원서 처리 상태

**예시**:
```typescript
export interface InstructorProfile extends User {
  specialization: string[];
  education: string;
  experience: string[];
  certificates: {
    name: string;
    issuer: string;
    year: number;
  }[];
  website?: string;
  socialLinks?: {
    youtube?: string;
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  lectureCount: number;
  studentCount: number;
  averageRating: number;
}

export type ApplicationStatus = 'pending' | 'reviewing' | 'approved' | 'rejected';

export interface InstructorApplication {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  specialization: string[];
  education: string;
  experience: string;
  motivation: string;
  portfolioUrl?: string;
  resume?: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  reviewedAt?: string;
  reviewerNotes?: string;
}
```

### admin.ts

관리자 기능 관련 타입을 정의합니다.

**주요 타입**:
- `AdminStats`: 관리자 대시보드 통계 정보
- `UserManagementFilters`: 사용자 관리 필터 옵션
- `LectureApprovalRequest`: 강의 승인 요청 정보

**예시**:
```typescript
export interface AdminStats {
  userCount: {
    total: number;
    active: number;
    new: number;
  };
  lectureCount: {
    total: number;
    published: number;
    pendingApproval: number;
  };
  revenue: {
    total: number;
    monthly: number;
    daily: number;
  };
  instructorCount: {
    total: number;
    pendingApproval: number;
  };
}

export interface UserManagementFilters {
  role?: 'user' | 'instructor' | 'admin';
  status?: 'active' | 'suspended' | 'all';
  sortBy?: 'createdAt' | 'email' | 'role';
  sortOrder?: 'asc' | 'desc';
  search?: string;
  page: number;
  limit: number;
}
```

## 타입 사용 지침

### 1. 명확한 네이밍

타입과 인터페이스의 이름은 명확하고 설명적이어야 합니다. 접미사를 사용하여 타입의 역할을 나타낼 수 있습니다.
- 요청 데이터: `...Request`
- 응답 데이터: `...Response`
- 컨텍스트: `...Context` 또는 `...ContextType`

### 2. 재사용 가능한 타입 작성

동일한 구조가 여러 곳에서 사용되는 경우 중복을 피하기 위해 타입을 분리하고 재사용합니다.

```typescript
// 잘못된 예
interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  age: number;
}

interface UpdateUserRequest {
  email: string;
  password?: string;
  name: string;
  age: number;
}

// 좋은 예
interface UserBase {
  email: string;
  name: string;
  age: number;
}

interface CreateUserRequest extends UserBase {
  password: string;
}

interface UpdateUserRequest extends Partial<UserBase> {
  password?: string;
}
```

### 3. 유틸리티 타입 활용

TypeScript에서 제공하는 유틸리티 타입을 적극 활용하여 코드 중복을 줄입니다.
- `Partial<T>`: 모든 속성을 선택적으로 만듦
- `Required<T>`: 모든 속성을 필수로 만듦
- `Pick<T, K>`: 특정 속성만 선택
- `Omit<T, K>`: 특정 속성을 제외
- `Record<K, T>`: 키-값 쌍 레코드 생성

### 4. 엄격한 타입 정의

가능한 한 `any` 타입 사용을 피하고, 구체적인 타입을 정의하세요. 필요한 경우 유니온 타입을 사용합니다.

```typescript
// 지양해야 할 방식
function processData(data: any): any {
  // ...
}

// 권장하는 방식
type DataType = 'user' | 'lecture' | 'payment';

interface ProcessResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

function processData<T>(type: DataType, data: T): ProcessResult<T> {
  // ...
}
```

### 5. 문서화

복잡한 타입이나 중요한 인터페이스에는 JSDoc 주석을 추가하여 문서화하세요.

```typescript
/**
 * 사용자 계정 정보를 나타내는 인터페이스
 * 
 * @property id - 사용자의 고유 식별자
 * @property email - 사용자 이메일 (로그인 아이디로 사용)
 * @property nickname - 사용자가 선택한 표시 이름
 * @property role - 사용자 권한 수준
 */
export interface User {
  id: string;
  email: string;
  nickname: string;
  role: 'user' | 'instructor' | 'admin';
  // ...
}
```

### 6. 열거형(enum) vs 유니온 타입

TypeScript에서는 열거형(enum)보다 유니온 타입을 권장합니다. 유니온 타입이 더 타입 안전하고 트리 쉐이킹에 유리합니다.

```typescript
// 지양해야 할 방식
enum Role {
  User = 'user',
  Instructor = 'instructor',
  Admin = 'admin'
}

// 권장하는 방식
type Role = 'user' | 'instructor' | 'admin';
```
