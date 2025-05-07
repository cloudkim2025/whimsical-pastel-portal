
# navigation 폴더

## 용도
상단/모바일 메뉴, 로그인/회원가입, 마이페이지 등 주요 내비게이션 UI 컴포넌트 담당.

## 주요 파일
- `AuthButtons.tsx`: 로그인/회원가입 버튼. 비로그인 상황에만 노출.
- `MobileMenu.tsx`: 모바일에서 사용할 전체 메뉴. AuthContext로 user 및 로그아웃 연동.
- `ProfileDropdown.tsx`: 로그인 시 상단 우측에 유저 정보/로그아웃/설정 링크 제공.
- `NavigationLinks.tsx`: 메인, 카테고리, 기타 메뉴의 링크 목록.

## 개발자 참고
- 인증 상태는 모두 `useAuth`에서 관리되며, user 오브젝트 유무로 로그인 여부 분기 처리.
- 메뉴 추가/수정시 이 파일과 폴더 구조 참고 권장.
