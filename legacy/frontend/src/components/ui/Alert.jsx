import React from 'react';
import { cn } from '../../lib/cn';

const variants = {
  info: 'border-sky-500/40 bg-sky-500/10 text-[var(--color-text)]',
  success: 'border-emerald-500/40 bg-emerald-500/10 text-[var(--color-text)]',
  warning: 'border-amber-500/40 bg-amber-500/10 text-[var(--color-text)]',
  danger: 'border-red-500/40 bg-red-500/10 text-[var(--color-text)]',
};

export default function Alert({ className, title, children, variant = 'info', ...props }) {
  return (
    <div
      role="status"
      className={cn('w-full rounded-[var(--radius-md)] border p-4', variants[variant], className)}
      {...props}
    >
      {title && <div className="mb-1 font-semibold">{title}</div>}
      {children && <div className="text-sm text-[var(--color-muted)]">{children}</div>}
    </div>
  );
}
