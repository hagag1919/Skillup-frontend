import type { ReactNode } from 'react';
import { useAppSelector } from '../../store/hooks';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAppSelector(state => state.auth);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {children}
      </main>

      {/* Footer for authenticated users */}
      {isAuthenticated && (
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-500">
              <p>&copy; 2025 SkillUp. Continue your learning journey.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
