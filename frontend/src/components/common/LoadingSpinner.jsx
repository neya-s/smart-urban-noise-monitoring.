import React from 'react';

export default function LoadingSpinner({ message = 'Loading details...', size = 'md' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-7 h-7 border-3',
    lg: 'w-10 h-10 border-4',
  }[size] || 'w-7 h-7 border-3';

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
      <div
        className={`${sizeClasses} border-teal-600 border-t-transparent rounded-full animate-spin`}
        role="status"
        aria-label="loading"
      />
      {message && <p className="text-sm font-medium text-slate-500">{message}</p>}
    </div>
  );
}
