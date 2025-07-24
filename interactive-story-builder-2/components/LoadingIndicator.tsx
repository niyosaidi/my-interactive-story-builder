
import React from 'react';

export const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex space-x-1.5">
      <div className="w-2.5 h-2.5 bg-sky-500 rounded-full animate-pulse"></div>
      <div className="w-2.5 h-2.5 bg-sky-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-2.5 h-2.5 bg-sky-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
    </div>
  );
};
