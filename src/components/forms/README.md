
# forms 폴더

## 용도
Auth, 유저, 강의 등 주요 입력폼 컴포넌트를 담당합니다.
- 사용자 입력 받은 후, 각종 API와 연동하여 서버에 데이터 전달
- 상태 관리 및 폼 유효성 검사, 에러 UI 표시 포함

## 주요 파일
- `RegistrationForm.tsx`: 회원가입 입력 폼 (이메일/비밀번호/닉네임/프로필 업로드 포함, axios 기반)
- `RegistrationForm.types.ts`: RegistrationForm에서 사용되는 에러 타입 관리

## 개발자 참고
- 각 Form은 유효성 검증과 API 호출 분리가 잘 되어있음
- 에러 발생시 toast 또는 inline 메시지 동시에 사용
- 추가 폼 필요시, 공통 타입은 `RegistrationForm.types.ts`를 참고 후 분리 관리
