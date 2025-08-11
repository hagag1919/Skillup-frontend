import { Link } from 'react-router-dom';
import { useAppSelector } from '../store/hooks.js';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAppSelector(state => state.auth);

  if (isAuthenticated) {
    // Authenticated user view
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Welcome Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold sm:text-5xl">
                Welcome back, {user?.name || 'Student'}!
              </h1>
              <p className="mt-4 text-xl text-blue-100">
                Continue your learning journey and achieve your goals
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/dashboard">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Go to Dashboard
                  </Button>
                </Link>
                <Link to="/courses">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-white border-white hover:bg-white hover:text-blue-600">
                    Browse Courses
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <Link to="/courses" className="block">
                  <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900">My Courses</h3>
                  <p className="text-sm text-gray-600 mt-1">Continue learning</p>
                </Link>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <Link to="/profile" className="block">
                  <div className="h-12 w-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900">Profile</h3>
                  <p className="text-sm text-gray-600 mt-1">View and edit</p>
                </Link>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="h-12 w-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Progress</h3>
                <p className="text-sm text-gray-600 mt-1">Track learning</p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="h-12 w-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Certificates</h3>
                <p className="text-sm text-gray-600 mt-1">View earned</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Continue Learning */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Continue Learning</h2>
              <Link to="/courses" className="text-blue-600 hover:text-blue-700 font-medium">
                View all courses →
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">React Fundamentals</h3>
                  <p className="text-sm text-gray-600 mb-4">Learn the basics of React development</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full w-3/4"></div>
                      </div>
                      <span className="text-sm text-gray-600">75%</span>
                    </div>
                    <Button size="sm">Continue</Button>
                  </div>
                </div>
              </Card>

              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-r from-green-500 to-green-600"></div>
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">JavaScript Essentials</h3>
                  <p className="text-sm text-gray-600 mb-4">Master JavaScript fundamentals</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full w-full"></div>
                      </div>
                      <span className="text-sm text-gray-600">100%</span>
                    </div>
                    <Button size="sm" variant="outline">Review</Button>
                  </div>
                </div>
              </Card>

              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-r from-purple-500 to-purple-600"></div>
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">TypeScript Mastery</h3>
                  <p className="text-sm text-gray-600 mb-4">Advanced TypeScript concepts</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full w-1/3"></div>
                      </div>
                      <span className="text-sm text-gray-600">30%</span>
                    </div>
                    <Button size="sm">Continue</Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Guest user view (original content)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Learn skills that matter
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Join thousands of students and instructors in our online learning platform. 
              Master new skills, advance your career, and achieve your goals.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get started for free
                  </Button>
                </Link>
                <Link to="/courses">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Browse courses
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Why choose SkillUp?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Everything you need to succeed in your learning journey
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="text-center">
              <div className="mx-auto h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Expert Instructors</h3>
              <p className="mt-2 text-sm text-gray-600">
                Learn from industry experts and experienced professionals who know what it takes to succeed.
              </p>
            </Card>

            <Card className="text-center">
              <div className="mx-auto h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Certificates</h3>
              <p className="mt-2 text-sm text-gray-600">
                Earn certificates upon completion to showcase your skills and advance your career.
              </p>
            </Card>

            <Card className="text-center">
              <div className="mx-auto h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Self-Paced Learning</h3>
              <p className="mt-2 text-sm text-gray-600">
                Learn at your own pace with lifetime access to course materials and video content.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to start learning?</span>
            <span className="block text-blue-200">Join thousands of students today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link to="/register">
                <Button variant="secondary" size="lg">
                  Get started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
