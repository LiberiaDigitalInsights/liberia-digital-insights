import React from 'react';
import { cn } from '../../lib/cn';

const variants = {
  solid: 'bg-brand-500 text-white',
  subtle: 'bg-[color-mix(in_oklab,var(--color-surface),white_8%)] text-[var(--color-text)]',
  outline: 'border border-[var(--color-border)] text-[var(--color-text)]',
  success: 'bg-emerald-600 text-white',
  warning: 'bg-amber-500 text-black',
  danger: 'bg-red-600 text-white',
};

export default function Badge({ className, variant = 'subtle', children, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
