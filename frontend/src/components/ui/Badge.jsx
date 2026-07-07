import React from 'react';
import { getStatusColor } from '../../utils/helpers';

export const Badge = ({ status, label = null }) => {
  const colorClass = getStatusColor(status);
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${colorClass}`}>
      {label || status}
    </span>
  );
};
