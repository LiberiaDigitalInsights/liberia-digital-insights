import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/cn';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { formatEventDateRange } from '../../data/mockEvents';

export default function EventCard({
  title,
  description,
  date,
  endDate,
  location,
  image,
  category,
  registrationUrl,
  isPast,
  className,
}) {
  const formattedDate = formatEventDateRange(date, endDate);

  return (
    <div
      className={cn(
        'group overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
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
          {category && (
            <div className="absolute top-3 left-3 rounded-full bg-brand-500 px-2.5 py-1 text-xs font-medium text-white shadow-lg">
              {category}
            </div>
          )}
          {!isPast && (
            <div className="absolute top-3 right-3 rounded-full bg-green-500 px-2.5 py-1 text-xs font-medium text-white shadow-lg">
              Upcoming
            </div>
          )}
          {isPast && (
            <div className="absolute top-3 right-3 rounded-full bg-gray-500 px-2.5 py-1 text-xs font-medium text-white shadow-lg">
              Past
            </div>
          )}
        </div>
      )}
      <div className="p-5">
        <h3 className="mb-3 line-clamp-2 text-lg font-semibold text-[var(--color-text)] transition-colors duration-300 group-hover:text-brand-500">
          {title}
        </h3>
        {description && (
          <p className="mb-4 line-clamp-2 text-sm text-[var(--color-muted)] transition-colors duration-300 group-hover:text-[var(--color-text)]">
            {description}
          </p>
        )}
        <div className="mb-4 space-y-2 text-xs text-[var(--color-muted)]">
          <div className="flex items-center gap-2">
            <span>📅</span>
            <span>{formattedDate}</span>
          </div>
          {location && (
            <div className="flex items-center gap-2">
              <span>📍</span>
              <span>{location}</span>
            </div>
          )}
        </div>
        {registrationUrl && !isPast && (
          <Button as={Link} to={registrationUrl} variant="solid" className="w-full">
            Register Now
          </Button>
        )}
        {isPast && (
          <Button variant="outline" className="w-full" disabled>
            Event Ended
          </Button>
        )}
      </div>
    </div>
  );
}
