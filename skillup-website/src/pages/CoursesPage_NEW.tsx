import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCourses, fetchCategories } from '../store/slices/coursesSlice';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Loading from '../components/ui/Loading';
import type { CourseFilters } from '../types/index';

const CoursesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { 
    courses, 
    coursesPagination, 
    categories, 
    loading, 
    categoriesLoading, 
    error 
  } = useAppSelector(state => state.courses);

  const [filters, setFilters] = useState<CourseFilters>({
    page: 0,
    size: 10,
    sortBy: 'id',
    sortDirection: 'desc'
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  useEffect(() => {
    // Fetch courses on component mount
    dispatch(fetchCourses(filters));
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    // Fetch courses when filters change
    const currentFilters = {
      ...filters,
      ...(selectedCategory !== 'All' && { category: selectedCategory }),
      ...(searchKeyword && { keyword: searchKeyword })
    };
    dispatch(fetchCourses(currentFilters));
  }, [dispatch, filters, selectedCategory, searchKeyword]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setFilters(prev => ({ ...prev, page: 0 })); // Reset to first page
  };

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    setFilters(prev => ({ ...prev, page: 0 })); // Reset to first page
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleSortChange = (sortBy: string, sortDirection: 'asc' | 'desc') => {
    setFilters(prev => ({ ...prev, sortBy, sortDirection, page: 0 }));
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <h3 className="font-medium mb-2">Error loading courses</h3>
          <p>{error}</p>
          <Button 
            onClick={() => dispatch(fetchCourses(filters))} 
            className="mt-3"
            variant="outline"
            size="sm"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading text="Loading courses..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Courses</h1>
          <p className="mt-2 text-gray-600">
            Discover our wide range of courses and start learning today
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchKeyword}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Category Filter */}
            <select 
              aria-label="Filter by category"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={categoriesLoading}
            >
              <option value="All">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            
            {/* Sort */}
            <select 
              aria-label="Sort courses"
              value={`${filters.sortBy}-${filters.sortDirection}`}
              onChange={(e) => {
                const [sortBy, sortDirection] = e.target.value.split('-');
                handleSortChange(sortBy, sortDirection as 'asc' | 'desc');
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="id-desc">Newest First</option>
              <option value="id-asc">Oldest First</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
            </select>
          </div>
        </div>

        {/* Course Grid */}
        {courses.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} hoverable className="h-full flex flex-col">
                  <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    {course.thumbnailUrl ? (
                      <img 
                        src={course.thumbnailUrl} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-primary bg-blue-100 rounded-full mb-2 w-fit">
                      {course.category}
                    </span>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {course.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 flex-1">
                      {course.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm text-gray-500">
                        By {course.instructor?.name || 'Unknown Instructor'}
                      </div>
                      {course.rating && (
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="text-sm text-gray-600 ml-1">
                            {course.rating} ({course.reviewCount || 0})
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-auto">
                      <Button className="w-full">
                        View Course
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {coursesPagination.totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex space-x-2">
                  <Button
                    variant="outline"
                    disabled={coursesPagination.page === 0}
                    onClick={() => handlePageChange(coursesPagination.page - 1)}
                  >
                    Previous
                  </Button>
                  
                  <span className="px-4 py-2 text-sm text-gray-700">
                    Page {coursesPagination.page + 1} of {coursesPagination.totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    disabled={coursesPagination.page >= coursesPagination.totalPages - 1}
                    onClick={() => handlePageChange(coursesPagination.page + 1)}
                  >
                    Next
                  </Button>
                </nav>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0121 12c0-4.418-3.582-8-8-8s-8 3.582-8 8c0 2.027.754 3.877 2 5.291" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No courses found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchKeyword || selectedCategory !== 'All' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by creating your first course.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
