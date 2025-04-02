
# 페이지 컴포넌트 구조 (Page Components Structure)

이 폴더에는 Aigongbu 웹사이트의 각 페이지를 구성하는 메인 컴포넌트들이 포함되어 있습니다. 각 파일은 특정 URL 경로에 대응하는 페이지 컴포넌트를 정의합니다.

## 폴더 구조

```
pages/
├── auth/             # 인증 관련 페이지
│   ├── Login.tsx     # 로그인 페이지
│   ├── Register.tsx  # 회원가입 페이지
│   └── Profile.tsx   # 사용자 프로필 페이지
├── lectures/         # 강의 관련 페이지
│   ├── DevLectures.tsx     # 개발 강의 목록 페이지
│   ├── AILectures.tsx      # AI 강의 목록 페이지
│   ├── TopLectures.tsx     # 인기 강의 목록 페이지
│   ├── LectureDetail.tsx   # 강의 상세 페이지
│   └── LectureUpload.tsx   # 강의 업로드 페이지
├── payment/          # 결제 관련 페이지
│   ├── Checkout.tsx        # 결제 페이지
│   ├── PaymentHistory.tsx  # 결제 내역 페이지
│   ├── components/         # 결제 관련 컴포넌트
│   └── hooks/              # 결제 관련 커스텀 훅
├── instructor/       # 강사 관련 페이지
│   ├── InstructorApply.tsx # 강사 지원 페이지
│   └── CourseUpload.tsx    # 강의 업로드 페이지
├── admin/            # 관리자 관련 페이지
│   └── Admin.tsx     # 관리자 대시보드 페이지
├── Index.tsx         # 메인 페이지
├── CompanyInfo.tsx   # 회사 소개 페이지
├── Profile.tsx       # 사용자 프로필 페이지
├── NotFound.tsx      # 404 페이지
└── README.md         # 페이지 구조 설명
```

## 주요 페이지 설명

### 메인 페이지

**파일**: `Index.tsx`

**역할**: 웹사이트의 랜딩 페이지로, 주요 서비스와 특징을 소개합니다.

**주요 기능 및 구성**:
- 히어로 섹션 (Hero)
- 추천 강의 캐러셀 (FeaturedLecturesCarousel)
- 카테고리 내비게이션 (CategoryNav)
- 인기 강의 슬라이드 (PopularLecturesCarousel)
- 튜터 소개 쇼츠 형식 컨텐츠 (TutorShorts)
- 강의 분류 섹션 (ClassSections)
- 강사 모집 섹션 (InstructorRecruitment)
- 갤러리 및 기능 소개 (Gallery, Features)

**경로**: `/`

### 회사 소개 페이지

**파일**: `CompanyInfo.tsx`

**역할**: 회사의 비전, 철학, 특징을 소개합니다.

**주요 기능 및 구성**:
- 회사 비전 카드 (VisionCard)
- 서비스 특징 카드 (FeatureCards)
- 교육 철학 카드 (PhilosophyCard)
- 사용자 후기 섹션 (TestimonialsSection)
- 서비스 시작 유도 버튼

**경로**: `/company-info`

### 인증 페이지

**파일들**: 
- `auth/Login.tsx`
- `auth/Register.tsx`
- `Profile.tsx`

**역할**: 사용자 인증, 계정 생성, 프로필 관리 기능을 제공합니다.

**주요 기능 및 구성**:
- 로그인 폼 (이메일/비밀번호, 소셜 로그인)
- 회원가입 폼 (필수 정보 입력, 약관 동의)
- 사용자 프로필 정보 표시 및 수정
- 비밀번호 재설정
- 이메일 인증 모달

**경로**: 
- 로그인: `/login`
- 회원가입: `/register`
- 프로필: `/profile`

### 강의 관련 페이지

**파일들**:
- `lectures/DevLectures.tsx`
- `lectures/AILectures.tsx`
- `lectures/TopLectures.tsx`
- `lectures/LectureDetail.tsx`

