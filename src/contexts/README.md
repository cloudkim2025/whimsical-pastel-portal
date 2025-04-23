
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
