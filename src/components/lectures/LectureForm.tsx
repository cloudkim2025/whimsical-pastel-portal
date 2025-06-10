import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface LectureFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  initialData?: any;
}

const LectureForm: React.FC<LectureFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [price, setPrice] = useState(initialData?.price || 0);
  const [category, setCategory] = useState(initialData?.category || 'development');
  const [difficulty, setDifficulty] = useState(initialData?.difficulty || 'beginner');
  const [curriculum, setCurriculum] = useState(initialData?.curriculum || []);
  const [newCurriculumItem, setNewCurriculumItem] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || price <= 0) {
      toast({
        title: "오류",
        description: "모든 필드를 올바르게 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price.toString()); // Convert number to string
    formData.append('category', category);
    formData.append('difficulty', difficulty);
    formData.append('curriculum', JSON.stringify(curriculum));
    
    if (thumbnailFile) {
      formData.append('thumbnail', thumbnailFile);
    }
    
    if (videoFile) {
      formData.append('video', videoFile);
    }

    try {
      await onSubmit(formData);
      toast({
        title: "성공",
        description: initialData ? "강의가 수정되었습니다." : "강의가 등록되었습니다.",
      });
    } catch (error) {
      toast({
        title: "오류",
        description: "강의 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleAddCurriculumItem = () => {
    if (newCurriculumItem.trim()) {
      setCurriculum([...curriculum, newCurriculumItem.trim()]);
      setNewCurriculumItem('');
    }
  };

  const handleRemoveCurriculumItem = (index: number) => {
    const updatedCurriculum = [...curriculum];
    updatedCurriculum.splice(index, 1);
    setCurriculum(updatedCurriculum);
  };

  const onThumbnailDrop = useCallback((acceptedFiles: File[]) => {
    setThumbnailFile(acceptedFiles[0]);
  }, []);

  const onVideoDrop = useCallback((acceptedFiles: File[]) => {
    setVideoFile(acceptedFiles[0]);
  }, []);

  const {getRootProps: getThumbnailRootProps, getInputProps: getThumbnailInputProps, isDragActive: isThumbnailDragActive} = useDropzone({
    onDrop: onThumbnailDrop,
    accept: 'image/*',
    maxFiles: 1
  });

  const {getRootProps: getVideoRootProps, getInputProps: getVideoInputProps, isDragActive: isVideoDragActive} = useDropzone({
    onDrop: onVideoDrop,
    accept: 'video/*',
    maxFiles: 1
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title">강의 제목</Label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="강의 제목을 입력하세요"
        />
      </div>
      <div>
        <Label htmlFor="description">강의 설명</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="강의 내용을 상세하게 설명해주세요"
        />
      </div>
      <div>
        <Label htmlFor="price">가격 (원)</Label>
        <Input
          id="price"
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          placeholder="가격을 설정하세요"
        />
      </div>
      <div>
        <Label htmlFor="category">카테고리</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="카테고리를 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="development">개발</SelectItem>
            <SelectItem value="ai">AI</SelectItem>
            <SelectItem value="design">디자인</SelectItem>
            <SelectItem value="marketing">마케팅</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="difficulty">난이도</Label>
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="난이도를 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">초급</SelectItem>
            <SelectItem value="intermediate">중급</SelectItem>
            <SelectItem value="advanced">고급</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>커리큘럼</Label>
        <div className="flex space-x-2 mb-2">
          <Input
            type="text"
            placeholder="커리큘럼 항목을 입력하세요"
            value={newCurriculumItem}
            onChange={(e) => setNewCurriculumItem(e.target.value)}
          />
          <Button type="button" variant="secondary" size="sm" onClick={handleAddCurriculumItem}>
            <Plus className="h-4 w-4 mr-2" />
            추가
          </Button>
        </div>
        <ul>
          {curriculum.map((item: string, index: number) => (
            <li key={index} className="flex items-center justify-between py-2 border-b">
              {item}
              <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveCurriculumItem(index)}>
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <Label>썸네일 업로드</Label>
        <div {...getThumbnailRootProps()} className="dropzone w-full p-4 border-2 border-dashed rounded-md cursor-pointer">
          <input {...getThumbnailInputProps()} />
          {
            isThumbnailDragActive ?
              <p>썸네일 이미지를 놓으세요 ...</p> :
              <p>썸네일 이미지를 드래그하거나 클릭하여 선택하세요.</p>
          }
          {thumbnailFile && (
            <div>
              <p>선택된 썸네일: {thumbnailFile.name}</p>
            </div>
          )}
        </div>
      </div>
      <div>
        <Label>강의 비디오 업로드</Label>
        <div {...getVideoRootProps()} className="dropzone w-full p-4 border-2 border-dashed rounded-md cursor-pointer">
          <input {...getVideoInputProps()} />
          {
            isVideoDragActive ?
              <p>강의 비디오를 놓으세요 ...</p> :
              <p>강의 비디오를 드래그하거나 클릭하여 선택하세요.</p>
          }
          {videoFile && (
            <div>
              <p>선택된 비디오: {videoFile.name}</p>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          취소
        </Button>
        <Button type="submit">
          {initialData ? '강의 수정' : '강의 등록'}
        </Button>
      </div>
    </form>
  );
};

export default LectureForm;
