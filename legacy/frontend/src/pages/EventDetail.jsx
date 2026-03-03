import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { H1, H2, Muted } from '../components/ui/Typography';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import SEO from '../components/SEO';
import { useEvent } from '../hooks/useBackendApi';

// Helper function to strip HTML tags
/**
 * Strips HTML tags from a given string.
 * @param {string} html The HTML string to strip.
 * @returns {string} The stripped HTML string.
 */
const _stripHtml = (html) => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

/**
 * Displays the details of an event.
 *
 * @param {Object} event - The event data retrieved from the backend.
 * @param {boolean} eventLoading - Indicates whether the event data is being fetched or not.
 * @param {Error} eventError - Error that occurred while fetching the event data.
 *
 * @returns A JSX element that displays the event details.
 */
export default function EventDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Fetch event by slug from backend
  const { data: eventData, loading: eventLoading, error: eventError } = useEvent(slug);
  const event = eventData?.event;

  // Loading state
  if (eventLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
        <div className="animate-pulse">
          <div className="mb-4 h-8 w-32 bg-gray-200 rounded"></div>
          <div className="mb-4 h-12 w-3/4 bg-gray-200 rounded"></div>
          <div className="mb-8 h-64 bg-gray-200 rounded"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (eventError || !event) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12 text-center">
        <H1 className="mb-4 text-3xl font-bold">Event Not Found</H1>
        <p className="mb-8 text-[var(--color-muted)]">
          The event you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-brand-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-brand-600"
        >
          ← Back to Events
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={event.title}
        description={event.description || event.title}
        image={event.cover_image_url}
        type="article"
        tags={event.tags || [event.category]}
      />
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-[var(--color-muted)]">
          <Link to="/" className="hover:text-[var(--color-text)]">
            Home
          </Link>
          {' / '}
          <Link to="/events" className="hover:text-[var(--color-text)]">
            Events
          </Link>
          {' / '}
          <span>{event.title}</span>
        </nav>

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-sm text-[var(--color-muted)] transition-colors duration-200 hover:text-[var(--color-text)]"
        >
          ← Back
        </button>

        {/* Event Header */}
        <div className="mb-8">
          <div className="mb-6 overflow-hidden rounded-[var(--radius-lg)]">
            <img
              src={event.cover_image_url}
              alt={event.title}
              className="h-64 w-full object-cover md:h-96"
            />
          </div>

          <div className="mb-4">
            <span className="inline-flex items-center rounded-full bg-brand-100 px-3 py-1 text-sm font-medium text-brand-800">
              {event.category}
            </span>
            <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
              {event.status}
            </span>
          </div>

          <H1 className="mb-4 text-3xl font-bold">{event.title}</H1>

          <div className="mb-6 flex flex-wrap gap-4 text-sm text-[var(--color-muted)]">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {new Date(event.date).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {event.location}
            </div>
            {event.max_attendees && (
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {event.current_attendees || 0} / {event.max_attendees} attendees
              </div>
            )}
          </div>
        </div>

        {/* Event Description */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>About This Event</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-[var(--color-text)]">
              <div dangerouslySetInnerHTML={{ __html: event.description }} />
            </div>
          </CardContent>
        </Card>

        {/* Registration Info */}
        {event.status === 'upcoming' && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Registration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-[var(--color-muted)]">
                Join us for this exciting event! Registration is{' '}
                {event.max_attendees && event.current_attendees >= event.max_attendees
                  ? 'currently full'
                  : 'open'}
                .
              </p>
              {(!event.max_attendees || event.current_attendees < event.max_attendees) && (
                <>
                  {event.registration_url ? (
                    <Button
                      as="a"
                      href={event.registration_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-[var(--radius-md)] bg-brand-500 px-6 py-2 text-white transition-colors duration-200 hover:bg-brand-600"
                    >
                      Register Now
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      disabled
                      className="rounded-[var(--radius-md)] px-6 py-2"
                    >
                      Registration Unavailable
                    </Button>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-[color-mix(in_oklab,var(--color-surface),white_10%)] px-3 py-1 text-sm text-[var(--color-muted)]"
                  >
                    #{String(tag).replace(/^#/, '')}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
