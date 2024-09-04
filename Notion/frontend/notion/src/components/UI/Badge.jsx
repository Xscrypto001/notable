// @/components/ui/badge.js
import React from 'react';

const Badge = ({ children, color = 'gray' }) => {
  const colors = {
    gray: 'bg-gray-200 text-gray-800',
    red: 'bg-red-200 text-red-800',
    green: 'bg-green-200 text-green-800',
    blue: 'bg-blue-200 text-blue-800',
  };

  return (
    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${colors[color]}`}>
      {children}
    </span>
  );
};

export { Badge };
