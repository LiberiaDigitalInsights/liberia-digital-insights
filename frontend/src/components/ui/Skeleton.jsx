import React from 'react';
import { cn } from '../../lib/cn';

export default function Skeleton({ className, ...props }) {
  return (
    <div
      aria-hidden
      className={cn(
        'animate-pulse rounded-[var(--radius-md)] bg-[color-mix(in_oklab,var(--color-surface),white_8%)]',
        className,
      )}
      {...props}
    />
  );
}
