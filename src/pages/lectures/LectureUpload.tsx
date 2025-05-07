
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { lectureAPI } from '@/api';
import { useAuth } from '@/contexts/AuthContext';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

// Remove color syntax plugin temporarily
// import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
// import 'tui-color-picker/dist/tui-color-picker.css';
// import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const LectureUpload: React.FC = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [sections, setSections] = useState<{ title: string; video: File | null }[]>([{ title: '', video: null }]);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const editorRef = React.useRef<Editor>(null);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setThumbnailFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    maxFiles: 1,
  });

  const handleAddSection = () => {
    setSections([...sections, { title: '', video: null }]);
  };

  const handleSectionTitleChange = (index: number, value: string) => {
    const newSections = [...sections];
    newSections[index].title = value;
    setSections(newSections);
  };

  const handleSectionVideoChange = (index: number, file: File | null) => {
    const newSections = [...sections];
    newSections[index].video = file;
    setSections(newSections);
  };

  const handleRemoveSection = (index: number) => {
    const newSections = sections.filter((_, i) => i !== index);
    setSections(newSections);
  };

  const handleUpload = async (file: File | null, lectureId: string | number) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("video", file);
    // 강의 ID는 문자열로 전달
    formData.append("lectureId", lectureId.toString());
    // ... 나머지 코드 동일 ...
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    if (!title || !category || price === undefined || !thumbnailFile) {
      toast.error('모든 필수 필드를 채워주세요.');
      return;
    }

    if (sections.some(section => !section.title || !section.video)) {
      toast.error('모든 섹션의 제목과 비디오를 채워주세요.');
      return;
    }

    setUploading(true);

    try {
      const content = editorRef.current?.getInstance().getMarkdown() || '';

      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('price', String(price));
      formData.append('content', content);
      formData.append('thumbnail', thumbnailFile);

      // Use createLecture instead of uploadLecture
      const lectureResponse = await lectureAPI.createLecture(formData);
      const lectureId = lectureResponse.data.id;

      if (lectureId) {
        await Promise.all(
          sections.map(async (section, index) => {
            if (section.video) {
              const sectionFormData = new FormData();
              sectionFormData.append('title', section.title);
              sectionFormData.append('video', section.video);
              sectionFormData.append('lectureId', String(lectureId)); // lectureId를 string으로 변환
              // Use createLecture instead of uploadSection
              await lectureAPI.createLecture(sectionFormData);
            }
          })
        );

        toast.success('강의가 성공적으로 업로드되었습니다!');
        navigate(`/lecture/${lectureId}`);
      } else {
        toast.error('강의 업로드 실패.');
      }
    } catch (error: any) {
      console.error('강의 업로드 오류:', error);
      toast.error(error.response?.data?.message || '강의 업로드 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return <div className="text-center py-10">로그인이 필요합니다.</div>;
  }

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">강의 업로드</h1>

      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">강의 제목</label>
        <Input
          type="text"
          id="title"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">카테고리</label>
        <Select onValueChange={setCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="카테고리 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dev">개발</SelectItem>
            <SelectItem value="ai">AI</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">가격</label>
        <Input
          type="number"
          id="price"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={price === undefined ? '' : price.toString()}
          onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : undefined)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">썸네일 업로드</label>
        <div {...getRootProps()} className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
          <input {...getInputProps()} />
          <div className="space-y-1 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L20 28m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L20 28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex text-sm text-gray-600">
              <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                <span>파일 선택</span>
              </label>
              <p className="pl-1">또는 파일을 드래그하여 놓으세요.</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF 최대 10MB</p>
          </div>
        </div>
        {thumbnailFile && <p className="mt-2">선택된 파일: {thumbnailFile.name}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">강의 내용</label>
        <Editor
          previewStyle="vertical"
          height="400px"
          initialEditType="markdown"
          // Temporarily remove the color syntax plugin
          // plugins={[colorSyntax]}
          ref={editorRef}
        />
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-bold mb-3">강의 섹션</h2>
        {sections.map((section, index) => (
          <div key={index} className="mb-4 p-4 border rounded">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">섹션 {index + 1}</h3>
              <Button type="button" onClick={() => handleRemoveSection(index)} variant="destructive" size="sm">
                섹션 삭제
              </Button>
            </div>
            <div className="mb-2">
              <label htmlFor={`sectionTitle-${index}`} className="block text-sm font-medium text-gray-700">섹션 제목</label>
              <Input
                type="text"
                id={`sectionTitle-${index}`}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={section.title}
                onChange={(e) => handleSectionTitleChange(index, e.target.value)}
              />
            </div>
            <div>
              <label htmlFor={`sectionVideo-${index}`} className="block text-sm font-medium text-gray-700">섹션 비디오</label>
              <input
                type="file"
                id={`sectionVideo-${index}`}
                className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                onChange={(e) => handleSectionVideoChange(index, e.target.files ? e.target.files[0] : null)}
              />
              {section.video && <p className="mt-2">선택된 파일: {section.video.name}</p>}
            </div>
          </div>
        ))}
        <Button type="button" onClick={handleAddSection}>
          섹션 추가
        </Button>
      </div>

      <div className="mt-6">
        <Button
          onClick={handleSubmit}
          disabled={uploading}
        >
          {uploading ? '업로드 중...' : '강의 업로드'}
        </Button>
      </div>
    </div>
  );
};

export default LectureUpload;
