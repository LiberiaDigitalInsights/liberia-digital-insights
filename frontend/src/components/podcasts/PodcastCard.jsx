import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/cn';
import Badge from '../ui/Badge';

export default function PodcastCard({
  id,
  title,
  description,
  duration,
  date,
  guest,
  image,
  to,
  className,
}) {
  return (
    <Link
      to={to || `/podcast/${id}`}
      className={cn(
        'group block overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
        className,
      )}
    >
      {image && (
        <div className="relative h-48 overflow-hidden bg-[color-mix(in_oklab,var(--color-surface),white_6%)] md:h-56">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-3 left-3 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {duration}
          </div>
        </div>
      )}
      <div className="p-5">
        <h3 className="mb-3 line-clamp-2 text-base font-semibold text-[var(--color-text)] transition-colors duration-300 group-hover:text-brand-500">
          {title}
        </h3>
        {description && (
          <p className="mb-4 line-clamp-2 text-sm text-[var(--color-muted)] transition-colors duration-300 group-hover:text-[var(--color-text)]">
            {description}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--color-muted)] transition-colors duration-300 group-hover:text-[var(--color-text)]">
          {guest && <span>{guest}</span>}
          {date && <span>•</span>}
          {date && <span>{date}</span>}
        </div>
      </div>
    </Link>
  );
}
