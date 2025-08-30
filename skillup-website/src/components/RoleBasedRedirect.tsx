import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import Loading from './ui/Loading';

const RoleBasedRedirect: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      // Redirect based on user role
      switch (user?.role) {
        case 'STUDENT':
          navigate('/student/dashboard');
          break;
        case 'INSTRUCTOR':
          navigate('/instructor/dashboard');
          break;
        case 'ADMIN':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/');
      }
    }
  }, [isAuthenticated, user, loading, navigate]);

  if (loading) {
    return <Loading />;
  }

  return <Loading />;
};

export default RoleBasedRedirect;
