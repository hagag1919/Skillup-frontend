import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Loading from '../components/ui/Loading';

interface EnrolledCourse {
  id: number;
  title: string;
  category: string;
  thumbnailUrl?: string;
  instructor: {
    name: string;
  };
  progress: number;
  enrolledAt: string;
  lastAccessed?: string;
}

interface DashboardStats {
  enrolledCourses: number;
  completedCourses: number;
  totalLearningHours: number;
  certificatesEarned: number;
}

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  
  const [stats, setStats] = useState<DashboardStats>({
    enrolledCourses: 0,
    completedCourses: 0,
    totalLearningHours: 0,
    certificatesEarned: 0
  });
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.role !== 'STUDENT') {
      // Redirect based on user role
      switch (user?.role) {
        case 'INSTRUCTOR':
          navigate('/instructor/dashboard');
          break;
        case 'ADMIN':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/');
      }
      return;
    }

    fetchDashboardData();
  }, [isAuthenticated, user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // TODO: Implement API calls
      // const [dashboardStats, userEnrollments] = await Promise.all([
      //   getDashboardStats(),
      //   getUserEnrollments()
      // ]);
      
      // Mock data for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        enrolledCourses: 5,
        completedCourses: 2,
        totalLearningHours: 32.5,
        certificatesEarned: 2
      });

      setEnrolledCourses([
        {
          id: 1,
          title: "Complete JavaScript Course",
          category: "Programming",
          instructor: { name: "John Smith" },
          progress: 75,
          enrolledAt: "2024-01-15",
          lastAccessed: "2024-01-20"
        },
        {
          id: 2,
          title: "React Development Bootcamp", 
          category: "Programming",
          instructor: { name: "Sarah Johnson" },
          progress: 45,
          enrolledAt: "2024-01-10",
          lastAccessed: "2024-01-18"
        },
        {
          id: 3,
          title: "Data Science Fundamentals",
          category: "Data Science", 
          instructor: { name: "Dr. Michael Chen" },
          progress: 100,
          enrolledAt: "2023-12-20",
          lastAccessed: "2024-01-05"
        }
      ]);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading text="Loading your dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={fetchDashboardData}>Try again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || 'Student'}!
          </h1>
          <p className="mt-2 text-gray-600">
            Continue your learning journey
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {stats.enrolledCourses}
            </div>
            <div className="text-gray-600">Enrolled Courses</div>
          </Card>
          
          <Card className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {stats.completedCourses}
            </div>
            <div className="text-gray-600">Completed Courses</div>
          </Card>
          
          <Card className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {stats.totalLearningHours}h
            </div>
            <div className="text-gray-600">Learning Hours</div>
          </Card>
          
          <Card className="text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {stats.certificatesEarned}
            </div>
            <div className="text-gray-600">Certificates</div>
          </Card>
        </div>

        {/* Current Courses */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Courses</h2>
            <Button 
              variant="outline" 
              onClick={() => navigate('/courses')}
            >
              Browse More Courses
            </Button>
          </div>
          
          {enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <Card key={course.id} hoverable className="flex flex-col">
                  <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                    {course.thumbnailUrl ? (
                      <img 
                        src={course.thumbnailUrl} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-primary bg-blue-100 rounded-full mb-2 w-fit">
                      {course.category}
                    </span>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {course.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-4">
                      Instructor: {course.instructor.name}
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="mt-auto space-y-2">
                      <Button 
                        className="w-full"
                        onClick={() => navigate(`/courses/${course.id}/learn`)}
                      >
                        {course.progress === 100 ? 'Review Course' : 'Continue Learning'}
                      </Button>
                      
                      {course.progress === 100 && (
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => navigate(`/courses/${course.id}/certificate`)}
                        >
                          View Certificate
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
              <p className="text-gray-600 mb-4">Start your learning journey by enrolling in a course</p>
              <Button onClick={() => navigate('/courses')}>
                Browse Courses
              </Button>
            </Card>
          )}
        </div>

        {/* Recent Activity */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {enrolledCourses.filter(course => course.lastAccessed).map((course) => (
              <div key={`activity-${course.id}`} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    Continued learning <span className="font-medium">{course.title}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    {course.lastAccessed && new Date(course.lastAccessed).toLocaleDateString()}
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => navigate(`/courses/${course.id}/learn`)}
                >
                  Continue
                </Button>
              </div>
            ))}
            
            {!enrolledCourses.some(course => course.lastAccessed) && (
              <p className="text-gray-600 text-center py-8">
                No recent activity. Start learning to see your progress here!
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
