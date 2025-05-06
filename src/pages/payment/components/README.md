
# 결제 페이지 컴포넌트 구조 (Payment Page Components)

이 폴더에는 결제 시스템의 핵심 UI를 구성하는 컴포넌트들이 포함되어 있습니다. 각 컴포넌트는 결제 프로세스의 특정 부분을 담당하며, 함께 완전한 결제 경험을 제공합니다.

## 컴포넌트 상세 설명

### OrderSummary.tsx
**역할**: 주문 요약 정보를 표시하는 컴포넌트

**기능 및 특징**:
- 구매하려는 강의의 상세 정보 표시 (제목, 강사명, 카테고리, 난이도)
- 강의 썸네일 이미지 표시
- 원가, 할인가, 최종 결제 금액을 계산하여 표시
- 할인 코드 입력 기능 제공 (선택적)
- 적립 예정 포인트 정보 표시

**Props**:
- `lectureId`: 구매할 강의 ID
- `onPriceChange`: 가격 변경 시 호출할 콜백 함수

**사용 예시**:
```jsx
<OrderSummary 
  lectureId="lecture-123" 
  onPriceChange={(price) => setTotalPrice(price)} 
/>
```

### PaymentMethods.tsx
**역할**: 결제 수단 선택 UI를 제공하는 컴포넌트

**기능 및 특징**:
- 다양한 결제 수단 옵션 제공 (카카오페이, 신용카드, 무통장입금, 네이버페이 등)
- 각 결제 수단에 맞는 아이콘과 설명 표시
- 결제 수단별 추가 입력 필드 동적 표시 (예: 무통장입금 시 입금자명)
- 최근 사용한 결제 수단 기억 기능 (로그인 사용자)
- 모바일/데스크톱 환경에 따른 최적화된 UI 제공

**Props**:
- `selectedMethod`: 현재 선택된 결제 수단
- `onMethodChange`: 결제 수단 변경 시 호출할 콜백 함수
- `paymentInfo`: 결제 관련 추가 정보 객체

**사용 예시**:
```jsx
<PaymentMethods
  selectedMethod="card"
  onMethodChange={(method) => setPaymentMethod(method)}
  paymentInfo={paymentDetails}
/>
```

### CheckoutSummary.tsx
**역할**: 최종 결제 정보와 동의 체크박스, 결제 버튼을 포함하는 컴포넌트

**기능 및 특징**:
- 최종 결제 금액 요약 표시
- 필수 동의 항목 체크박스 (이용약관, 개인정보 처리방침, 환불 정책)
- 결제 버튼과 처리 상태 표시 (로딩, 완료, 에러)
- 결제 진행 전 유효성 검사 수행
- 할인 및 포인트 적용 정보 표시
- 모바일 화면에서 하단 고정 표시 옵션

**Props**:
- `totalPrice`: 최종 결제 금액
- `discount`: 할인 금액
- `onPaymentSubmit`: 결제 버튼 클릭 시 호출할 콜백 함수
- `isProcessing`: 결제 처리 중 여부

**사용 예시**:
```jsx
<CheckoutSummary
  totalPrice={29000}
  discount={5000}
  onPaymentSubmit={handlePayment}
  isProcessing={isPaymentProcessing}
/>
```

## usePayment.ts 훅

**역할**: 결제 처리 로직을 분리한 커스텀 훅

**기능 및 특징**:
- 결제 API 요청 처리 (포트원/아임포트 SDK 연동)
- 결제 상태 관리 (대기 중, 처리 중, 완료, 실패)
- 에러 처리 및 사용자 피드백 제공
- 결제 성공 시 백엔드 API 호출을 통한 주문 정보 저장
- 결제 완료 후 적절한 페이지로 리디렉션 처리

**반환 값**:
- `initiatePayment`: 결제 프로세스를 시작하는 함수
- `isProcessing`: 결제 처리 중 여부
- `error`: 발생한 오류 정보
- `paymentResult`: 결제 결과 정보

**사용 예시**:
```jsx
const { initiatePayment, isProcessing, error, paymentResult } = usePayment();

const handlePaymentSubmit = async () => {
  const paymentData = {
    lectureId: "lecture-123",
    price: 29000,
    paymentMethod: "card",
    // 기타 필요한 결제 정보
  };
  
  await initiatePayment(paymentData);
};
```

## 데이터 흐름

1. `Checkout.tsx` 페이지에서 각 컴포넌트를 조합하여 결제 UI를 구성합니다.
2. `OrderSummary` 컴포넌트에서 강의 정보와 가격을 불러와 표시합니다.
3. 사용자가 `PaymentMethods` 컴포넌트에서 결제 수단을 선택합니다.
4. `CheckoutSummary` 컴포넌트에서 이용약관에 동의하고 결제 버튼을 클릭합니다.
5. `usePayment` 훅을 통해 결제 프로세스가 시작되고 결제 대행사 SDK가 실행됩니다.
6. 결제 완료 후 백엔드 API를 통해 결제 정보를 저장하고 사용자에게 결과를 표시합니다.

이 구조로 분리함으로써 코드의 가독성과 유지보수성을 크게 향상시켰습니다. 각 컴포넌트는 단일 책임을 가지며, 필요할 때 쉽게 수정하거나 교체할 수 있습니다.
