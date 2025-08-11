import apiClient from './client.js';
import type { 
  Course, 
  CreateCourseData, 
  UpdateCourseData,
  CourseFilters,
  PaginatedResponse,
  ApiResponse,
  Module,
  CreateModuleData,
  UpdateModuleData,
  Lesson,
  CreateLessonData,
  UpdateLessonData,
  Enrollment,
  CourseAnalytics
} from '../types/index.js';
import type { AxiosError } from 'axios';

export const coursesApi = {
  // Public course operations
  getAllCourses: async (filters?: CourseFilters): Promise<PaginatedResponse<Course>> => {
    try {
      const params = new URLSearchParams();
      if (filters?.page !== undefined) params.append('page', filters.page.toString());
      if (filters?.size !== undefined) params.append('size', filters.size.toString());
      if (filters?.sortBy) params.append('sortBy', filters.sortBy);
      if (filters?.sortDirection) params.append('sortDirection', filters.sortDirection);
      if (filters?.keyword) params.append('keyword', filters.keyword);
      if (filters?.category) params.append('category', filters.category);

      const response = await apiClient.get(`/api/courses?${params}`);
      if (response.data.success) {
        const courses = response.data.data;
        
        // Transform backend response to match our PaginatedResponse interface
        // Since backend doesn't return pagination info yet, we'll create a mock pagination
        const currentPage = filters?.page || 0;
        const pageSize = filters?.size || 10;
        const totalElements = courses.length;
        const totalPages = Math.ceil(totalElements / pageSize);
        
        const paginatedResponse: PaginatedResponse<Course> = {
          content: courses,
          page: currentPage,
          size: pageSize,
          totalElements: totalElements,
          totalPages: totalPages,
          first: currentPage === 0,
          last: currentPage >= totalPages - 1
        };
        
        return paginatedResponse;
      } else {
        throw new Error(response.data.message || 'Failed to fetch courses');
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response?.data) {
        throw new Error(axiosError.response.data.message || 'Failed to fetch courses');
      }
      throw new Error('Network error');
    }
  },

  getCourseById: async (courseId: number): Promise<Course> => {
    try {
      const response = await apiClient.get(`/api/courses/${courseId}`);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch course');
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response?.data) {
        throw new Error(axiosError.response.data.message || 'Failed to fetch course');
      }
      throw new Error('Network error');
    }
  },

  getCoursesByCategory: async (category: string): Promise<Course[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Course[]>>(`/api/courses/category/${category}`);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch courses by category');
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response?.data) {
        throw new Error(axiosError.response.data.message || 'Failed to fetch courses by category');
      }
      throw new Error('Network error');
    }
  },

  searchCourses: async (keyword: string): Promise<Course[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Course[]>>(`/api/courses/search?keyword=${encodeURIComponent(keyword)}`);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to search courses');
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response?.data) {
        throw new Error(axiosError.response.data.message || 'Failed to search courses');
      }
      throw new Error('Network error');
    }
  },

  getAllCategories: async (): Promise<string[]> => {
    try {
      const response = await apiClient.get<ApiResponse<string[]>>('/api/courses/categories');
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch categories');
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response?.data) {
        throw new Error(axiosError.response.data.message || 'Failed to fetch categories');
      }
      throw new Error('Network error');
    }
  }
};

