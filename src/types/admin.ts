
// Type definitions for admin components
export type CourseStatus = 'pending' | 'published';
export type InstructorStatus = 'pending' | 'approved' | 'rejected';

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

export interface InstructorType {
  id: number;
  name: string;
  email: string;
  category: string;
  introduction: string;
  profileImageUrl: string;
  resumeUrl: string;
  appliedAt: string;
  status: InstructorStatus;
}
