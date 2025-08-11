import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  Users,
  BookOpen,
  Settings,
  TrendingUp,
  Mail,
  Grid3X3,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuthContext';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Users', href: '/dashboard/users', icon: Users },
  { name: 'Courses', href: '/dashboard/courses', icon: BookOpen },
  { name: 'Analytics', href: '/dashboard/analytics', icon: TrendingUp },
  { name: 'Messages', href: '/dashboard/messages', icon: Mail },
  { name: 'Apps', href: '/dashboard/apps', icon: Grid3X3 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActivePath = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex flex-col w-64 bg-gray-900/95 backdrop-blur-md border-r border-gray-700/50 h-screen">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 px-4 bg-gray-800/95 backdrop-blur-sm border-b border-gray-700/50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <span className="text-white font-bold text-xl">SkillUp</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Main Navigation
          </h3>
          {navigation.map((item) => {
            const isActive = isActivePath(item.href);
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  isActive 
                    ? 'bg-purple-600/20 text-white backdrop-blur-sm border border-purple-500/30' 
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            );
          })}
        </div>

        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Products
            <span className="ml-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
              1
            </span>
          </h3>
          <NavLink
            to="/dashboard/courses"
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              isActivePath('/dashboard/courses') 
                ? 'bg-purple-600/20 text-white backdrop-blur-sm border border-purple-500/30' 
                : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
            }`}
          >
            <BookOpen className="mr-3 h-5 w-5" />
            Courses
          </NavLink>
        </div>
      </nav>

      {/* User Profile */}
      <div className="px-4 py-4 border-t border-gray-700/50">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {user?.name?.charAt(0) || 'A'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.name || 'Admin User'}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {user?.role || 'Admin'}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 text-gray-300 hover:bg-red-600/20 hover:text-red-400 border border-transparent hover:border-red-500/30"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
