// @/components/ui/tooltip.js
import React from 'react';

const Tooltip = ({ content, children }) => (
  <div className="relative group">
    {children}
    <div className="absolute bottom-full mb-2 hidden w-max p-2 text-sm text-white bg-black rounded opacity-0 group-hover:block group-hover:opacity-100">
      {content}
    </div>
  </div>
);

export { Tooltip };
