import React, { useState, useEffect } from 'react';
import { Users, BookOpen, UserCheck, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { DashboardStats } from '../types';
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

// Mock chart data
const chartData = [
  { name: 'Jan', users: 400, courses: 240 },
  { name: 'Feb', users: 300, courses: 139 },
  { name: 'Mar', users: 200, courses: 980 },
  { name: 'Apr', users: 278, courses: 390 },
  { name: 'May', users: 189, courses: 480 },
  { name: 'Jun', users: 239, courses: 380 },
];

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  const fetchStats = async (isRetry = false) => {
    try {
      if (isRetry) {
        setLoading(true);
        setError('');
      }
      
      const data = await apiService.getDashboardStats();
      setStats(data);
      setError(''); // Clear error on successful fetch
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      console.error('Dashboard stats fetch error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch statistics';
      setError(`Server unavailable (Error 500). ${errorMessage}`);
      
      // Set a basic fallback if no data received
      setStats({
        totalUsers: 0,
        totalInstructors: 0,
        totalStudents: 0,
        totalCourses: 0,
        totalEnrollments: 0,
        recentUsers: [],
        recentCourses: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchStats(true);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && !stats) {
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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's what's happening with your platform.
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md">
          <div className="flex justify-between items-center">
            <p className="text-sm">
              <strong>Connection Issue:</strong> {error} Showing demo data.
            </p>
            <button
              onClick={handleRetry}
              disabled={loading}
              className="ml-4 px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Retrying...' : `Retry ${retryCount > 0 ? `(${retryCount})` : ''}`}
            </button>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={Users}
          color="bg-blue-500"
          change="+12% from last month"
        />
        <StatCard
          title="Total Courses"
          value={stats?.totalCourses || 0}
          icon={BookOpen}
          color="bg-green-500"
          change="+8% from last month"
        />
        <StatCard
          title="Instructors"
          value={stats?.totalInstructors || 0}
          icon={UserCheck}
          color="bg-purple-500"
          change="+5% from last month"
        />
        <StatCard
          title="Students"
          value={stats?.totalStudents || 0}
          icon={Users}
          color="bg-orange-500"
          change="+15% from last month"
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" fill="#7c3aed" name="Users" />
              <Bar dataKey="courses" fill="#10b981" name="Courses" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">New user registered</p>
                <p className="text-xs text-gray-500">John Doe joined as a student</p>
              </div>
              <span className="text-xs text-gray-400">2 hours ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">New course published</p>
                <p className="text-xs text-gray-500">"React Fundamentals" by Jane Smith</p>
              </div>
              <span className="text-xs text-gray-400">4 hours ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <UserCheck className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Course enrollment</p>
                <p className="text-xs text-gray-500">25 new enrollments today</p>
              </div>
              <span className="text-xs text-gray-400">6 hours ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Users className="w-8 h-8 text-blue-500 mb-2" />
            <h4 className="font-medium text-gray-900">Manage Users</h4>
            <p className="text-sm text-gray-600">Add, edit, or remove users</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <BookOpen className="w-8 h-8 text-green-500 mb-2" />
            <h4 className="font-medium text-gray-900">Create Course</h4>
            <p className="text-sm text-gray-600">Add a new course to the platform</p>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <TrendingUp className="w-8 h-8 text-purple-500 mb-2" />
            <h4 className="font-medium text-gray-900">View Analytics</h4>
            <p className="text-sm text-gray-600">Check detailed performance metrics</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
