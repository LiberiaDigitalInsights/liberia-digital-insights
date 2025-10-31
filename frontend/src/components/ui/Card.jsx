import React from 'react';
import { cn } from '../../lib/cn';

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4',
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return <div className={cn('mb-3 flex items-center justify-between', className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return <h3 className={cn('text-base font-semibold', className)} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={cn('text-sm text-[var(--color-muted)]', className)} {...props} />;
}
