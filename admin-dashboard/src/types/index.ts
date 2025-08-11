export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnailUrl?: string;
  instructorId: string;
  instructor?: User;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: string;
  title: string;
  courseId: string;
  moduleOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  moduleId: string;
  videoUrl?: string;
  durationSeconds: number;
  lessonOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalInstructors: number;
  totalStudents: number;
  totalCourses: number;
  totalEnrollments: number;
  recentUsers: User[];
  recentCourses: Course[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';
  bio?: string;
}

export interface CreateCourseRequest {
  title: string;
  description: string;
  category: string;
  thumbnailUrl?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  role?: 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';
  bio?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  timestamp: string;
}

export interface UserAnalytics {
  totalUsers: number;
  usersByRole: Array<{
    role: string;
    count: number;
  }>;
  recentRegistrations: Array<{
    date: string;
    count: number;
  }>;
  userGrowthData: Array<{
    month: string;
    count: number;
  }>;
}

export interface CourseAnalytics {
  totalCourses: number;
  coursesByCategory: Array<{
    category: string;
    count: number;
  }>;
  featuredCourses: number;
  activeCourses: number;
  courseCreationData: Array<{
    month: string;
    count: number;
  }>;
}

export interface EnrollmentAnalytics {
  totalEnrollments: number;
  enrollmentsByMonth: Array<{
    month: string;
    count: number;
  }>;
  topCourses: Array<{
    courseTitle: string;
    enrollments: number;
  }>;
  enrollmentGrowth: Array<{
    date: string;
    count: number;
  }>;
}

export interface UserAnalytics {
  totalUsers: number;
  usersByRole: { role: string; count: number }[];
  recentRegistrations: { date: string; count: number }[];
  userGrowthData: { month: string; count: number }[];
}

export interface CourseAnalytics {
  totalCourses: number;
  coursesByCategory: { category: string; count: number }[];
  featuredCourses: number;
  activeCourses: number;
  courseCreationData: { month: string; count: number }[];
}

export interface EnrollmentAnalytics {
  totalEnrollments: number;
  enrollmentsByMonth: { month: string; count: number }[];
  topCourses: { courseTitle: string; enrollments: number }[];
  enrollmentGrowth: { date: string; count: number }[];
}
