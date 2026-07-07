import React from 'react';

export const Textarea = ({ label, error, ...props }) => {
  return (
    <div className="mb-4">
      {label && <label className="form-label">{label}</label>}
      <textarea
        className={`input resize-none ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
        rows="4"
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};
