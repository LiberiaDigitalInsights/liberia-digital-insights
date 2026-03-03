import React from 'react';
import { cn } from '../../lib/cn';

export default function Skeleton({ className, ...props }) {
  return (
    <div
      aria-hidden
      className={cn(
        'relative overflow-hidden rounded-md bg-surface border border-border shadow-sm',
        'after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_2s_infinite] after:bg-linear-to-r after:from-transparent after:via-white/10 after:to-transparent',
        className,
      )}
      {...props}
    />
  );
}
