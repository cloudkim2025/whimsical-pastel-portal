
# 내비게이션 컴포넌트 (Navigation Components)

이 폴더에는 Aigongbu 웹사이트의 내비게이션 관련 컴포넌트들이 포함되어 있습니다. 사용자 인터페이스의 핵심 내비게이션 요소를 구성하는 컴포넌트들로, 사이트 탐색을 위한 링크와 사용자 인증 관련 UI 요소를 제공합니다.

## 포함된 컴포넌트

### NavigationLinks.tsx
- **역할**: 웹사이트의 메인 내비게이션 링크를 제공합니다.
- **특징**: 
  - 헤더에서 사용되는 주요 페이지 링크 컴포넌트
  - '홈', '회사정보', '개발강의', 'AI 강의', '인기강의' 등의 링크 포함
  - React Router의 `Link` 컴포넌트를 사용하여 SPA 내비게이션 구현
- **사용 위치**: `Header.tsx`에서 데스크톱 뷰에서 표시됨

### MobileMenu.tsx
- **역할**: 모바일 디바이스를 위한 햄버거 메뉴를 확장했을 때 나타나는 내비게이션 메뉴입니다.
- **특징**:
  - 모바일 화면에서만 표시되는 반응형 메뉴
  - 상단에 검색 기능 통합
  - 모든 주요 내비게이션 링크 포함
  - 로그인 상태에 따라 다른 UI 표시 (프로필 정보 또는 로그인/회원가입 버튼)
  - 로그인 시 프로필, 설정, 로그아웃 옵션 제공
- **속성**:
  - `isMenuOpen`: 메뉴의 열림/닫힘 상태
  - `onClose`: 메뉴를 닫는 함수
- **사용 위치**: `Header.tsx`에서 모바일 뷰에서 표시됨

### Logo.tsx
- **역할**: 웹사이트의 로고를 표시합니다.
- **특징**:
  - 브랜드 아이덴티티를 나타내는 로고 컴포넌트
  - 홈페이지로 연결되는 링크 포함
- **사용 위치**: `Header.tsx`에서 헤더 왼쪽에 표시됨

### AuthButtons.tsx
- **역할**: 로그인하지 않은 사용자에게 로그인 및 회원가입 버튼을 표시합니다.
- **특징**:
  - 로그인 및 회원가입 페이지로 연결되는 버튼 제공
  - 반응형 디자인 적용
- **사용 위치**: `Header.tsx`에서 로그인하지 않은 사용자에게 표시됨

### ProfileDropdown.tsx
- **역할**: 로그인한 사용자의 프로필 드롭다운 메뉴를 표시합니다.
- **특징**:
  - 사용자 아바타 및 정보 표시
  - 프로필, 설정, 로그아웃 등의 메뉴 옵션 제공
  - shadcn/ui의 드롭다운 메뉴 활용
- **사용 위치**: `Header.tsx`에서 로그인한 사용자에게 표시됨

## 사용 예시

```jsx
// Header.tsx에서 사용 예시
import NavigationLinks from './navigation/NavigationLinks';
import Logo from './navigation/Logo';
import AuthButtons from './navigation/AuthButtons';
import ProfileDropdown from './navigation/ProfileDropdown';
import MobileMenu from './navigation/MobileMenu';

const Header = () => {
  const { isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header>
      <Logo />
      
      {/* 데스크톱 내비게이션 */}
      <nav className="hidden md:flex">
        <NavigationLinks />
      </nav>
      
      {/* 인증 관련 UI */}
      {isAuthenticated ? <ProfileDropdown /> : <AuthButtons />}
      
      {/* 모바일 메뉴 */}
      <MobileMenu isMenuOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
};
```

## 스타일링
이 컴포넌트들은 Tailwind CSS를 사용하여 스타일링되어 있으며, 다크 모드와 모바일 반응형 디자인을 지원합니다.
