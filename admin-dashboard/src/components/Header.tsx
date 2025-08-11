import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, X, Crown } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  const [showTrialBanner, setShowTrialBanner] = useState(true);

  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    const breadcrumbs = [{ name: 'Dashboard', href: '/dashboard' }];

    if (pathSegments.length > 1) {
      const currentPage = pathSegments[pathSegments.length - 1];
      const capitalizedPage = currentPage.charAt(0).toUpperCase() + currentPage.slice(1);
      breadcrumbs.push({ name: capitalizedPage, href: location.pathname });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="bg-white border-b border-gray-200">
      {/* Trial Banner */}
      {showTrialBanner && (
        <div className="bg-purple-50 border-b border-purple-100 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Crown className="h-5 w-5 text-purple-500" />
              <p className="text-sm text-purple-700">
                You have 30 days left on your free trial of the Personal plan.
              </p>
              <button className="text-sm font-medium text-purple-600 hover:text-purple-500 underline">
                Upgrade Now
              </button>
            </div>
            <button
              onClick={() => setShowTrialBanner(false)}
              className="text-purple-400 hover:text-purple-500"
              aria-label="Dismiss trial banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Breadcrumbs */}
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              {breadcrumbs.map((breadcrumb, index) => (
                <li key={breadcrumb.href} className="flex items-center">
                  {index > 0 && (
                    <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
                  )}
                  <Link
                    to={breadcrumb.href}
                    className={`text-sm font-medium ${
                      index === breadcrumbs.length - 1
                        ? 'text-gray-900'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {breadcrumb.name}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button className="btn btn-secondary">
              Done
            </button>
            <button className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
