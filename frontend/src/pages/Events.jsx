import React from 'react';
import { H1 } from '../components/ui/Typography';
import EventCard from '../components/events/EventCard';
import { useEvents } from '../hooks/useBackendApi';
import { Tabs } from '../components/ui/Tabs';
import SEO from '../components/SEO';
import Countdown from '../components/events/Countdown';
import { Link } from 'react-router-dom';
import EmptyState from '../components/ui/EmptyState';

export default function Events() {
  const [tab, setTab] = React.useState('upcoming');
  const { data: eventsData, loading: eventsLoading } = useEvents({ limit: 20 });
  const allEvents = eventsData?.events || [];
  
  // Split events into upcoming and past based on current date
  const currentDate = new Date();
  const upcoming = allEvents.filter(event => new Date(event.date) >= currentDate);
  const past = allEvents.filter(event => new Date(event.date) < currentDate);

  return (
    <>
      <SEO />
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        {/* Header */}
        <header className="mb-8">
          <H1 className="mb-4 text-3xl font-bold">Events</H1>
          <p className="text-lg text-[var(--color-muted)]">
            Discover tech events, hackathons, conferences, and meetups in Liberia
          </p>
          {eventsLoading ? (
            <div className="mt-4 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-48"></div>
            </div>
          ) : upcoming.length > 0 ? (
            <div className="mt-4">
              <Countdown to={upcoming[0].date} />
            </div>
          ) : null}
        </header>

        {/* Loading State */}
        {eventsLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        {!eventsLoading && (
          <div className="mb-8">
            <Tabs
              value={tab}
              onChange={setTab}
              tabs={[
                {
                  value: 'upcoming',
                  label: `Upcoming (${upcoming.length})`,
                  content: (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {upcoming.length > 0 ? (
                        upcoming.map((event, idx) => (
                          <div
                            key={event.id}
                            className="opacity-0 animate-slide-up"
                            style={{ animationDelay: `${100 + idx * 50}ms` }}
                          >
                            <EventCard
                              id={event.id}
                              title={event.title}
                              description={event.description}
                              date={event.date}
                              location={event.location}
                              image={event.cover_image_url}
                              category={event.category}
                              status={event.status}
                              isPast={tab === 'past'}
                              to={`/event/${event.slug}`}
                            />
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full">
                          <EmptyState
                            title="No upcoming events"
                            description="Check back soon or explore past recaps below."
                          />
                        </div>
                      )}
                    </div>
                  ),
                },
                {
                  value: 'past',
                  label: `Past Events (${past.length})`,
                  content: (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {past.length > 0 ? (
                        past.map((event, idx) => (
                          <div
                            key={event.id}
                            className="opacity-0 animate-slide-up"
                            style={{ animationDelay: `${100 + idx * 50}ms` }}
                          >
                            <EventCard
                              id={event.id}
                              title={event.title}
                              description={event.description}
                              date={event.date}
                              location={event.location}
                              image={event.cover_image_url}
                              category={event.category}
                              status={event.status}
                              isPast={tab === 'past'}
                              to={`/event/${event.slug}`}
                            />
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full">
                          <EmptyState
                            title="No past events"
                            description="We'll publish recaps as events conclude."
                          />
                        </div>
                      )}
                    </div>
                  ),
                },
              ]}
            />
          </div>
        )}
      </div>
    </>
  );
}
