import React from 'react';
import { Button } from './Button';

export const Modal = ({ isOpen, title, children, onClose, footer = null, showCloseButton = true }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-6 max-w-md w-full mx-4 z-50">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{title}</h2>
        <div className="mb-6">{children}</div>
        {(footer || showCloseButton) && (
          <div className="flex justify-end space-x-3">
            {footer}
            {showCloseButton && (
              <Button variant="secondary" onClick={onClose}>
                Close
              </Button>
            )}
          </div>
        )}
      </div>
    </>
  );
};
