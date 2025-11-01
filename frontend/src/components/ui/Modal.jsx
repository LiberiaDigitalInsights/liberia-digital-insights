import React from 'react';
import { cn } from '../../lib/cn';
import Button from './Button';

export default function Modal({ open, onClose, title, children, footer, className }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className={cn(
          'relative z-10 w-full max-w-lg rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-xl',
          className,
        )}
      >
        <div className="mb-3 flex items-center justify-between">
          {title && <h3 className="text-base font-semibold">{title}</h3>}
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close">
            ✕
          </Button>
        </div>
        <div className="text-sm text-[var(--color-text)]">{children}</div>
        {footer && <div className="mt-4 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}
