import React from 'react';

const LoadingSpinner = ({ text = 'Loading details...', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} rounded-full border-brand-200 border-t-brand-600 animate-spin`}
      />
      {text && <p className="mt-3 text-sm font-medium text-slate-500 animate-pulse">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
