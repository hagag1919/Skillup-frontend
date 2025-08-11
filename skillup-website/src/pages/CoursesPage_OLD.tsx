import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCourses, fetchCategories } from '../store/slices/coursesSlice';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Loading from '../components/ui/Loading';
import type { Course, CourseFilters } from '../types/index';

const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Simulate API call
    const fetchCourses = async () => {
      try {
        setLoading(true);
        // Mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockCourses: Course[] = [
          {
            id: 1,
            title: "Complete JavaScript Course",
            description: "Learn JavaScript from basics to advanced concepts with real-world projects.",
            category: "Programming",
            instructor: { name: "John Smith" },
            rating: 4.8,
            reviewCount: 1250,
          },
          {
            id: 2,
            title: "React Development Bootcamp",
            description: "Master React.js and build modern web applications with hands-on projects.",
            category: "Programming",
            instructor: { name: "Sarah Johnson" },
            rating: 4.9,
            reviewCount: 890,
          },
          {
            id: 3,
            title: "Data Science Fundamentals",
            description: "Introduction to data science, statistics, and machine learning concepts.",
            category: "Data Science",
            instructor: { name: "Dr. Michael Chen" },
            rating: 4.7,
            reviewCount: 560,
          },
        ];
        
        setCourses(mockCourses);
      } catch {
        setError('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading text="Loading courses..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>Try again</Button>
        </div>
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

        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
            <select className="form-input" aria-label="Filter by category">
              <option value="">All Categories</option>
              <option value="programming">Programming</option>
              <option value="data-science">Data Science</option>
              <option value="design">Design</option>
              <option value="business">Business</option>
            </select>
            <select className="form-input" aria-label="Sort courses">
              <option value="">Sort by</option>
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} hoverable className="h-full flex flex-col">
              <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
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
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    By {course.instructor?.name}
                  </div>
                  {course.rating && (
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm text-gray-600 ml-1">
                        {course.rating} ({course.reviewCount})
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="mt-4">
                  <Button className="w-full">
                    View Course
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-12 text-center">
          <Button variant="outline">
            Load More Courses
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
