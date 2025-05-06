
# UI 컴포넌트 라이브러리 (UI Component Library)

이 폴더에는 Aigongbu 프로젝트에서 사용되는 기본 UI 컴포넌트들이 포함되어 있습니다. 대부분의 컴포넌트는 [shadcn/ui](https://ui.shadcn.com/) 라이브러리를 기반으로 하며, 일부는 프로젝트의 특정 요구에 맞게 커스터마이즈되었습니다.

## 컴포넌트 목록

### 폼 요소 (Form Elements)

- **button.tsx**: 다양한 스타일과 크기의 버튼 컴포넌트
- **input.tsx**: 텍스트 입력 필드 컴포넌트
- **textarea.tsx**: 여러 줄 텍스트 입력을 위한 컴포넌트
- **checkbox.tsx**: 체크박스 컴포넌트
- **radio-group.tsx**: 라디오 버튼 그룹 컴포넌트
- **select.tsx**: 드롭다운 선택 컴포넌트
- **switch.tsx**: 토글 스위치 컴포넌트
- **slider.tsx**: 슬라이더 컴포넌트
- **form.tsx**: 폼 레이아웃 및 유효성 검사를 위한 컴포넌트

### 레이아웃 요소 (Layout Elements)

- **card.tsx**: 정보를 카드 형태로 보여주는 컴포넌트
- **accordion.tsx**: 접을 수 있는 콘텐츠 컴포넌트
- **tabs.tsx**: 탭 내비게이션 컴포넌트
- **separator.tsx**: 구분선 컴포넌트
- **aspect-ratio.tsx**: 이미지나 비디오의 종횡비를 유지하는 컴포넌트
- **resizable.tsx**: 크기 조절이 가능한 패널 컴포넌트
- **scroll-area.tsx**: 스크롤 가능한 영역 컴포넌트
- **sheet.tsx**: 측면에서 슬라이드되는 패널 컴포넌트

### 내비게이션 (Navigation)

- **navigation-menu.tsx**: 드롭다운 메뉴를 포함한 내비게이션 컴포넌트
- **menubar.tsx**: 메뉴바 컴포넌트
- **dropdown-menu.tsx**: 드롭다운 메뉴 컴포넌트
- **context-menu.tsx**: 우클릭 컨텍스트 메뉴 컴포넌트
- **pagination.tsx**: 페이지네이션 컴포넌트
- **breadcrumb.tsx**: 경로 탐색을 위한 브레드크럼 컴포넌트

### 피드백 및 오버레이 (Feedback & Overlay)

- **alert.tsx**: 경고 메시지 컴포넌트
- **alert-dialog.tsx**: 확인/취소가 필요한 대화 상자 컴포넌트
- **dialog.tsx**: 모달 대화 상자 컴포넌트
- **drawer.tsx**: 서랍식 패널 컴포넌트
- **popover.tsx**: 팝오버 컴포넌트
- **tooltip.tsx**: 툴팁 컴포넌트
- **toast.tsx**: 토스트 알림 컴포넌트
- **toaster.tsx**: 토스트 알림 관리 컴포넌트
- **progress.tsx**: 진행 상태 표시 컴포넌트
- **skeleton.tsx**: 로딩 상태를 표시하는 스켈레톤 컴포넌트

### 데이터 디스플레이 (Data Display)

- **avatar.tsx**: 사용자 아바타 컴포넌트
- **badge.tsx**: 뱃지 컴포넌트
- **table.tsx**: 테이블 컴포넌트
- **hover-card.tsx**: 호버 시 추가 정보를 제공하는 카드 컴포넌트
- **carousel.tsx**: 이미지나 카드를 슬라이드 형태로 보여주는 캐러셀 컴포넌트
- **chart.tsx**: 데이터 시각화를 위한 차트 컴포넌트

### 유틸리티 및 기타 (Utilities & Others)

- **command.tsx**: 커맨드 팔레트 컴포넌트
- **calendar.tsx**: 날짜 선택을 위한 캘린더 컴포넌트
- **collapsible.tsx**: 접을 수 있는 컨테이너 컴포넌트
- **toggle.tsx**: 토글 버튼 컴포넌트
- **toggle-group.tsx**: 여러 토글 버튼을 그룹으로 묶는 컴포넌트
- **input-otp.tsx**: 일회용 비밀번호 입력용 컴포넌트
- **sonner.tsx**: 향상된 토스트 알림 시스템
- **use-toast.ts**: 토스트 알림을 위한 커스텀 훅

## 사용 방법

모든 컴포넌트는 일관된 스타일과 접근성을 위해 설계되었으며, Tailwind CSS를 사용하여 스타일링되어 있습니다. 컴포넌트를 사용하려면 다음과 같이 임포트하세요:

```jsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

const MyComponent = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>로그인</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <Input placeholder="이메일" type="email" />
          <Input placeholder="비밀번호" type="password" className="mt-2" />
        </form>
      </CardContent>
      <CardFooter>
        <Button>로그인</Button>
      </CardFooter>
    </Card>
  );
};
```

## 커스터마이징

각 컴포넌트는 Tailwind의 `className` prop을 통해 추가 스타일링이 가능합니다. 모든 컴포넌트는 `cn` 유틸리티 함수를 사용하여 클래스명을 결합합니다:

```jsx
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const CustomButton = ({ className, ...props }) => {
  return (
    <Button 
      className={cn("bg-ghibli-meadow hover:bg-ghibli-forest", className)}
      {...props}
    />
  );
};
```

## 접근성

모든 컴포넌트는 WAI-ARIA 가이드라인을 준수하여 웹 접근성을 보장합니다. 키보드 내비게이션, 스크린 리더 지원, 적절한 콘트라스트 등이 고려되어 있습니다.

## 다크 모드

컴포넌트들은 Tailwind CSS의 다크 모드를 지원합니다. `next-themes` 라이브러리와 함께 사용하여 테마 전환이 가능합니다:

```jsx
import { ThemeProvider } from "next-themes";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

// 테마 전환 버튼
const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? '라이트 모드' : '다크 모드'}
    </Button>
  );
};

// 루트 컴포넌트에서 ThemeProvider 설정
const App = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      {/* 앱 콘텐츠 */}
    </ThemeProvider>
  );
};
```

## 참고 자료

- [shadcn/ui 공식 문서](https://ui.shadcn.com/)
- [Radix UI 공식 문서](https://www.radix-ui.com/)
- [Tailwind CSS 공식 문서](https://tailwindcss.com/docs)
