// User and Auth types
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  bio?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    userId: number;
    user: User;
  };
  message?: string;
}

// Course types
export interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  thumbnailUrl?: string;
  instructorId: number;
  instructor?: User;
  createdAt: string;
  updatedAt: string;
  modules?: Module[];
  isActive?: boolean;
  isFeatured?: boolean;
  enrollmentCount?: number;
  rating?: number;
  reviewCount?: number;
}

export interface CreateCourseData {
  title: string;
  description: string;
  category: string;
  thumbnailUrl?: string;
}

export interface UpdateCourseData {
  title?: string;
  description?: string;
  category?: string;
  thumbnailUrl?: string;
}

// Module types
export interface Module {
  id: number;
  title: string;
  courseId: number;
  moduleOrder: number;
  course?: Course;
  lessons?: Lesson[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateModuleData {
  title: string;
  courseId: number;
  moduleOrder: number;
}

export interface UpdateModuleData {
  title?: string;
  courseId?: number;
  moduleOrder?: number;
}

// Lesson types
export interface Lesson {
  id: number;
  title: string;
  moduleId: number;
  videoUrl?: string;
  durationSeconds?: number;
  lessonOrder: number;
  module?: Module;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLessonData {
  title: string;
  moduleId: number;
  videoUrl?: string;
  durationSeconds?: number;
  lessonOrder: number;
}

export interface UpdateLessonData {
  title?: string;
  moduleId?: number;
  videoUrl?: string;
  durationSeconds?: number;
  lessonOrder?: number;
}

// Enrollment types
export interface Enrollment {
  id: number;
  userId: number;
  courseId: number;
  enrolledAt: string;
  completedAt?: string;
  progress?: number;
  user?: User;
  course?: Course;
}

// Progress types
export interface Progress {
  id: number;
  userId: number;
  lessonId: number;
  completed: boolean;
  completedAt?: string;
  user?: User;
  lesson?: Lesson;
}

// Quiz types
export interface Quiz {
  id: number;
  title: string;
  description?: string;
  lessonId: number;
  questions: QuizQuestion[];
  timeLimit?: number;
  passingScore?: number;
  maxAttempts?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
  points?: number;
}

export interface QuizAttempt {
  id: number;
  userId: number;
  quizId: number;
  answers: QuizAnswer[];
  score: number;
  passed: boolean;
  startedAt: string;
  completedAt?: string;
  timeSpent?: number;
}

export interface QuizAnswer {
  questionId: number;
  answer: string | number;
  isCorrect?: boolean;
}

// Analytics types
export interface CourseAnalytics {
  courseId: number;
  enrollmentCount: number;
  completionRate: number;
  averageRating: number;
  totalRevenue?: number;
  monthlyEnrollments?: number[];
  topLessons?: {
    lessonId: number;
    title: string;
    completionRate: number;
  }[];
}

export interface DashboardStats {
  totalCourses: number;
  totalStudents: number;
  totalRevenue?: number;
  averageRating: number;
  recentEnrollments?: Enrollment[];
  topCourses?: Course[];
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = unknown> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

// Search and Filter types
export interface CourseFilters {
  category?: string;
  keyword?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface UserFilters {
  role?: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  name?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Certificate types
export interface Certificate {
  id: number;
  userId: number;
  courseId: number;
  certificateNumber: string;
  issuedAt: string;
  downloadUrl?: string;
  user?: User;
  course?: Course;
}

// Notification types
export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

// Component Props types
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface InputProps {
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}
