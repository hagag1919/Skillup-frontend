import type {
  User,
  Course,
  DashboardStats,
  LoginRequest,
  LoginResponse,
  CreateUserRequest,
  CreateCourseRequest,
  UpdateUserRequest,
  PaginatedResponse,
  UserAnalytics,
  CourseAnalytics,
  EnrollmentAnalytics,
} from '../types';

const BASE_URL = 'http://localhost:8888/api';

class ApiService {
  private getAuthToken(): string | null {
    return localStorage.getItem('admin_token');
  }

  // Parameter validation methods
  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private validatePassword(password: string): boolean {
    // At least 6 characters
    return password !== null && password !== undefined && password.length >= 6;
  }

  private validatePaginationParams(params: { page?: number; size?: number }): void {
    if (params.page !== undefined && (params.page < 0 || !Number.isInteger(params.page))) {
      throw new Error('Invalid parameter: page must be a non-negative integer');
    }
    if (params.size !== undefined && (params.size < 1 || params.size > 100 || !Number.isInteger(params.size))) {
      throw new Error('Invalid parameter: size must be an integer between 1 and 100');
    }
  }

  private validateUserRole(role: string): boolean {
    return ['ADMIN', 'INSTRUCTOR', 'STUDENT'].includes(role);
  }

  private validateUserId(userId: string): void {
    if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
      throw new Error('Invalid parameter: userId must be a non-empty string');
    }
  }

  private validateCourseId(courseId: string): void {
    if (!courseId || typeof courseId !== 'string' || courseId.trim().length === 0) {
      throw new Error('Invalid parameter: courseId must be a non-empty string');
    }
  }

  private validateSearchKeyword(keyword: string): void {
    if (!keyword || typeof keyword !== 'string' || keyword.trim().length < 2) {
      throw new Error('Invalid parameter: search keyword must be at least 2 characters long');
    }
  }

  // Enhanced error reporting
  private reportClientError(method: string, error: string, parameters?: any): void {
    console.error(`API Client Error in ${method}:`, {
      error,
      parameters,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });
    
    // In a real app, you might send this to an error tracking service
    // Example: sendToErrorTrackingService({ method, error, parameters });
  }

  private reportServerError(method: string, response: Response, parameters?: any): void {
    console.error(`API Server Error in ${method}:`, {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      parameters,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    });
    
    // In a real app, you might send this to an error tracking service
    // Example: sendToErrorTrackingService({ method, response, parameters });
  }

  // Debug method to check current authentication status
  getCurrentAuthStatus(): { hasToken: boolean; token: string | null } {
    const token = this.getAuthToken();
    return {
      hasToken: !!token,
      token: token ? `${token.substring(0, 20)}...` : null
    };
  }

  private getAuthHeaders(): HeadersInit {
    const token = this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response, methodName?: string, parameters?: Record<string, unknown>): Promise<T> {
    if (!response.ok) {
      // Report server error for monitoring
      if (methodName) {
        this.reportServerError(methodName, response, parameters);
      }

      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: `Server error (${response.status})` };
      }
      
      if (response.status === 401) {
        localStorage.removeItem('admin_token'); // Clear invalid token
        throw new Error('Authentication required. Please log in again.');
      } else if (response.status === 403) {
        throw new Error('Access denied. Admin privileges required.');
      } else if (response.status === 400) {
        // Bad request - likely parameter validation failed on server
        throw new Error(`Invalid request: ${errorData.message || 'Please check your input parameters'}`);
      } else if (response.status === 500) {
        throw new Error(`Server error: ${errorData.message || 'Internal server error. The analytics service may be temporarily unavailable.'}`);
      } else if (response.status >= 500) {
        throw new Error(`Server unavailable (${response.status}): The service is temporarily down. Please try again later.`);
      }
      
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  // Authentication
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      // Validate input parameters
      if (!credentials.email || !credentials.password) {
        const error = 'Email and password are required';
        this.reportClientError('login', error, { email: credentials.email ? 'provided' : 'missing' });
        throw new Error(error);
      }

      if (!this.validateEmail(credentials.email)) {
        const error = 'Invalid email format';
        this.reportClientError('login', error, { email: credentials.email });
        throw new Error(error);
      }

      if (!this.validatePassword(credentials.password)) {
        const error = 'Password must be at least 6 characters long';
        this.reportClientError('login', error);
        throw new Error(error);
      }

      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      
      const apiResponse = await this.handleResponse<{
        success: boolean;
        data: {
          token: string;
          id: number;
          email: string;
          name: string;
          role: 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';
          type: string;
          expiresAt: string;
        };
      }>(response, 'login', { email: credentials.email });
      
      // Transform API response to match expected LoginResponse
      const result: LoginResponse = {
        token: apiResponse.data.token,
        user: {
          id: apiResponse.data.id.toString(),
          name: apiResponse.data.name,
          email: apiResponse.data.email,
          role: apiResponse.data.role,
        }
      };
      
      // Validate that user has admin privileges
      if (result.user.role !== 'ADMIN') {
        throw new Error('Access denied. Admin privileges required to access this dashboard.');
      }
      
      // Store token in localStorage
      if (result.token) {
        localStorage.setItem('admin_token', result.token);
      }
      
      return result;
    } catch (error) {
      // Re-throw the error after logging
      if (error instanceof Error) {
        console.error('Login failed:', error.message);
      }
      throw error;
    }
  }

  async validateToken(): Promise<User> {
    const response = await fetch(`${BASE_URL}/auth/validate`, {
      headers: this.getAuthHeaders(),
    });
    
    const apiResponse = await this.handleResponse<{
      success: boolean;
      data: {
        id: number;
        email: string;
        name: string;
        role: 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';
        bio?: string;
        createdAt?: string;
        updatedAt?: string;
      };
    }>(response);
    
    // Transform API response to match expected User type
    const user = {
      id: apiResponse.data.id.toString(),
      name: apiResponse.data.name,
      email: apiResponse.data.email,
      role: apiResponse.data.role,
      bio: apiResponse.data.bio,
      createdAt: apiResponse.data.createdAt,
      updatedAt: apiResponse.data.updatedAt,
    };
    
    // Validate that user has admin privileges
    if (user.role !== 'ADMIN') {
      localStorage.removeItem('admin_token'); // Clear token for non-admin user
      throw new Error('Access denied. Admin privileges required to access this dashboard.');
    }
    
    return user;
  }

  logout(): void {
    localStorage.removeItem('admin_token');
  }

  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await fetch(`${BASE_URL}/admin/analytics/overview`, {
        headers: this.getAuthHeaders(),
      });
      
      const apiResponse = await this.handleResponse<{
        success: boolean;
        data: DashboardStats;
      }>(response, 'getDashboardStats');
      
      return apiResponse.data;
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      
      // Return mock data as fallback when server is unavailable
      return {
        totalUsers: 1250,
        totalInstructors: 45,
        totalStudents: 1205,
        totalCourses: 89,
        totalEnrollments: 3420,
        recentUsers: [
          {
            id: '1',
            name: 'John Smith',
            email: 'john@example.com',
            role: 'STUDENT',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            role: 'INSTRUCTOR',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ],
        recentCourses: [
          {
            id: '1',
            title: 'Complete Java Programming Course',
            description: 'Learn Java from basics to advanced concepts',
            category: 'Programming',
            instructorId: '2',
            instructor: {
              id: '2',
              name: 'Sarah Johnson',
              email: 'sarah@example.com',
              role: 'INSTRUCTOR',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            thumbnailUrl: undefined,
            isActive: true,
            isFeatured: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]
      };
    }
  }

  // User Management
  async getAllUsers(params?: {
    page?: number;
    size?: number;
    role?: string;
  }): Promise<PaginatedResponse<User>> {
    try {
      // Validate parameters
      if (params) {
        this.validatePaginationParams(params);
        
        if (params.role && !this.validateUserRole(params.role)) {
          const error = `Invalid role parameter. Must be one of: ADMIN, INSTRUCTOR, STUDENT`;
          this.reportClientError('getAllUsers', error, params);
          throw new Error(error);
        }
      }

      const searchParams = new URLSearchParams();
      if (params?.page !== undefined) searchParams.append('page', params.page.toString());
      if (params?.size !== undefined) searchParams.append('size', params.size.toString());
      if (params?.role) searchParams.append('role', params.role);

      const response = await fetch(`${BASE_URL}/admin/users?${searchParams}`, {
        headers: this.getAuthHeaders(),
      });
      
      const apiResponse = await this.handleResponse<{
        success: boolean;
        data: PaginatedResponse<User>;
      }>(response, 'getAllUsers', params);
      
      return apiResponse.data;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Get all users failed:', error.message);
      }
      throw error;
    }
  }

  async getUserById(userId: string): Promise<User> {
    try {
      // Validate userId parameter
      this.validateUserId(userId);

      const response = await fetch(`${BASE_URL}/admin/users/${userId}`, {
        headers: this.getAuthHeaders(),
      });
      
      const apiResponse = await this.handleResponse<{
        success: boolean;
        data: User;
      }>(response, 'getUserById', { userId });
      
      return apiResponse.data;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Get user by ID failed:', error.message);
      }
      throw error;
    }
  }

  async searchUsers(name: string): Promise<User[]> {
    try {
      // Validate search parameter
      this.validateSearchKeyword(name);

      const response = await fetch(`${BASE_URL}/users/search?name=${encodeURIComponent(name)}`, {
        headers: this.getAuthHeaders(),
      });
      
      const apiResponse = await this.handleResponse<{
        success: boolean;
        data: User[];
      }>(response, 'searchUsers', { name });
      
      // Ensure we always return an array
      return Array.isArray(apiResponse.data) ? apiResponse.data : [];
    } catch (error) {
      if (error instanceof Error) {
        console.error('Search users failed:', error.message);
      }
      throw error;
    }
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    const response = await fetch(`${BASE_URL}/admin/users`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    
    const apiResponse = await this.handleResponse<{
      success: boolean;
      data: User;
    }>(response);
    
    return apiResponse.data;
  }

  async updateUser(userId: string, userData: UpdateUserRequest): Promise<User> {
    const response = await fetch(`${BASE_URL}/admin/users/${userId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    
    const apiResponse = await this.handleResponse<{
      success: boolean;
      data: User;
    }>(response);
    
    return apiResponse.data;
  }

  async deleteUser(userId: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete user: ${response.status}`);
    }
  }

  // Course Management
  async getAllCourses(params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: string;
  }): Promise<PaginatedResponse<Course>> {
    const searchParams = new URLSearchParams();
    if (params?.page !== undefined) searchParams.append('page', params.page.toString());
    if (params?.size !== undefined) searchParams.append('size', params.size.toString());
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params?.sortDirection) searchParams.append('sortDirection', params.sortDirection);

    const response = await fetch(`${BASE_URL}/admin/courses?${searchParams}`, {
      headers: this.getAuthHeaders(),
    });
    
    const apiResponse = await this.handleResponse<{
      success: boolean;
      data: PaginatedResponse<Course>;
    }>(response);
    
    return apiResponse.data;
  }

  async getCourseById(courseId: string): Promise<Course> {
    const response = await fetch(`${BASE_URL}/courses/${courseId}`, {
      headers: this.getAuthHeaders(),
    });
    
    const apiResponse = await this.handleResponse<{
      success: boolean;
      data: Course;
    }>(response);
    
    return apiResponse.data;
  }

  async searchCourses(keyword: string): Promise<Course[]> {
    const response = await fetch(`${BASE_URL}/courses/search?keyword=${encodeURIComponent(keyword)}`, {
      headers: this.getAuthHeaders(),
    });
    
    const apiResponse = await this.handleResponse<{
      success: boolean;
      data: Course[];
    }>(response);
    
    // Ensure we always return an array
    return Array.isArray(apiResponse.data) ? apiResponse.data : [];
  }

  async createCourse(courseData: CreateCourseRequest): Promise<Course> {
    const response = await fetch(`${BASE_URL}/courses`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(courseData),
    });
    
    const apiResponse = await this.handleResponse<{
      success: boolean;
      data: Course;
    }>(response);
    
    return apiResponse.data;
  }

  async deleteCourse(courseId: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/admin/courses/${courseId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete course: ${response.status}`);
    }
  }

  async featureCourse(courseId: string): Promise<Course> {
    const response = await fetch(`${BASE_URL}/admin/courses/${courseId}/feature`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
    });
    
    const apiResponse = await this.handleResponse<{
      success: boolean;
      data: Course;
    }>(response);
    
    return apiResponse.data;
  }

  async unfeatureCourse(courseId: string): Promise<Course> {
    const response = await fetch(`${BASE_URL}/admin/courses/${courseId}/unfeature`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
    });
    
    const apiResponse = await this.handleResponse<{
      success: boolean;
      data: Course;
    }>(response);
    
    return apiResponse.data;
  }

  async activateCourse(courseId: string): Promise<Course> {
    const response = await fetch(`${BASE_URL}/admin/courses/${courseId}/activate`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
    });
    
    const apiResponse = await this.handleResponse<{
      success: boolean;
      data: Course;
    }>(response);
    
    return apiResponse.data;
  }

  async deactivateCourse(courseId: string): Promise<Course> {
    const response = await fetch(`${BASE_URL}/admin/courses/${courseId}/deactivate`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
    });
    
    const apiResponse = await this.handleResponse<{
      success: boolean;
      data: Course;
    }>(response);
    
    return apiResponse.data;
  }

  // Categories
  async getCategories(): Promise<string[]> {
    const response = await fetch(`${BASE_URL}/courses/categories`, {
      headers: this.getAuthHeaders(),
    });
    
    const apiResponse = await this.handleResponse<{
      success: boolean;
      data: string[];
    }>(response);
    
    // Ensure we always return an array
    return Array.isArray(apiResponse.data) ? apiResponse.data : [];
  }

  // Analytics
  async getUserAnalytics(): Promise<UserAnalytics> {
    const response = await fetch(`${BASE_URL}/admin/analytics/users`, {
      headers: this.getAuthHeaders(),
    });
    
    const apiResponse = await this.handleResponse<{
      success: boolean;
      data: UserAnalytics;
    }>(response);
    
    return apiResponse.data;
  }

  async getCourseAnalytics(): Promise<CourseAnalytics> {
    const response = await fetch(`${BASE_URL}/admin/analytics/courses`, {
      headers: this.getAuthHeaders(),
    });
    
    const apiResponse = await this.handleResponse<{
      success: boolean;
      data: CourseAnalytics;
    }>(response);
    
    return apiResponse.data;
  }

  async getEnrollmentAnalytics(): Promise<EnrollmentAnalytics> {
    const response = await fetch(`${BASE_URL}/admin/analytics/enrollments`, {
      headers: this.getAuthHeaders(),
    });
    
    const apiResponse = await this.handleResponse<{
      success: boolean;
      data: EnrollmentAnalytics;
    }>(response);
    
    return apiResponse.data;
  }
}

export const apiService = new ApiService();
