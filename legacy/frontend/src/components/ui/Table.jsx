import React from 'react';
import { cn } from '../../lib/cn';

export default function Table({ columns, data, className }) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)]',
        className,
      )}
    >
      <table className="min-w-full divide-y divide-[var(--color-border)]">
        <thead className="bg-[var(--color-surface)]">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)]">
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-[color-mix(in_oklab,var(--color-surface),white_4%)]">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-2 text-sm">
                  {col.cell ? col.cell(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
