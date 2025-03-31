
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, FileVideo, X, Plus } from 'lucide-react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Mock categories from DevCourses page
const categories = [
  { id: 'frontend', name: '프론트엔드' },
  { id: 'backend', name: '백엔드' },
  { id: 'mobile', name: '모바일' },
  { id: 'data', name: '데이터 사이언스' },
  { id: 'ai', name: '인공지능' },
  { id: 'devops', name: 'DevOps' },
];

const formSchema = z.object({
  title: z.string().min(5, { message: '제목은 최소 5자 이상이어야 합니다.' }),
  description: z.string().min(20, { message: '설명은 최소 20자 이상이어야 합니다.' }),
  category: z.string({ required_error: '카테고리를 선택해주세요.' }),
  price: z.string().regex(/^\d+$/, { message: '숫자만 입력해주세요.' }),
  level: z.enum(['beginner', 'intermediate', 'advanced'], { required_error: '난이도를 선택해주세요.' }),
});

const CourseUpload: React.FC = () => {
  const { isAuthenticated, isInstructor, user } = useAuth();
  const navigate = useNavigate();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sections, setSections] = useState<{ title: string; content: string }[]>([]);
  const [transcripts, setTranscripts] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      price: '',
      level: 'beginner',
    },
  });

  // 권한 체크
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("로그인이 필요합니다");
      navigate("/login");
      return;
    }

    if (!isInstructor) {
      toast.error("강사 권한이 필요합니다");
      navigate("/");
    }
  }, [isAuthenticated, isInstructor, navigate]);

  // 썸네일 이미지 처리
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 비디오 파일 처리
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  // 영상 분석 함수 (현재는 모의 구현)
  const analyzeVideo = useCallback(() => {
    if (!videoFile) {
      toast.error("영상 파일을 먼저 업로드해주세요");
      return;
    }

    setIsAnalyzing(true);
    
    // 실제로는 서버에 영상을 보내고 AI 분석을 요청할 것입니다
    // 현재는 모의 데이터로 대체합니다
    setTimeout(() => {
      // 모의 커리큘럼 생성
      const mockSections = [
        { title: "1장: 강의 소개 및 환경 설정", content: "개발 환경 설정 및 기본 개념 설명" },
        { title: "2장: 기본 문법 익히기", content: "변수, 함수, 조건문 및 반복문 학습" },
        { title: "3장: 심화 개념", content: "클래스, 객체 지향 프로그래밍의 이해" },
        { title: "4장: 실전 프로젝트", content: "배운 내용을 활용한 미니 프로젝트 개발" },
      ];
      
      // 모의 강의 프롬프트 생성
      const mockTranscripts = [
        "안녕하세요, 여러분! 오늘부터 함께 공부할 강의에 오신 것을 환영합니다.",
        "이 강의에서는 기초부터 차근차근 배워볼 거예요.",
        "먼저 개발환경을 설정하는 방법부터 알아볼게요.",
        "다음으로 기본 문법을 익히면서 코딩의 기초를 다져보겠습니다.",
        "마지막으로 실전 프로젝트를 통해 배운 내용을 적용해볼 거예요."
      ];
      
      setSections(mockSections);
      setTranscripts(mockTranscripts);
      setIsAnalyzing(false);
      
      toast.success("영상 분석이 완료되었습니다!");
    }, 3000);
  }, [videoFile]);

  // 섹션 추가
  const addSection = () => {
    setSections([...sections, { title: "", content: "" }]);
  };

  // 섹션 수정
  const updateSection = (index: number, field: 'title' | 'content', value: string) => {
    const newSections = [...sections];
    newSections[index][field] = value;
    setSections(newSections);
  };

  // 섹션 삭제
  const removeSection = (index: number) => {
    const newSections = [...sections];
    newSections.splice(index, 1);
    setSections(newSections);
  };

  // 폼 제출 처리
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (!videoFile) {
      toast.error("강의 영상을 업로드해주세요");
      return;
    }

    if (!thumbnailFile) {
      toast.error("강의 썸네일을 업로드해주세요");
      return;
    }

    if (sections.length === 0) {
      toast.error("최소 하나 이상의 커리큘럼 섹션이 필요합니다");
      return;
    }

    // 업로드 시작
    setIsUploading(true);

    // 실제로는 여기서 API 호출을 통해 서버에 데이터를 전송할 것입니다
    setTimeout(() => {
      setIsUploading(false);
      toast.success("강의가 성공적으로 등록되었습니다!");
      navigate("/dev-courses");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto pt-32 px-4 pb-16">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-handwritten text-center text-ghibli-forest mb-8"
        >
          강의 등록
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <Card className="mb-8 border border-ghibli-meadow/20">
            <CardContent className="p-6">
              <div className="text-xl font-korean font-medium text-ghibli-midnight mb-4">
                {user?.nickname || '강사'} 님의 새 강의
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      {/* 강의 제목 */}
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem className="mb-4">
                            <FormLabel className="font-korean">강의 제목</FormLabel>
                            <FormControl>
                              <Input placeholder="강의 제목을 입력하세요" {...field} className="font-korean" />
                            </FormControl>
                            <FormMessage className="font-korean" />
                          </FormItem>
                        )}
                      />
                      
                      {/* 카테고리 */}
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem className="mb-4">
                            <FormLabel className="font-korean">카테고리</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="카테고리를 선택하세요" className="font-korean" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category.id} value={category.id} className="font-korean">
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="font-korean" />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        {/* 가격 */}
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem className="mb-4">
                              <FormLabel className="font-korean">가격 (원)</FormLabel>
                              <FormControl>
                                <Input placeholder="0" {...field} className="font-korean" />
                              </FormControl>
                              <FormMessage className="font-korean" />
                            </FormItem>
                          )}
                        />
                        
                        {/* 난이도 */}
                        <FormField
                          control={form.control}
                          name="level"
                          render={({ field }) => (
                            <FormItem className="mb-4">
                              <FormLabel className="font-korean">난이도</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="난이도" className="font-korean" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="beginner" className="font-korean">입문</SelectItem>
                                  <SelectItem value="intermediate" className="font-korean">중급</SelectItem>
                                  <SelectItem value="advanced" className="font-korean">고급</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage className="font-korean" />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <div>
                      {/* 썸네일 업로드 */}
                      <div className="mb-4">
                        <Label className="font-korean mb-2 block">강의 썸네일</Label>
                        <div className="relative h-[200px] border-2 border-dashed border-gray-300 rounded-md flex flex-col justify-center items-center bg-gray-50">
                          {thumbnailPreview ? (
                            <div className="relative w-full h-full">
                              <img 
                                src={thumbnailPreview} 
                                alt="Thumbnail preview" 
                                className="w-full h-full object-cover rounded-md"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setThumbnailPreview(null);
                                  setThumbnailFile(null);
                                }}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <>
                              <Upload className="h-10 w-10 text-gray-400" />
                              <Label htmlFor="thumbnail" className="mt-2 block font-korean text-sm text-gray-500 cursor-pointer">
                                썸네일 이미지를 업로드하세요
                              </Label>
                              <input
                                id="thumbnail"
                                type="file"
                                accept="image/*"
                                onChange={handleThumbnailChange}
                                className="sr-only"
                              />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 강의 설명 */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-korean">강의 설명</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="강의에 대한 상세한 설명을 입력하세요" 
                            {...field} 
                            className="min-h-[100px] font-korean"
                          />
                        </FormControl>
                        <FormMessage className="font-korean" />
                      </FormItem>
                    )}
                  />
                  
                  {/* 강의 영상 업로드 및 분석 */}
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h3 className="text-lg font-medium font-korean mb-4">강의 영상 업로드</h3>
                    <div className="border-2 border-dashed border-ghibli-meadow/30 rounded-md p-6 flex flex-col items-center justify-center text-center bg-white">
                      {videoFile ? (
                        <div className="w-full">
                          <div className="flex items-center mb-4">
                            <FileVideo className="mr-2 text-ghibli-forest" />
                            <span className="font-korean">{videoFile.name}</span>
                            <button
                              type="button"
                              onClick={() => setVideoFile(null)}
                              className="ml-auto text-red-500 hover:text-red-700"
                            >
                              <X size={20} />
                            </button>
                          </div>
                          
                          <Button 
                            type="button" 
                            variant="outline"
                            className="font-korean w-full"
                            onClick={analyzeVideo}
                            disabled={isAnalyzing}
                          >
                            {isAnalyzing ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                분석 중...
                              </>
                            ) : "AI로 영상 분석하기"}
                          </Button>
                        </div>
                      ) : (
                        <Label
                          htmlFor="video"
                          className="flex flex-col items-center justify-center w-full py-8 cursor-pointer"
                        >
                          <Upload className="h-12 w-12 text-ghibli-meadow mb-2" />
                          <span className="text-lg font-korean mb-1">강의 영상을 업로드하세요</span>
                          <span className="text-sm text-muted-foreground font-korean">
                            AI가 자동으로 커리큘럼과 강의 프롬프트를 생성합니다
                          </span>
                          <input
                            id="video"
                            type="file"
                            accept="video/*"
                            onChange={handleVideoChange}
                            className="sr-only"
                          />
                        </Label>
                      )}
                    </div>
                  </div>
                  
                  {/* 커리큘럼 섹션 */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium font-korean">강의 커리큘럼</h3>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={addSection}
                        className="font-korean"
                      >
                        <Plus className="mr-1 h-4 w-4" />
                        섹션 추가
                      </Button>
                    </div>
                    
                    {sections.length === 0 ? (
                      <div className="text-center p-6 border border-dashed rounded-md bg-muted/30">
                        <p className="text-muted-foreground font-korean">
                          영상을 업로드하고 분석하면 자동으로 커리큘럼이 생성됩니다.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {sections.map((section, index) => (
                          <Card key={index} className="border border-ghibli-meadow/20">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div className="font-medium font-korean text-sm text-muted-foreground">섹션 {index + 1}</div>
                                <button 
                                  type="button"
                                  onClick={() => removeSection(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                              <div className="space-y-3">
                                <div>
                                  <Label htmlFor={`section-title-${index}`} className="font-korean text-sm">제목</Label>
                                  <Input 
                                    id={`section-title-${index}`}
                                    value={section.title}
                                    onChange={(e) => updateSection(index, 'title', e.target.value)}
                                    className="font-korean"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`section-content-${index}`} className="font-korean text-sm">내용</Label>
                                  <Textarea 
                                    id={`section-content-${index}`}
                                    value={section.content}
                                    onChange={(e) => updateSection(index, 'content', e.target.value)}
                                    className="font-korean"
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* 강의 프롬프트 미리보기 */}
                  {transcripts.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium font-korean mb-4">강의 프롬프트 미리보기</h3>
                      <div className="bg-muted/30 p-4 rounded-md max-h-[200px] overflow-y-auto">
                        {transcripts.map((text, index) => (
                          <p key={index} className="mb-2 font-korean text-sm">
                            {text}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* 제출 버튼 */}
                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      className="w-full btn-primary font-korean"
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          등록 중...
                        </>
                      ) : "강의 등록하기"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default CourseUpload;
