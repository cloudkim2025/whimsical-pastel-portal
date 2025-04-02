
export type InstructorStatus = 'pending' | 'approved' | 'rejected';

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

export interface InstructorApplication {
  name: string;
  introduction: string;
  category: string;
  profileImage: File;
  resume: File;
}
