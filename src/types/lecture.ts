
// Type definitions for lectures
export type CourseStatus = 'pending' | 'published';

export interface CourseType {
  id: number;
  title: string;
  description: string;
  instructor: string;
  category: string;
  thumbnailUrl: string;
  publishedAt: string;
  status: CourseStatus;
  price?: number;
  curriculum?: string[];
  instructorId?: string;
}

export interface LectureType {
  id: number;
  courseId: number;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  order: number;
}

export interface LectureUploadResponse {
  id: number;
  title: string;
  description: string;
  category: string;
  thumbnailUrl: string;
  videoUrl: string;
  status: CourseStatus;
  message?: string;
}
