import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ className }) {
  return (
    <Link to="/" aria-label="Liberia Digital Insights home" className={className}>
      <div className="flex items-center gap-2">
        <img src="/LDI_favicon.png" alt="LDI" className="h-15 w-15 rounded-sm" />
        <span className="text-sm font-semibold tracking-tight text-white">
          Liberia Digital Insights
        </span>
      </div>
    </Link>
  );
}
