// Type definitions for admin components
export type CourseStatus = 'pending' | 'published';
export type InstructorStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

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
  bio: string;
  category: string;
  profileImage: string;
  createdAt?: string;
  status: InstructorStatus;
}

export interface InstructorListResponse {
  success: boolean;
  message: string;
  teachers: InstructorType[];
  totalPages: number;
  currentPage: number;
}

/**
 * 강사 상세 조회 응답 타입
 */
export interface InstructorDetailResponse {
  success: boolean;
  message: string;
  id: number;
  name: string;
  bio: string;
  category: string;
  profileImage: string;
  resumeFile: string;
  status: InstructorStatus;
}
