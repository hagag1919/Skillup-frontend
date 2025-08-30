import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks.js';
import { logout } from '../../store/slices/authSlice.js';
import Button from '../ui/Button.js';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="bg-white bg-opacity-80 shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-blue-600 bg-opacity-80 text-white p-2 rounded-lg">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">SkillUp</span>
            </Link>

            {/* Navigation links for authenticated users */}
            {isAuthenticated && (
              <nav className="hidden md:flex space-x-6">
                {user?.role === 'STUDENT' && (
                  <>
                    <Link 
                      to="/student/dashboard" 
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/courses" 
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                    >
                      My Courses
                    </Link>
                    <Link 
                      to="/browse" 
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                    >
                      Browse
                    </Link>
                  </>
                )}
                {user?.role === 'INSTRUCTOR' && (
                  <>
                    <Link 
                      to="/instructor/dashboard" 
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/instructor/courses" 
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                    >
                      My Courses
                    </Link>
                    <Link 
                      to="/instructor/analytics" 
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                    >
                      Analytics
                    </Link>
                    <Link 
                      to="/browse" 
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                    >
                      Browse
                    </Link>
                  </>
                )}
                {user?.role === 'ADMIN' && (
                  <>
                    <Link 
                      to="/admin/dashboard" 
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/admin/users" 
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                    >
                      Users
                    </Link>
                    <Link 
                      to="/admin/courses" 
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                    >
                      Courses
                    </Link>
                    <Link 
                      to="/admin/analytics" 
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                    >
                      Analytics
                    </Link>
                  </>
                )}
              </nav>
            )}
          </div>

          {/* Right side - User menu or Login/Register */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <button 
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 hover:bg-gray-100 rounded-lg transition-all duration-200 relative border border-gray-300 border-opacity-50"
                  title="Notifications"
                  aria-label="View notifications"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>

                {/* User dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 hover:bg-gray-100 transition-all duration-200 border border-gray-300 border-opacity-50"
                  >
                    <div className="h-8 w-8 bg-blue-600 bg-opacity-80 text-white rounded-full flex items-center justify-center text-sm font-medium border border-blue-400 border-opacity-50">
                      {user?.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700">
                      {user?.name || 'User'}
                    </span>
                    <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white bg-opacity-90 rounded-lg shadow-lg py-2 z-50 border border-gray-200 border-opacity-50">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:bg-opacity-70 transition-all duration-200"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        View Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:bg-opacity-70 transition-all duration-200"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Settings
                      </Link>
                      <Link
                        to="/help"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:bg-opacity-70 transition-all duration-200"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Help & Support
                      </Link>
                      <hr className="my-2 border-gray-200 border-opacity-50" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:bg-opacity-70 transition-all duration-200"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    Get started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
