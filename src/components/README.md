
# 컴포넌트 라이브러리 (Component Library)

이 폴더에는 Aigongbu 웹사이트에서 사용되는 다양한 컴포넌트들이 포함되어 있습니다. 이 컴포넌트들은 UI 요소부터 기능적 컴포넌트까지 다양한 목적으로 사용되며, 일관된 디자인 시스템을 구현하는 데 기여합니다.

## 폴더 구조

```
components/
├── ui/                # 기본 UI 컴포넌트 (shadcn/ui 기반)
├── forms/             # 폼 관련 컴포넌트
├── navigation/        # 내비게이션 관련 컴포넌트
├── lectures/          # 강의 관련 컴포넌트
├── payment/           # 결제 관련 컴포넌트
├── instructor/        # 강사 관련 컴포넌트
├── company/           # 회사 소개 관련 컴포넌트
├── admin/             # 관리자 관련 컴포넌트
├── Header.tsx         # 사이트 헤더 컴포넌트
├── Footer.tsx         # 사이트 푸터 컴포넌트
├── Hero.tsx           # 메인 페이지 히어로 섹션
├── Features.tsx       # 기능 소개 섹션
├── Gallery.tsx        # 이미지 갤러리 컴포넌트
├── SearchModal.tsx    # 검색 모달 컴포넌트
├── CategoryNav.tsx    # 카테고리 내비게이션
├── ScrollToTop.tsx    # 스크롤 상단 이동 컴포넌트
├── EmailVerificationModal.tsx # 이메일 인증 모달
├── PopularLecturesCarousel.tsx # 인기 강의 캐러셀
├── FeaturedLecturesCarousel.tsx # 추천 강의 캐러셀
├── TutorShorts.tsx    # 튜터 소개 쇼츠 컴포넌트
├── ClassSections.tsx  # 강의 섹션 컴포넌트
├── InstructorRecruitment.tsx # 강사 모집 섹션
└── VideoLectureModal.tsx # 비디오 강의 모달
```

## 주요 컴포넌트 설명

### 1. 레이아웃 및 공통 컴포넌트

#### Header.tsx

웹사이트 상단에 위치하는 헤더 컴포넌트로, 로고, 내비게이션 링크, 검색 버튼, 인증 버튼/프로필을 포함합니다.

**주요 기능**:
- 반응형 디자인 (모바일/데스크톱)
- 로그인 상태에 따른 UI 변경
- 검색 모달 열기
- 투명 배경에서 스크롤 시 불투명하게 변하는 효과

**사용 컴포넌트**:
- `navigation/Logo`
- `navigation/NavigationLinks`
- `navigation/AuthButtons`
- `navigation/ProfileDropdown`
- `navigation/MobileMenu`

#### Footer.tsx

웹사이트 하단에 위치하는 푸터 컴포넌트로, 내비게이션 링크, 소셜 미디어 링크, 저작권 정보 등을 포함합니다.

**주요 기능**:
- 반응형 레이아웃
- 내비게이션 섹션
- 소셜 미디어 링크
- 회사 정보 및 저작권
- 뉴스레터 구독 양식

#### Hero.tsx

메인 페이지의 히어로 섹션으로, 웹사이트의 주요 가치 제안과 CTA 버튼을 표시합니다.

**주요 기능**:
- 애니메이션 효과
- 배경 이미지 또는 그라데이션
- 주요 헤드라인과 서브 텍스트
- CTA 버튼 (시작하기, 무료 체험 등)

### 2. 캐러셀 및 갤러리 컴포넌트

#### FeaturedLecturesCarousel.tsx

메인 페이지에 표시되는 추천 강의 캐러셀입니다.

**주요 기능**:
- 슬라이드 기능 (embla-carousel 사용)
- 자동 슬라이드 전환
- 강의 카드 표시
- 내비게이션 버튼 (이전/다음)

#### PopularLecturesCarousel.tsx

인기 있는 강의들을 슬라이드 형식으로 보여주는 캐러셀입니다.

**주요 기능**:
- 인기도 기준 강의 정렬
- 카테고리별 필터링 옵션
- 반응형 디자인 (화면 크기에 따라 표시 항목 수 조절)

#### Gallery.tsx

이미지 갤러리 컴포넌트로, 서비스 관련 이미지나 스크린샷을 표시합니다.

**주요 기능**:
- 그리드 또는 마소닉 레이아웃
- 이미지 클릭 시 확대 보기
- 애니메이션 효과

### 3. 내비게이션 컴포넌트

