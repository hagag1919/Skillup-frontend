import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Trash2, Eye, Star, Play, Pause, BookOpen } from 'lucide-react';
import type { Course, PaginatedResponse, CreateCourseRequest } from '../types';
import { apiService } from '../services/apiService';
import { LoadingSpinner } from '../components/Loading';
import CourseModal from '../components/CourseModal';

interface CourseCardProps {
  course: Course;
  onDelete: (courseId: string) => void;
  onToggleFeature: (courseId: string, featured: boolean) => void;
  onToggleActive: (courseId: string, active: boolean) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ 
  course, 
  onDelete, 
  onToggleFeature, 
  onToggleActive 
}) => {
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const handleDelete = () => {
    if (deleteConfirm) {
      onDelete(course.id);
    } else {
      setDeleteConfirm(true);
      setTimeout(() => setDeleteConfirm(false), 3000);
    }
  };

  return (
    <div className="card hover:shadow-md transition-shadow">
      {/* Course Thumbnail */}
      <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg mb-4 flex items-center justify-center">
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt={course.title || 'Course thumbnail'}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <Play className="w-12 h-12 text-purple-500" />
        )}
      </div>

      {/* Course Info */}
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {course.title || 'Untitled Course'}
          </h3>
          <div className="flex items-center space-x-1 ml-2">
            {course.isFeatured && (
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
            )}
            <span
              className={`w-2 h-2 rounded-full ${
                course.isActive ? 'bg-green-500' : 'bg-gray-400'
              }`}
            />
          </div>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2">
          {course.description}
        </p>

        <div className="flex items-center justify-between text-sm">
          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
            {course.category}
          </span>
          <span className="text-gray-500">
            {course.instructor?.name || 'Unknown Instructor'}
          </span>
        </div>

        <div className="text-xs text-gray-500">
          Created: {new Date(course.createdAt).toLocaleDateString()}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex space-x-2">
            <button
              onClick={() => onToggleActive(course.id, !course.isActive)}
              className={`flex items-center px-2 py-1 rounded text-xs font-medium ${
                course.isActive
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
              aria-label={course.isActive ? 'Deactivate course' : 'Activate course'}
            >
              {course.isActive ? (
                <>
                  <Pause className="w-3 h-3 mr-1" />
                  Deactivate
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 mr-1" />
                  Activate
                </>
              )}
            </button>

            <button
              onClick={() => onToggleFeature(course.id, !course.isFeatured)}
              className={`flex items-center px-2 py-1 rounded text-xs font-medium ${
                course.isFeatured
                  ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              aria-label={course.isFeatured ? 'Unfeature course' : 'Feature course'}
            >
              <Star className="w-3 h-3 mr-1" />
              {course.isFeatured ? 'Unfeature' : 'Feature'}
            </button>
          </div>

          <div className="flex space-x-2">
            <button 
              className="text-blue-600 hover:text-blue-800"
              aria-label="View course details"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className={`${
                deleteConfirm
                  ? 'text-red-600 bg-red-50 px-2 py-1 rounded text-xs'
                  : 'text-gray-400 hover:text-red-600'
              }`}
              aria-label="Delete course"
            >
              {deleteConfirm ? 'Confirm?' : <Trash2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 12,
    totalElements: 0,
    totalPages: 0,
  });

  const fetchCourses = useCallback(async (page = 0, search = '') => {
    try {
      setLoading(true);
      setError('');
      
      let response: PaginatedResponse<Course>;
      
      if (search) {
        const searchResults = await apiService.searchCourses(search);
        response = {
          content: searchResults,
          page: 0,
          size: searchResults.length,
          totalElements: searchResults.length,
          totalPages: 1,
          first: true,
          last: true,
        };
      } else {
        response = await apiService.getAllCourses({
          page,
          size: pagination.size,
          sortBy: 'createdAt',
          sortDirection: 'desc',
        });
      }
      
      setCourses(response.content);
      setPagination({
        page: response.page,
        size: response.size,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch courses');
      // Mock data for demo
      const mockCourses: Course[] = [
        {
          id: '1',
          title: 'Complete Java Programming Course',
          description: 'Learn Java from basics to advanced concepts with hands-on projects',
          category: 'Programming',
          thumbnailUrl: '',
          instructorId: '2',
          instructor: { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'INSTRUCTOR' },
          isActive: true,
          isFeatured: true,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
        {
          id: '2',
          title: 'Advanced Spring Boot Development',
          description: 'Master Spring Boot framework with microservices architecture',
          category: 'Programming',
          thumbnailUrl: '',
          instructorId: '2',
          instructor: { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'INSTRUCTOR' },
          isActive: true,
          isFeatured: false,
          createdAt: '2024-01-10T14:30:00Z',
          updatedAt: '2024-01-10T14:30:00Z',
        },
        {
          id: '3',
          title: 'React Fundamentals',
          description: 'Build modern web applications with React and TypeScript',
          category: 'Web Development',
          thumbnailUrl: '',
          instructorId: '2',
          instructor: { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'INSTRUCTOR' },
          isActive: false,
          isFeatured: false,
          createdAt: '2024-01-05T09:15:00Z',
          updatedAt: '2024-01-05T09:15:00Z',
        },
      ];
      setCourses(mockCourses);
      setPagination({
        page: 0,
        size: 12,
        totalElements: mockCourses.length,
        totalPages: 1,
      });
    } finally {
      setLoading(false);
    }
  }, [pagination.size]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCourses(0, searchTerm);
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await apiService.deleteCourse(courseId);
      setCourses((prevCourses) => Array.isArray(prevCourses) ? prevCourses.filter(course => course.id !== courseId) : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete course');
    }
  };

  const handleToggleFeature = async (courseId: string, featured: boolean) => {
    try {
      if (featured) {
        await apiService.featureCourse(courseId);
      } else {
        await apiService.unfeatureCourse(courseId);
      }
      
      setCourses((prevCourses) => Array.isArray(prevCourses) ? prevCourses.map(course => 
        course.id === courseId ? { ...course, isFeatured: featured } : course
      ) : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update course');
    }
  };

  const handleToggleActive = async (courseId: string, active: boolean) => {
    try {
      if (active) {
        await apiService.activateCourse(courseId);
      } else {
        await apiService.deactivateCourse(courseId);
      }
      
      setCourses((prevCourses) => Array.isArray(prevCourses) ? prevCourses.map(course => 
        course.id === courseId ? { ...course, isActive: active } : course
      ) : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update course');
    }
  };

  const handlePageChange = (newPage: number) => {
    fetchCourses(newPage, searchTerm);
  };

  const handleCreateCourse = () => {
    setCourseModalOpen(true);
  };

  const handleSaveCourse = async (courseData: CreateCourseRequest) => {
    try {
      const newCourse = await apiService.createCourse(courseData);
      setCourses((prevCourses) => [newCourse, ...(Array.isArray(prevCourses) ? prevCourses : [])]);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create course');
    }
  };

  const handleCloseModal = () => {
    setCourseModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-600 mt-2">
            Manage all courses on your platform
          </p>
        </div>
        <button onClick={handleCreateCourse} className="btn btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Course
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <div className="flex">
            <div className="flex-1">
              <p className="text-sm font-medium">
                {error.includes('Access denied') || error.includes('Admin privileges') ? 'Access Denied' : 'Connection Error'}
              </p>
              <p className="text-sm mt-1">
                {error.includes('Access denied') || error.includes('Admin privileges') 
                  ? 'You need admin privileges to access this dashboard. Please log in with an admin account.'
                  : error.includes('Authentication required')
                  ? 'Your session has expired. Please log in again.'
                  : `Using demo data. ${error}`
                }
              </p>
              {(error.includes('Access denied') || error.includes('Authentication required')) && (
                <button 
                  onClick={() => window.location.href = '/login'}
                  className="text-sm text-red-600 hover:text-red-800 underline mt-2"
                >
                  Go to Login
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="card">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search courses by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
      </div>

      {/* Courses Grid */}
      {loading && (!courses || courses.length === 0) ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.isArray(courses) ? courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onDelete={handleDeleteCourse}
              onToggleFeature={handleToggleFeature}
              onToggleActive={handleToggleActive}
            />
          )) : []}
        </div>
      )}

      {(!courses || courses.length === 0) && !loading && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600 mb-4">Get started by creating your first course.</p>
          <button className="btn btn-primary flex items-center gap-2 mx-auto">
            <Plus className="w-4 h-4" />
            Add Course
          </button>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Showing {pagination.page * pagination.size + 1} to{' '}
            {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of{' '}
            {pagination.totalElements} courses
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 0}
              className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages - 1}
              className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Course Modal */}
      <CourseModal
        isOpen={courseModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCourse}
      />
    </div>
  );
};

export default CoursesPage;
