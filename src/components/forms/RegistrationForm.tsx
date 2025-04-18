
import React, { useState, useRef } from 'react';
import { Mail, Check, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useEmailVerification } from '@/hooks/useEmailVerification';
import EmailVerificationModal from '@/components/EmailVerificationModal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  nickname?: string;
  profileImage?: string;
}

const RegistrationForm: React.FC = () => {
  const {
    email,
    setEmail,
    isEmailVerified,
    isSendingCode,
    isVerificationModalOpen,
    setIsVerificationModalOpen,
    handleSendVerificationCode,
    handleVerificationResult,
    emailError,
    setEmailError
  } = useEmailVerification();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const { register } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = () => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Email validation is handled in the hook
    if (emailError || !email) {
      newErrors.email = emailError || '이메일 주소를 입력해주세요.';
      isValid = false;
    }

    // Email verification check
    if (!isEmailVerified) {
      newErrors.email = '이메일 인증이 필요합니다.';
      isValid = false;
    }

    // Password validation - 8~20자, 특수문자+숫자 포함
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/;
    if (!password || !passwordRegex.test(password)) {
      newErrors.password = '비밀번호는 8~20자 사이의 영문, 숫자, 특수문자를 포함해야 합니다.';
      isValid = false;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
      isValid = false;
    }

    // Nickname validation - 2~10자의 한글, 영문, 숫자만
    const nicknameRegex = /^[가-힣a-zA-Z0-9]{2,10}$/;
    if (!nickname || !nicknameRegex.test(nickname)) {
      newErrors.nickname = '닉네임은 2~10자 사이의 한글, 영문, 숫자만 사용 가능합니다.';
      isValid = false;
    }

    // Profile image validation (optional)
    if (profileImage) {
      // Check file size (max 1MB)
      if (profileImage.size > 1024 * 1024) {
        newErrors.profileImage = '프로필 이미지는 최대 1MB까지만 업로드할 수 있습니다.';
        isValid = false;
      }
      
      // Check file type
      const fileType = profileImage.type;
      if (!fileType.includes('image/jpeg') && !fileType.includes('image/png')) {
        newErrors.profileImage = '이미지는 JPG, PNG 형식만 가능합니다.';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // FormData 객체 생성
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      formData.append('nickname', nickname);
      
      // 프로필 이미지가 있는 경우에만 추가
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }
      
      // 회원가입 API 호출
      await register(formData);
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // 파일 미리보기 생성
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    setProfileImage(file);
  };

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-6 flex flex-col items-center">
          <div 
            className="relative cursor-pointer group"
            onClick={handleProfileImageClick}
          >
            <Avatar className="h-24 w-24 border-2 border-ghibli-meadow">
              {profilePreview ? (
                <AvatarImage src={profilePreview} alt="프로필 이미지" />
              ) : (
                <AvatarFallback className="bg-ghibli-cloud text-ghibli-forest text-xl">
                  {nickname ? nickname.slice(0, 2).toUpperCase() : 'UP'}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Upload className="h-8 w-8 text-white" />
            </div>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/jpeg, image/png"
            ref={fileInputRef}
            onChange={handleProfileImageChange}
          />
          <p className="text-sm text-ghibli-stone mt-2">프로필 이미지 (선택사항)</p>
          {errors.profileImage && (
            <p className="text-xs text-red-500 mt-1">{errors.profileImage}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-ghibli-midnight">
            이메일
          </label>
          <div className="flex space-x-2">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="your@email.com"
              required
              disabled={isEmailVerified}
              className={`border-ghibli-meadow/50 focus:border-ghibli-forest focus:ring focus:ring-ghibli-meadow/30 ${
                errors.email ? 'border-red-500' : isEmailVerified ? 'border-green-500' : ''
              }`}
            />
            <Button
              type="button"
              onClick={handleSendVerificationCode}
              disabled={isEmailVerified || isSendingCode}
              className={`px-3 whitespace-nowrap ${
                isEmailVerified
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-ghibli-meadow hover:bg-ghibli-forest'
              }`}
            >
              {isSendingCode ? (
                '발송중...'
              ) : isEmailVerified ? (
                <>
                  <Check className="h-4 w-4 mr-1" /> 인증됨
                </>
              ) : (
                '인증하기'
              )}
            </Button>
          </div>
          {errors.email ? (
            <p className="text-xs text-red-500 mt-1">{errors.email}</p>
          ) : isEmailVerified ? (
            <p className="text-xs text-green-600 mt-1">이메일이 인증되었습니다.</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="nickname" className="block text-sm font-medium text-ghibli-midnight">
            닉네임
          </label>
          <Input
            id="nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="dreamscaper"
            required
            className={`w-full border-ghibli-meadow/50 focus:border-ghibli-forest focus:ring focus:ring-ghibli-meadow/30 ${
              errors.nickname ? 'border-red-500' : ''
            }`}
          />
          {errors.nickname && (
            <p className="text-xs text-red-500 mt-1">{errors.nickname}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-ghibli-midnight">
            비밀번호
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className={`w-full border-ghibli-meadow/50 focus:border-ghibli-forest focus:ring focus:ring-ghibli-meadow/30 ${
              errors.password ? 'border-red-500' : ''
            }`}
          />
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">{errors.password}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-ghibli-midnight">
            비밀번호 확인
          </label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            className={`w-full border-ghibli-meadow/50 focus:border-ghibli-forest focus:ring focus:ring-ghibli-meadow/30 ${
              errors.confirmPassword ? 'border-red-500' : ''
            }`}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        <Button 
          type="submit"
          disabled={isLoading || !isEmailVerified}
          className="w-full bg-ghibli-meadow hover:bg-ghibli-forest text-white transition-all duration-300 mt-6"
        >
          {isLoading ? '회원가입 중...' : '회원가입'}
        </Button>
      </form>

      <EmailVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        onVerify={handleVerificationResult}
        email={email}
      />
    </>
  );
};

export default RegistrationForm;
