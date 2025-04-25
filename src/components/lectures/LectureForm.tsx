import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, UploadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { lectureAPI } from '@/api/lecture';
import { categories } from '@/data/lectureCategories';
import CurriculumPreview from '@/components/lectures/CurriculumPreview';
import { useAiCurriculum } from '@/hooks/useAiCurriculum';
import { Alert, AlertDescription } from '@/components/ui/alert';

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!name || !description || !category || !thumbnailImage || !videoFile) {
      toast({
        variant: 'destructive',
        title: '입력 오류',
        description: '모든 항목을 입력해주세요.'
      });
      return;
    }

    setIsUploading(true);

    try {
      const instructor = userId || '1';
      await generateCurriculum(videoFile, name, description, category, instructor, thumbnailImage);

      toast({
        title: '강의 업로드 완료',
        description: '강의가 성공적으로 업로드되었습니다. 검토 후 게시됩니다.'
      });

      setName('');
      setDescription('');
      setThumbnailImage(null);
      setThumbnailPreview(null);
      setCategory('');
      setVideoFile(null);
      setVideoName('');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '강의 업로드 중 오류가 발생했습니다.';
      setError(errorMessage);

      toast({
        variant: 'destructive',
        title: '업로드 실패',
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
            <Label htmlFor="name">강의 제목</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="강의 제목" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">카테고리</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">강의 설명</Label>
          <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="강의 설명"
              className="min-h-[150px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="thumbnail">썸네일</Label>
            <Input id="thumbnail" type="file" accept="image/*" onChange={handleThumbnailChange} />
            {thumbnailPreview && (
                <img src={thumbnailPreview} alt="썸네일 미리보기" className="w-full rounded-md border aspect-video object-cover" />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="videoFile">강의 영상</Label>
            <Input id="videoFile" type="file" accept="video/*" onChange={handleVideoChange} />
            {videoName && (
                <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <span className="text-sm truncate">{videoName}</span>
                  <Button type="button" variant="outline" size="sm" onClick={() => {
                    if (videoFile) generateCurriculum(videoFile, name, description, category, userId || '1', thumbnailImage!);
                  }} disabled={isAnalyzing}>
                    {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 분석중...
                        </>
                    ) : (
                        <>AI 분석</>
                    )}
                  </Button>
                </div>
            )}
          </div>
        </div>

        {curriculum.length > 0 && <CurriculumPreview curriculum={curriculum} />}

        <Button type="submit" className="w-full flex items-center justify-center gap-2" disabled={isUploading}>
          {isUploading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" /> 업로드 중...
              </>
          ) : (
              <>
                <UploadCloud className="h-5 w-5" /> 강의 등록하기
              </>
          )}
        </Button>
      </form>
  );
};

export default LectureForm;