export const instructorCoursesApi = {
  // Instructor course operations
  createCourse: async (courseData: CreateCourseData): Promise<Course> => {
    try {
      const response = await apiClient.post<ApiResponse<Course>>('/api/instructor/courses', courseData);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to create course');
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response?.data) {
        throw new Error(axiosError.response.data.message || 'Failed to create course');
      }
      throw new Error('Network error');
    }
  },

  getMyCourses: async (page = 0, size = 10): Promise<PaginatedResponse<Course>> => {
    try {
      const response = await apiClient.get<ApiResponse<PaginatedResponse<Course>>>(`/api/instructor/courses?page=${page}&size=${size}`);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch instructor courses');
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response?.data) {
        throw new Error(axiosError.response.data.message || 'Failed to fetch instructor courses');
      }
      throw new Error('Network error');
    }
  },

  getCourseDetails: async (courseId: number): Promise<Course> => {
    try {
      const response = await apiClient.get<ApiResponse<Course>>(`/api/instructor/courses/${courseId}`);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch course details');
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response?.data) {
        throw new Error(axiosError.response.data.message || 'Failed to fetch course details');
      }
      throw new Error('Network error');
    }
  },

  updateCourse: async (courseId: number, courseData: UpdateCourseData): Promise<Course> => {
    try {
      const response = await apiClient.put<ApiResponse<Course>>(`/api/instructor/courses/${courseId}`, courseData);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to update course');
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response?.data) {
        throw new Error(axiosError.response.data.message || 'Failed to update course');
      }
      throw new Error('Network error');
    }
  },

  deleteCourse: async (courseId: number): Promise<void> => {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(`/api/instructor/courses/${courseId}`);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete course');
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response?.data) {
        throw new Error(axiosError.response.data.message || 'Failed to delete course');
      }
      throw new Error('Network error');
    }
  },

  getCourseEnrollments: async (courseId: number, page = 0, size = 10): Promise<PaginatedResponse<Enrollment>> => {
    try {
      const response = await apiClient.get<ApiResponse<PaginatedResponse<Enrollment>>>(`/api/instructor/courses/${courseId}/enrollments?page=${page}&size=${size}`);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch course enrollments');
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response?.data) {
        throw new Error(axiosError.response.data.message || 'Failed to fetch course enrollments');
      }
      throw new Error('Network error');
    }
  },

  getCourseAnalytics: async (courseId: number): Promise<CourseAnalytics> => {
    try {
      const response = await apiClient.get<ApiResponse<CourseAnalytics>>(`/api/instructor/courses/${courseId}/analytics`);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch course analytics');
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response?.data) {
        throw new Error(axiosError.response.data.message || 'Failed to fetch course analytics');
      }
      throw new Error('Network error');
    }
  },

  // Module operations
  createModule: async (courseId: number, moduleData: CreateModuleData): Promise<Module> => {
    try {
      const response = await apiClient.post<ApiResponse<Module>>(`/api/instructor/courses/${courseId}/modules`, moduleData);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to create module');
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response?.data) {
        throw new Error(axiosError.response.data.message || 'Failed to create module');
      }
      throw new Error('Network error');
    }
  },

  getCourseModules: async (courseId: number): Promise<Module[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Module[]>>(`/api/instructor/courses/${courseId}/modules`);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch course modules');
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response?.data) {
        throw new Error(axiosError.response.data.message || 'Failed to fetch course modules');
      }
      throw new Error('Network error');
    }
  },

  updateModule: async (moduleId: number, moduleData: UpdateModuleData): Promise<Module> => {
    try {
      const response = await apiClient.put<ApiResponse<Module>>(`/api/instructor/modules/${moduleId}`, moduleData);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to update module');
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response?.data) {
        throw new Error(axiosError.response.data.message || 'Failed to update module');
      }
      throw new Error('Network error');
    }
  },

  deleteModule: async (moduleId: number): Promise<void> => {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(`/api/instructor/modules/${moduleId}`);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete module');
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response?.data) {
        throw new Error(axiosError.response.data.message || 'Failed to delete module');
      }
      throw new Error('Network error');
    }
  },

  // Lesson operations
  createLesson: async (moduleId: number, lessonData: CreateLessonData): Promise<Lesson> => {
    try {
      const response = await apiClient.post<ApiResponse<Lesson>>(`/api/instructor/modules/${moduleId}/lessons`, lessonData);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to create lesson');
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response?.data) {
        throw new Error(axiosError.response.data.message || 'Failed to create lesson');
      }
      throw new Error('Network error');
    }
  },

  getModuleLessons: async (moduleId: number): Promise<Lesson[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Lesson[]>>(`/api/instructor/modules/${moduleId}/lessons`);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch module lessons');
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response?.data) {
        throw new Error(axiosError.response.data.message || 'Failed to fetch module lessons');
      }
      throw new Error('Network error');
    }
  },

  updateLesson: async (lessonId: number, lessonData: UpdateLessonData): Promise<Lesson> => {
    try {
      const response = await apiClient.put<ApiResponse<Lesson>>(`/api/instructor/lessons/${lessonId}`, lessonData);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to update lesson');
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response?.data) {
        throw new Error(axiosError.response.data.message || 'Failed to update lesson');
      }
      throw new Error('Network error');
    }
  },

  deleteLesson: async (lessonId: number): Promise<void> => {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(`/api/instructor/lessons/${lessonId}`);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete lesson');
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response?.data) {
        throw new Error(axiosError.response.data.message || 'Failed to delete lesson');
      }
      throw new Error('Network error');
    }
  }
};
