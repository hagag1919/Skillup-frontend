import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div
      className={`border-2 border-gray-200 border-t-purple-500 rounded-full animate-spin ${sizeClasses[size]} ${className}`}
    />
  );
};

interface LoadingPageProps {
  message?: string;
}

export const LoadingPage: React.FC<LoadingPageProps> = ({ 
  message = 'Loading...' 
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-gray-600 text-lg">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
