import React from 'react';
import { cn } from '../../lib/cn';

export function Tabs({ tabs, value, onChange, className }) {
  return (
    <div className={cn('w-full', className)}>
      <div className="flex gap-2 border-b border-[var(--color-border)]">
        {tabs.map((t) => {
          const active = t.value === value;
          return (
            <button
              key={t.value}
              className={cn(
                'px-3 py-2 text-sm',
                active
                  ? 'border-b-2 border-brand-500 text-[var(--color-text)]'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-text)]',
              )}
              onClick={() => onChange?.(t.value)}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <div className="pt-4">
        {tabs.map((t) => (
          <div key={t.value} hidden={t.value !== value}>
            {t.content}
          </div>
        ))}
      </div>
    </div>
  );
}
