import React, {useState} from 'react';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Loader2, UploadCloud} from 'lucide-react';
import {useToast} from '@/hooks/use-toast';
import {lectureAPI} from '@/api/lecture';
import {categories} from '@/data/lectureCategories';
import CurriculumPreview from '@/components/lectures/CurriculumPreview';
import {useAiCurriculum} from '@/hooks/useAiCurriculum';
import {Alert, AlertDescription} from '@/components/ui/alert';

interface LectureFormProps {
  userId?: string;
}

const LectureForm: React.FC<LectureFormProps> = ({ userId }) => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailImage, setThumbnailImage] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [category, setCategory] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoName, setVideoName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { curriculum, isAnalyzing, generateCurriculum } = useAiCurriculum();

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailImage(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);
      setVideoName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !description || !category || !thumbnailImage || !videoFile) {
      toast({
        variant: "destructive",
        title: "입력 오류",
        description: "모든 항목을 입력해주세요."
      });
      return;
    }

    setIsUploading(true);

    try {
      // FormData 객체 생성 및 데이터 추가
      const formData = new FormData();
      formData.append('title', name);
      formData.append('description', description);
      formData.append('category', category);

      // 강사 ID가 있는 경우에만 추가
      if (userId) {
        formData.append('instructorId', userId);
      }

      // 커리큘럼 데이터 JSON 문자열로 변환하여 추가
      if (curriculum && curriculum.length > 0) {
        const curriculumJson = JSON.stringify(curriculum);
        formData.append('curriculum', curriculumJson);
      }

      // 썸네일 이미지 추가
      if (thumbnailImage) {
        formData.append('thumbnailFile', thumbnailImage);
      }

      // 강의 영상 추가
      if (videoFile) {
        formData.append('videoFile', videoFile);
      }

      // API 호출
      const response = await lectureAPI.createLecture(formData);

      console.log('강의 등록 응답:', response);

      toast({
        title: "강의 업로드 완료",
        description: "강의가 성공적으로 업로드되었습니다. 검토 후 게시됩니다."
      });

      // 폼 초기화
      setName('');
      setDescription('');
      setThumbnailImage(null);
      setThumbnailPreview(null);
      setCategory('');
      setVideoFile(null);
      setVideoName('');
    } catch (error: any) {
      console.error('강의 업로드 오류:', error);

      // 오류 메시지 처리
      const errorMessage = error.response?.data?.message ||
          error.response?.data?.error ||
          '강의 업로드 중 오류가 발생했습니다.';

      setError(errorMessage);

      toast({
        variant: "destructive",
        title: "업로드 실패",
        description: errorMessage
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="korean-text">강의 제목</Label>
            <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="강의 제목을 입력하세요"
                className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="korean-text">강의 카테고리</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <span className="korean-text">{cat.name}</span>
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="korean-text">강의 설명</Label>
          <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="강의에 대한 상세 설명을 입력하세요"
              className="w-full min-h-[150px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="thumbnail" className="korean-text">강의 썸네일</Label>
            <div className="flex flex-col gap-4">
              <Input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="w-full"
              />
              {thumbnailPreview && (
                  <div className="w-full aspect-video overflow-hidden rounded-md border border-border">
                    <img
                        src={thumbnailPreview}
                        alt="썸네일 미리보기"
                        className="w-full h-full object-cover"
                    />
                  </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="videoFile" className="korean-text">강의 영상</Label>
            <div className="space-y-4">
              <Input
                  id="videoFile"
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="w-full"
              />
              {videoName && (
                  <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <span className="text-sm truncate">{videoName}</span>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => generateCurriculum(videoFile)}
                        disabled={isAnalyzing}
                    >
                      {isAnalyzing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            <span className="korean-text">분석중...</span>
                          </>
                      ) : (
                          <span className="korean-text">AI 분석</span>
                      )}
                    </Button>
                  </div>
              )}
            </div>
          </div>
        </div>

        {curriculum.length > 0 && <CurriculumPreview curriculum={curriculum} />}

        <div className="pt-4">
          <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2"
              disabled={isUploading}
          >
            {isUploading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  <span className="korean-text">업로드 중...</span>
                </>
            ) : (
                <>
                  <UploadCloud className="h-5 w-5" />
                  <span className="korean-text">강의 등록하기</span>
                </>
            )}
          </Button>
        </div>
      </form>
  );
};

export default LectureForm;
