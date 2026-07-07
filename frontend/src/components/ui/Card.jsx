import React from 'react';

export const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );
};
