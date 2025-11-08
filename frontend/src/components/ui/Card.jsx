import React from 'react';
import { cn } from '../../lib/cn';

const elevations = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
};

const paddings = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export function Card({
  as: Comp = 'div',
  elevation = 'none',
  padding = 'md',
  className,
  ...props
}) {
  return (
    <Comp
      className={cn(
        'rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]',
        paddings[padding],
        elevations[elevation],
        className,
      )}
      {...props}
    />
  );
}

export default Card;

export function CardHeader({ className, ...props }) {
  return <div className={cn('mb-3 flex items-center justify-between', className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return <h3 className={cn('text-base font-semibold', className)} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={cn('text-sm text-[var(--color-muted)]', className)} {...props} />;
}
