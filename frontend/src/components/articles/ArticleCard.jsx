import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/cn';

export default function ArticleCard({
  image,
  title,
  excerpt,
  category,
  author,
  date,
  readTime,
  to = '#',
  featured = false,
  className,
}) {
  return (
    <Link
      to={to}
      className={cn(
        'group block overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] transition-all duration-200 hover:shadow-md',
        featured && 'md:col-span-2',
        className,
      )}
    >
      {image && (
        <div className="relative h-48 overflow-hidden bg-[color-mix(in_oklab,var(--color-surface),white_6%)] md:h-56">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {category && (
            <div className="absolute top-3 left-3 rounded-full bg-brand-500 px-2.5 py-1 text-xs font-medium text-white">
              {category}
            </div>
          )}
        </div>
      )}
      <div className="p-4">
        <h3 className="mb-2 line-clamp-2 text-base font-semibold text-[var(--color-text)] group-hover:text-brand-500">
          {title}
        </h3>
        {excerpt && (
          <p className="mb-3 line-clamp-2 text-sm text-[var(--color-muted)]">{excerpt}</p>
        )}
        <div className="flex items-center gap-3 text-xs text-[var(--color-muted)]">
          {author && <span>{author}</span>}
          {date && <span>•</span>}
          {date && <span>{date}</span>}
          {readTime && <span>•</span>}
          {readTime && <span>{readTime} mins read</span>}
        </div>
      </div>
    </Link>
  );
}

