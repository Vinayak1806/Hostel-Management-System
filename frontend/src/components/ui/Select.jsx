import React from 'react';

export const Select = ({ label, options, error, ...props }) => {
  return (
    <div className="mb-4">
      {label && <label className="form-label">{label}</label>}
      <select
        className={`input ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
        {...props}
      >
        <option value="">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};
