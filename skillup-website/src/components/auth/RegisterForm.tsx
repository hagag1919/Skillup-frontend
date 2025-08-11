import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { registerUser } from '../../store/slices/authSlice';
import Button from '../ui/Button.js';
import Input from '../ui/Input.js';
import Card from '../ui/Card.js';

const RegisterForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector(state => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT' as 'STUDENT' | 'INSTRUCTOR',
    bio: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Prepare data for registration (exclude confirmPassword)
      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        bio: formData.bio
      };

      await dispatch(registerUser(registrationData)).unwrap();
      // Redirect to login page on successful registration
      navigate('/login');
    } catch (error) {
      // Error is handled by the Redux slice
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="bg-primary text-white p-3 rounded-default">
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
              </svg>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-primary hover:text-blue-600"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <Card className="mt-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange('name')}
              error={errors.name}
              required
            />
            
            <Input
              label="Email address"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange('email')}
              error={errors.email}
              required
            />
            
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange('password')}
              error={errors.password}
              required
            />
            
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              error={errors.confirmPassword}
              required
            />

            <div>
              <label htmlFor="role-select" className="block text-sm font-medium text-gray-700 mb-1">
                I want to join as
              </label>
              <select
                id="role-select"
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'STUDENT' | 'INSTRUCTOR' }))}
                className="form-input"
              >
                <option value="STUDENT">Student</option>
                <option value="INSTRUCTOR">Instructor</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio (optional)
              </label>
              <textarea
                placeholder="Tell us about yourself"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-default focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full"
            >
              Create account
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RegisterForm;
