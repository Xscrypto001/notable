// @/components/ui/button.js
import React from 'react';

const Button = ({ children, variant = 'primary', size = 'md', onClick }) => {
  const baseStyles = 'px-4 py-2 rounded focus:outline-none focus:ring';
  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600',
  };
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export { Button };