**역할**: 강의 목록 조회, 상세 정보, 검색, 필터링, 수강 신청 기능을 제공합니다.

**주요 기능 및 구성**:
- 강의 목록 그리드 (카테고리별 분류)
- 검색 및 필터링 기능
- 강의 상세 정보 (설명, 커리큘럼, 강사 정보, 리뷰)
- 강의 미리보기 비디오
- 수강신청 버튼 및 장바구니 기능

**경로**:
- 개발 강의: `/dev-lectures`
- AI 강의: `/ai-lectures`
- 인기 강의: `/top-lectures`
- 강의 상세: `/lectures/:id`

### 결제 관련 페이지

**파일들**:
- `payment/Checkout.tsx`
- `payment/PaymentHistory.tsx`

**역할**: 강의 구매 결제 과정 및 결제 내역 조회 기능을 제공합니다.

**주요 기능 및 구성**:
- 주문 요약 정보 (OrderSummary)
- 결제 수단 선택 (PaymentMethods)
- 최종 결제 요약 및 결제 버튼 (CheckoutSummary)
- 결제 내역 목록 및 상세 정보
- 영수증 다운로드

**경로**:
- 결제 페이지: `/checkout`
- 결제 내역: `/payment-history`

### 강사 관련 페이지

**파일들**:
- `instructor/InstructorApply.tsx`
- `instructor/CourseUpload.tsx`

**역할**: 강사 지원 및 강의 콘텐츠 관리 기능을 제공합니다.

**주요 기능 및 구성**:
- 강사 지원 양식 (InstructorApplicationForm)
- 강의 업로드 및 관리 폼
- 비디오 업로드 및 미리보기
- 커리큘럼 구성 도구
- AI 기반 커리큘럼 생성 지원

**경로**:
- 강사 지원: `/instructor/apply`
- 강의 업로드: `/instructor/course-upload`

### 관리자 페이지

**파일**: `admin/Admin.tsx`

**역할**: 서비스 관리자를 위한 대시보드와 관리 도구를 제공합니다.

**주요 기능 및 구성**:
- 통계 대시보드 (사용자, 강의, 매출 등)
- 강사 관리 (신청서 검토, 승인, 거부)
- 강의 관리 (등록, 수정, 삭제, 승인)
- 사용자 관리 (계정 정보, 권한 설정)
- 결제 내역 및 정산 관리

**경로**: `/admin`

### 404 페이지

**파일**: `NotFound.tsx`

**역할**: 존재하지 않는 페이지에 접근했을 때 사용자에게 안내합니다.

**주요 기능 및 구성**:
- 오류 메시지 표시
- 홈페이지로 돌아가는 링크 제공
- 콘솔에 접근 시도된 잘못된 경로 기록

**경로**: 매칭되지 않는 모든 경로

## 페이지 컴포넌트 설계 원칙

1. **일관된 구조**: 모든 페이지는 Header와 Footer 컴포넌트를 포함하며, 내용이 적절히 중앙에 정렬됩니다.

2. **컴포넌트 분리**: 페이지 컴포넌트는 가능한 한 작고 집중적으로 유지하며, 복잡한 UI 요소는 별도의 컴포넌트로 분리합니다.

3. **데이터 흐름**: 데이터 fetching과 상태 관리 로직은 페이지 컴포넌트 또는 커스텀 훅에서 처리하고, 하위 컴포넌트에는 props로 전달합니다.

4. **라우팅 통합**: 모든 페이지 컴포넌트는 `App.tsx`의 React Router 설정에 등록되어야 합니다.

5. **권한 관리**: 인증이 필요한 페이지는 `useAuth` 훅을 사용하여 접근 권한을 확인하고, 필요시 로그인 페이지로 리디렉션합니다.

```jsx
// 권한 관리 예시
const ProtectedPage = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);
  
  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return null;
  
  return <div>접근이 허용된 페이지 내용</div>;
};
```
