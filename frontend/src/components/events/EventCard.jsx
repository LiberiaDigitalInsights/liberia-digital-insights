import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/cn';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { formatEventDateRange } from '../../data/mockEvents';

// Helper function to strip HTML tags
const stripHtml = (html) => {
  if (!html) return '';
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

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
  to,
}) {
  const formattedDate = formatEventDateRange(date, endDate);
  const [imageError, setImageError] = React.useState(false);

  return (
    <div
      className={cn(
        'group overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
        className,
      )}
    >
      {image && image !== 'null' && image !== 'undefined' && !imageError ? (
        <div className="relative h-48 overflow-hidden bg-[color-mix(in_oklab,var(--color-surface),white_6%)] md:h-56">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
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
      ) : (
        <div className="relative h-48 overflow-hidden bg-[color-mix(in_oklab,var(--color-surface),white_6%)] md:h-56 flex items-center justify-center">
          <div className="text-4xl text-gray-400">📅</div>
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
          {to ? (
            <Link to={to} className="hover:underline">
              {title}
            </Link>
          ) : (
            title
          )}
        </h3>
        {description && (
          <p className="mb-4 line-clamp-2 text-sm text-[var(--color-muted)] transition-colors duration-300 group-hover:text-[var(--color-text)]">
            {stripHtml(description)}
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
        {registrationUrl && registrationUrl !== 'null' && registrationUrl !== 'undefined' && registrationUrl !== '#' && !isPast && (
          <Button as={Link} to={registrationUrl} variant="solid" className="w-full">
            Register Now
          </Button>
        )}
        {!registrationUrl && !isPast && (
          <Button variant="outline" className="w-full" disabled>
            Registration Unavailable
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
