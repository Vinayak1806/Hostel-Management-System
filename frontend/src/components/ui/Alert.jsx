import React from 'react';

export const Alert = ({ type = 'info', message, onClose = null }) => {
  const colors = {
    info: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200',
    success: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200',
    error: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-200'
  };

  return (
    <div className={`fixed top-4 right-4 z-[100] min-w-[320px] max-w-md p-4 rounded-xl border shadow-2xl animate-in slide-in-from-top-5 fade-in duration-300 ${colors[type]} flex justify-between items-start gap-4`}>
      <p className="font-medium mt-0.5">{message}</p>
      {onClose && (
        <button onClick={onClose} className="text-xl font-bold cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
          ×
        </button>
      )}
    </div>
  );
};
