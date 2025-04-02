
# 강의 API 모듈 (Lecture API Module)

이 모듈은 강의 관련 API 호출을 처리하는 함수들을 제공합니다. 백엔드 서버와의 통신을 담당하며, 강의 목록 조회, 상세 조회, 등록 등의 기능을 구현합니다.

## 주요 기능

### 강의 목록 조회
- **함수명**: `getLectures`
- **설명**: 카테고리별로 필터링된 강의 목록을 조회합니다.
- **매개변수**: `category` (선택): 조회할 카테고리 ID
- **반환값**: 강의 목록 데이터를 포함한 Promise

### 강의 상세 조회
- **함수명**: `getLectureDetail`
- **설명**: 특정 강의의 상세 정보를 조회합니다.
- **매개변수**: `lectureId`: 조회할 강의 ID
- **반환값**: 강의 상세 데이터를 포함한 Promise

### 강의 등록
- **함수명**: `createLecture`
- **설명**: 새로운 강의를 등록합니다. (강사 권한 필요)
- **매개변수**: `lectureFormData`: FormData 형식의 강의 데이터
  - 포함 데이터:
    - `title`: 강의 제목 (필수)
    - `description`: 강의 설명 (필수)
    - `category`: 강의 카테고리 ID (필수)
    - `instructorId`: 강사 ID (선택)
    - `curriculum`: JSON 문자열로 변환된 커리큘럼 배열 (선택)
    - `thumbnailFile`: 썸네일 이미지 파일 (필수)
    - `videoFile`: 강의 영상 파일 (필수)
- **반환값**: 등록된 강의 정보를 포함한 Promise
- **요청 형식**: `multipart/form-data`
- **엔드포인트**: `/api/lectures` (POST)

## 사용 예시

```typescript
// 강의 목록 조회
const fetchLectures = async (category = 'all') => {
  try {
    const response = await lectureAPI.getLectures(category);
    return response.data;
  } catch (error) {
    console.error('강의 목록 조회 실패:', error);
    throw error;
  }
};

// 강의 등록
const uploadLecture = async (formData: FormData) => {
  try {
    const response = await lectureAPI.createLecture(formData);
    console.log('강의 등록 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('강의 등록 실패:', error);
    throw error;
  }
};
```

## 에러 처리

강의 API 호출 시 발생하는 에러는 다음과 같이 처리됩니다:

1. 유효하지 않은 입력값: 400 Bad Request
2. 인증 오류: 401 Unauthorized
3. 권한 오류: 403 Forbidden
4. 서버 오류: 500 Internal Server Error

모든 에러는 응답의 `data.message` 또는 `data.error` 필드에 설명이 포함됩니다.

## 백엔드 연동 참고사항

- 백엔드 API는 `/api/lectures` 엔드포인트를 통해 접근합니다.
- 파일 업로드는 `multipart/form-data` 형식을 사용합니다.
- 강의 등록 요청에는 인증 토큰(JWT)이 필요합니다.
- 강사 권한이 있는 사용자만 강의를 등록할 수 있습니다.
