
# 유틸리티 함수 모음 (Utility Functions Collection)

이 폴더에는 Aigongbu 프로젝트 전반에 걸쳐 사용되는 공통 유틸리티 함수들이 포함되어 있습니다. 이 함수들은 코드 재사용성을 높이고 중복을 줄이며, 일관된 기능 구현을 보장합니다.

## 주요 유틸리티 파일

### apiClient.ts

백엔드 API와의 통신을 위한 Axios 인스턴스 및 관련 설정을 제공합니다.

**주요 기능**:
- 기본 설정(base URL, 타임아웃, 헤더 등)이 적용된 Axios 인스턴스 생성
- 인증 토큰 자동 첨부를 위한 요청 인터셉터
- 토큰 만료 처리를 위한 응답 인터셉터
- 공통 에러 처리 로직

**사용 예시**:
```typescript
import apiClient from '@/utils/apiClient';

// GET 요청
const fetchData = async () => {
  try {
    const response = await apiClient.get('/lectures');
    return response.data;
  } catch (error) {
    console.error('데이터 조회 실패:', error);
    throw error;
  }
};

// POST 요청
const createData = async (data) => {
  try {
    const response = await apiClient.post('/lectures', data);
    return response.data;
  } catch (error) {
    console.error('데이터 생성 실패:', error);
    throw error;
  }
};
```

### tokenManager.ts

JWT 토큰 관리와 관련된 기능을 제공합니다.

**주요 기능**:
- 토큰 저장, 조회, 삭제
- 토큰에서 사용자 정보 추출 (JWT decode)
- 토큰 유효성 검증
- 토큰 만료 시간 계산
- 리프레시 토큰 관리

**사용 예시**:
```typescript
import { tokenManager } from '@/utils/tokenManager';

// 토큰 저장
tokenManager.setToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');

// 토큰 조회
const token = tokenManager.getToken();

// 토큰에서 사용자 정보 추출
const userInfo = tokenManager.getUserInfo();
console.log('사용자 ID:', userInfo.id);
console.log('사용자 역할:', userInfo.role);

// 토큰 유효성 검사
const isValid = tokenManager.isTokenValid();
if (!isValid) {
  // 토큰이 만료되었거나 유효하지 않음
  console.log('다시 로그인이 필요합니다.');
}

// 토큰 삭제 (로그아웃 시)
tokenManager.clearToken();
```

### auth.ts

인증 관련 헬퍼 함수들을 제공합니다.

**주요 기능**:
- 비밀번호 유효성 검사
- 이메일 유효성 검사
- 권한 확인 유틸리티
- 소셜 로그인 URL 생성

**사용 예시**:
```typescript
import { validatePassword, validateEmail, hasPermission } from '@/utils/auth';

// 비밀번호 유효성 검사
const isPasswordValid = validatePassword('myPassword123!');
console.log('비밀번호 유효성:', isPasswordValid);

// 이메일 유효성 검사
const isEmailValid = validateEmail('user@example.com');
console.log('이메일 유효성:', isEmailValid);

// 권한 확인
const canAccessAdminPanel = hasPermission(user, 'admin.access');
if (canAccessAdminPanel) {
  // 관리자 패널 액세스 허용
}
```

### utils.ts

기타 공통 유틸리티 함수들을 제공합니다.

**주요 기능**:
- 날짜 포맷팅
- 문자열 처리 (truncate, capitalize 등)
- 숫자 포맷팅 (통화, 퍼센트 등)
- 배열 처리 (그룹화, 정렬, 필터링 등)
- 디바운싱 및 쓰로틀링
- 클래스명 조합 유틸리티 (cn)

**사용 예시**:
```typescript
import { cn, formatDate, formatCurrency, debounce } from '@/lib/utils';

// 클래스명 조합
const className = cn(
  'base-class',
  isActive && 'active-class',
  size === 'large' ? 'large-class' : 'default-size'
);

// 날짜 포맷팅
const formattedDate = formatDate(new Date(), 'YYYY년 MM월 DD일');
console.log('포맷된 날짜:', formattedDate);

// 통화 포맷팅
const formattedPrice = formatCurrency(29000, 'KRW');
console.log('포맷된 가격:', formattedPrice); // ₩29,000

// 디바운싱 함수
const handleSearch = debounce((searchTerm) => {
  fetchSearchResults(searchTerm);
}, 300);

// 사용
input.addEventListener('input', (e) => handleSearch(e.target.value));
```

## 유틸리티 함수 작성 가이드라인

### 1. 순수 함수 지향

유틸리티 함수는 가능한 한 순수 함수로 작성하세요. 동일한 입력에 대해 항상 동일한 출력을 반환하고, 부작용(side effects)이 없어야 합니다.

```typescript
// 잘못된 예 (외부 상태에 의존)
let cachedValue = null;
const getValue = (id) => {
  if (cachedValue) return cachedValue;
  cachedValue = fetchFromAPI(id);
  return cachedValue;
};

// 좋은 예 (순수 함수)
const calculateTotal = (items) => {
  return items.reduce((total, item) => total + item.price, 0);
};
```

### 2. 단일 책임 원칙

각 함수는 하나의 명확한 역할만 수행해야 합니다. 여러 기능을 하는 함수는 작은 단위로 분리하세요.

```typescript
// 잘못된 예 (너무 많은 기능)
const processUserData = (userData) => {
  // 유효성 검사
  // 데이터 변환
  // API 호출
  // 응답 처리
  // ...
};

// 좋은 예 (기능별로 분리)
const validateUserData = (userData) => { /* ... */ };
const transformUserData = (userData) => { /* ... */ };
const saveUserData = async (userData) => { /* ... */ };
```

### 3. 명확한 네이밍

함수와 변수의 이름은 그 역할을 명확히 드러내야 합니다. 약어보다는 설명적인 이름을 사용하세요.

```typescript
// 잘못된 예
const fmt = (d) => { /* 날짜 포맷팅 */ };
const chk = (v) => { /* 값 검증 */ };

// 좋은 예
const formatDate = (date) => { /* 날짜 포맷팅 */ };
const validateInput = (value) => { /* 값 검증 */ };
```

### 4. 에러 처리

함수에서 발생할 수 있는 예외 상황을 명확히 처리하세요. 예외가 발생하면 명확한 에러 메시지를 반환하거나 throw하세요.

```typescript
const divide = (a, b) => {
  if (b === 0) {
    throw new Error('0으로 나눌 수 없습니다.');
  }
  return a / b;
};
```

### 5. 문서화

복잡하거나 중요한 함수에는 JSDoc 주석을 추가하여 사용 방법과 매개변수, 반환값을 명시하세요.

```typescript
/**
 * 두 날짜 사이의 일 수를 계산합니다.
 * 
 * @param {Date} startDate - 시작 날짜
 * @param {Date} endDate - 종료 날짜
 * @returns {number} 두 날짜 사이의 일 수
 * @throws {Error} startDate가 endDate보다 나중이면 에러가 발생합니다.
 */
const getDaysBetweenDates = (startDate, endDate) => {
  if (startDate > endDate) {
    throw new Error('시작 날짜는 종료 날짜보다 이전이어야 합니다.');
  }
  // 계산 로직...
};
```

### 6. 타입 안전성

TypeScript의 장점을 최대한 활용하여 매개변수와 반환값의 타입을 명확히 지정하세요.

```typescript
// 잘못된 예
const calculateDiscount = (price, percentage) => {
  return price * (percentage / 100);
};

// 좋은 예
const calculateDiscount = (price: number, percentage: number): number => {
  return price * (percentage / 100);
};
```
