
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const AccessDenied: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="max-w-md w-full p-6">
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>접근 권한 없음</AlertTitle>
        <AlertDescription>
          강의 등록은 강사 계정만 이용할 수 있습니다.
          <div className="mt-4">
            <Button onClick={() => navigate('/')} variant="outline">
              홈으로 돌아가기
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default AccessDenied;
