// @/components/ui/textarea.js
import React from 'react';

const Textarea = ({ placeholder, value, onChange, className }) => (
  <textarea
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`border p-2 rounded ${className}`}
  />
);

export { Textarea };