#### CategoryNav.tsx

강의 카테고리를 탐색할 수 있는 내비게이션 컴포넌트입니다.

**주요 기능**:
- 카테고리별 링크
- 아이콘과 텍스트 조합
- 호버 효과
- 반응형 디자인

#### ScrollToTop.tsx

페이지 하단에서 상단으로 스크롤할 수 있는 버튼 컴포넌트입니다.

**주요 기능**:
- 스크롤 위치에 따라 표시/숨김
- 스크롤 애니메이션
- 커스텀 디자인

### 4. 모달 컴포넌트

#### SearchModal.tsx

사이트 내 검색 기능을 제공하는 모달 컴포넌트입니다.

**주요 기능**:
- 실시간 검색 결과
- 키보드 내비게이션
- 자동 완성
- 최근 검색어 기록

#### EmailVerificationModal.tsx

이메일 인증을 위한 모달 컴포넌트입니다.

**주요 기능**:
- 인증 코드 입력 폼
- 타이머 카운트다운
- 재전송 기능
- 성공/실패 상태 표시

#### VideoLectureModal.tsx

강의 영상을 재생하기 위한 모달 컴포넌트입니다.

**주요 기능**:
- 비디오 플레이어 임베드
- 재생 컨트롤
- 영상 품질 설정
- 전체 화면 모드

### 5. 기능 및 섹션 컴포넌트

#### Features.tsx

서비스의 주요 기능을 소개하는 섹션 컴포넌트입니다.

**주요 기능**:
- 기능 카드 그리드
- 아이콘과 설명 텍스트
- 애니메이션 효과

#### ClassSections.tsx

강의를 카테고리별로 구분하여 보여주는 섹션 컴포넌트입니다.

**주요 기능**:
- 탭 인터페이스로 카테고리 전환
- 각 카테고리별 강의 목록 표시
- 더보기 링크

#### TutorShorts.tsx

강사들을 짧은 영상(쇼츠) 형식으로 소개하는 컴포넌트입니다.

**주요 기능**:
- 수직 스크롤 인터페이스
- 자동 재생 비디오
- 강사 정보 오버레이

#### InstructorRecruitment.tsx

강사 모집을 안내하고 지원할 수 있는 섹션 컴포넌트입니다.

**주요 기능**:
- 강사 혜택 소개
- 지원 방법 안내
- CTA 버튼 (강사 지원하기)

## 컴포넌트 개발 가이드라인

### 1. 컴포넌트 설계 원칙

- **단일 책임**: 각 컴포넌트는 하나의 명확한 책임만 가져야 합니다.
- **재사용성**: 여러 곳에서 사용될 수 있도록 컴포넌트를 일반화하세요.
- **props 인터페이스**: 모든 컴포넌트에는 명확한 props 타입 정의가 있어야 합니다.
- **접근성**: WCAG 지침을 준수하여 스크린 리더 지원, 키보드 내비게이션 등을 보장하세요.
- **반응형 디자인**: 모든 화면 크기에서 적절하게 작동해야 합니다.

### 2. 컴포넌트 구조

```typescript
// 컴포넌트 템플릿
import React from 'react';
import { cn } from '@/lib/utils';

// 컴포넌트 props 인터페이스 정의
interface MyComponentProps {
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

// 컴포넌트 구현
const MyComponent: React.FC<MyComponentProps> = ({ 
  title, 
  description = '기본 설명', // 기본값 제공
  className,
  children 
}) => {
  return (
    <div className={cn('base-styles-here', className)}>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      {children}
    </div>
  );
};

export default MyComponent;
```

### 3. Tailwind CSS 사용

- 클래스명 조합을 위해 `cn` 유틸리티 함수를 사용하세요.
- 반응형 디자인을 위해 Tailwind의 브레이크포인트 접두사(sm, md, lg, xl 등)를 활용하세요.
- 일관된 색상과 간격을 위해 Tailwind 테마 설정을 참조하세요.

### 4. 상태 관리

- 지역 상태는 `useState` 훅을 사용하세요.
- 복잡한 상태 로직은 `useReducer` 또는 커스텀 훅으로 분리하세요.
- 전역 상태는 컨텍스트 API를 활용하세요.

### 5. 성능 최적화

- `React.memo`를 사용하여 불필요한 리렌더링을 방지하세요.
- 이벤트 핸들러는 `useCallback`으로 래핑하세요.
- 계산 비용이 큰 함수는 `useMemo`를 활용하세요.
- 큰 목록은 가상화(virtualization)를 고려하세요.
