export type UserRole = 'student' | 'company' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  fullName: string;
  createdAt: number;
  skills?: string[];
  about?: string;
  major?: string;
  university?: string;
  studentId?: string;
  course?: number;
  companyName?: string;
  position?: string;
  headline?: string;
  phone?: string;
  telegram?: string;
  photoURL?: string;
  experience?: string;
}

export interface Internship {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  description: string;
  requiredSkills: string[];
  location: string;
  duration: string;
  isActive: boolean;
  createdAt: number;
}

export interface Application {
  id: string;
  internshipId: string;
  studentId: string;
  studentName: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: number;
  message?: string;
  completedAt?: number;
}

export interface CheckIn {
  id: string;
  applicationId: string;
  internshipId: string;
  studentId: string;
  studentName: string;
  companyId: string;
  week: number;
  studentNote: string;
  mentorFeedback?: string;
  createdAt: number;
}