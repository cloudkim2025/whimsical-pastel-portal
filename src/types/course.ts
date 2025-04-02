
// Type definitions for courses
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
