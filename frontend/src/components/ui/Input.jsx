import React from 'react';

export const Input = ({ label, error, ...props }) => {
  return (
    <div className="mb-4">
      {label && <label className="form-label">{label}</label>}
      <input
        className={`input ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};
