import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginUser } from '../../store/slices/authSlice';
import Button from '../ui/Button.js';
import Input from '../ui/Input.js';
import Card from '../ui/Card.js';

const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector(state => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (field: string) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Attempting login with:', { email: formData.email, password: '***' });

    try {
      const result = await dispatch(loginUser(formData)).unwrap();
      console.log('Login successful:', result);
      // Redirect to home page on successful login
      navigate('/');
    } catch (error: unknown) {
      // Enhanced error logging for debugging
      console.error('Login failed:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
      } else {
        console.error('Unknown error type:', error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="bg-primary text-white p-4 rounded-xl shadow-lg">
              <svg className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
              </svg>
            </div>
          </div>
          <h2 className="mt-8 text-center text-4xl font-bold text-gray-900">
            Welcome back to SkillUp
          </h2>
          <p className="mt-4 text-center text-lg text-gray-600">
            Sign in to continue your learning journey
          </p>
          <p className="mt-2 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-primary hover:text-blue-600 transition-colors"
            >
              Create one now
            </Link>
          </p>
        </div>
        
        <Card className="mt-10 p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <form className="space-y-8" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-6 py-4 rounded-r-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-6">
              <Input
                label="Email address"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange('email')}
                required
                className="text-lg"
              />
              
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange('password')}
                required
                className="text-lg"
              />
            </div>

            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded transition-colors"
                />
                <label htmlFor="remember-me" className="ml-3 block text-base text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-base">
                <Link
                  to="/forgot-password"
                  className="font-semibold text-primary hover:text-blue-600 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg transform hover:scale-[1.02] transition-all duration-200"
            >
              {loading ? 'Signing in...' : 'Sign in to SkillUp'}
            </Button>

            <div className="text-center">
              <p className="text-gray-600">
                By signing in, you agree to our{' '}
                <Link to="/terms" className="text-primary hover:text-blue-600 font-medium">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary hover:text-blue-600 font-medium">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
