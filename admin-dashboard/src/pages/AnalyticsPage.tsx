import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Users, BookOpen, TrendingUp, UserCheck, Award } from 'lucide-react';
import type { UserAnalytics, CourseAnalytics, EnrollmentAnalytics } from '../types';
import { apiService } from '../services/apiService';
import { LoadingSpinner } from '../components/Loading';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  change?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, change }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
          {change && (
            <p className="text-sm text-green-600 flex items-center mt-1">
              <TrendingUp className="w-4 h-4 mr-1" />
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

const COLORS = ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'];

const AnalyticsPage: React.FC = () => {
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics | null>(null);
  const [courseAnalytics, setCourseAnalytics] = useState<CourseAnalytics | null>(null);
  const [enrollmentAnalytics, setEnrollmentAnalytics] = useState<EnrollmentAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [users, courses, enrollments] = await Promise.all([
          apiService.getUserAnalytics(),
          apiService.getCourseAnalytics(),
          apiService.getEnrollmentAnalytics(),
        ]);
        
        setUserAnalytics(users);
        setCourseAnalytics(courses);
        setEnrollmentAnalytics(enrollments);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
        
        // Set mock data for demo purposes
        setUserAnalytics({
          totalUsers: 1250,
          usersByRole: [
            { role: 'STUDENT', count: 1205 },
            { role: 'INSTRUCTOR', count: 45 },
            { role: 'ADMIN', count: 5 },
          ],
          recentRegistrations: [
            { date: '2024-01-01', count: 20 },
            { date: '2024-01-02', count: 15 },
            { date: '2024-01-03', count: 25 },
            { date: '2024-01-04', count: 30 },
            { date: '2024-01-05', count: 18 },
          ],
          userGrowthData: [
            { month: 'Jan', count: 400 },
            { month: 'Feb', count: 500 },
            { month: 'Mar', count: 650 },
            { month: 'Apr', count: 800 },
            { month: 'May', count: 1000 },
            { month: 'Jun', count: 1250 },
          ],
        });
        
        setCourseAnalytics({
          totalCourses: 89,
          coursesByCategory: [
            { category: 'Programming', count: 35 },
            { category: 'Data Science', count: 20 },
            { category: 'Web Development', count: 15 },
            { category: 'Mobile Development', count: 12 },
            { category: 'DevOps', count: 7 },
          ],
          featuredCourses: 12,
          activeCourses: 85,
          courseCreationData: [
            { month: 'Jan', count: 10 },
            { month: 'Feb', count: 15 },
            { month: 'Mar', count: 20 },
            { month: 'Apr', count: 18 },
            { month: 'May', count: 14 },
            { month: 'Jun', count: 12 },
          ],
        });
        
        setEnrollmentAnalytics({
          totalEnrollments: 3420,
          enrollmentsByMonth: [
            { month: 'Jan', count: 400 },
            { month: 'Feb', count: 520 },
            { month: 'Mar', count: 680 },
            { month: 'Apr', count: 750 },
            { month: 'May', count: 580 },
            { month: 'Jun', count: 490 },
          ],
          topCourses: [
            { courseTitle: 'Complete JavaScript Course', enrollments: 245 },
            { courseTitle: 'React Fundamentals', enrollments: 198 },
            { courseTitle: 'Python for Beginners', enrollments: 178 },
            { courseTitle: 'Node.js Backend Development', enrollments: 156 },
            { courseTitle: 'Data Science with Python', enrollments: 134 },
          ],
          enrollmentGrowth: [
            { date: '2024-01-01', count: 20 },
            { date: '2024-01-02', count: 25 },
            { date: '2024-01-03', count: 18 },
            { date: '2024-01-04', count: 32 },
            { date: '2024-01-05', count: 28 },
            { date: '2024-01-06', count: 35 },
            { date: '2024-01-07', count: 22 },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && !userAnalytics) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-2">
          Comprehensive insights into your platform's performance and growth.
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={userAnalytics?.totalUsers || 0}
          icon={Users}
          color="bg-blue-500"
          change="+12% from last month"
        />
        <StatCard
          title="Total Courses"
          value={courseAnalytics?.totalCourses || 0}
          icon={BookOpen}
          color="bg-green-500"
          change="+8% from last month"
        />
        <StatCard
          title="Total Enrollments"
          value={enrollmentAnalytics?.totalEnrollments || 0}
          icon={UserCheck}
          color="bg-purple-500"
          change="+15% from last month"
        />
        <StatCard
          title="Active Courses"
          value={courseAnalytics?.activeCourses || 0}
          icon={Award}
          color="bg-yellow-500"
          change="+5% from last month"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userAnalytics?.userGrowthData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#8B5CF6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Users by Role Pie Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Users by Role</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={Array.isArray(userAnalytics?.usersByRole) ? userAnalytics.usersByRole : []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ role, count, percent }) => `${role}: ${count} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {Array.isArray(userAnalytics?.usersByRole) ? userAnalytics.usersByRole.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                )) : []}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Creation Trends */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Creation Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={courseAnalytics?.courseCreationData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Enrollment Trends */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Enrollments</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={enrollmentAnalytics?.enrollmentsByMonth || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Courses by Category */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Courses by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={courseAnalytics?.coursesByCategory || []} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="category" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="count" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Courses by Enrollment */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Courses by Enrollment</h3>
          <div className="space-y-4">
            {Array.isArray(enrollmentAnalytics?.topCourses) ? enrollmentAnalytics.topCourses.map((course, index) => (
              <div key={course.courseTitle} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold text-sm mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate" title={course.courseTitle || 'Untitled Course'}>
                      {course.courseTitle && course.courseTitle.length > 30 ? course.courseTitle.substring(0, 30) + '...' : course.courseTitle || 'Untitled Course'}
                    </p>
                  </div>
                </div>
                <div className="text-sm font-semibold text-gray-600">
                  {course.enrollments} enrollments
                </div>
              </div>
            )) : []}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Registration Activity</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={userAnalytics?.recentRegistrations || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsPage;
