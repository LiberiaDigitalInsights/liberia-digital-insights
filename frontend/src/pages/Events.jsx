import React from 'react';
import { H1 } from '../components/ui/Typography';
import EventCard from '../components/events/EventCard';
import { getUpcomingEvents, getPastEvents } from '../data/mockEvents';
import { Tabs } from '../components/ui/Tabs';
import SEO from '../components/SEO';
import Countdown from '../components/events/Countdown';
import { mockGallery } from '../data/mockGallery';
import { Link } from 'react-router-dom';
import EmptyState from '../components/ui/EmptyState';

export default function Events() {
  const [tab, setTab] = React.useState('upcoming');
  const upcoming = getUpcomingEvents();
  const past = getPastEvents();

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
          {upcoming.length > 0 && (
            <div className="mt-4">
              <Countdown to={upcoming[0].date} />
            </div>
          )}
        </header>

        {/* Tabs */}
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
                            endDate={event.endDate}
                            location={event.location}
                            image={event.image}
                            category={event.category}
                            registrationUrl={event.registrationUrl}
                            status={event.status}
                            isPast={event.isPast}
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
                            endDate={event.endDate}
                            location={event.location}
                            image={event.image}
                            category={event.category}
                            registrationUrl={event.registrationUrl}
                            status={event.status}
                            isPast={event.isPast}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full">
                        <EmptyState
                          title="No past events"
                          description="We’ll publish recaps as events conclude."
                        />
                      </div>
                    )}
                  </div>
                ),
              },
            ]}
          />
        </div>
        {/* Recent Recaps */}
        <section className="mt-12">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[var(--color-text)]">Recent Recaps</h2>
            <Link to="/gallery" className="text-sm text-brand-500 hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {mockGallery.slice(0, 6).map((item) => (
              <Link
                to="/gallery"
                key={item.id}
                className="group overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
                aria-label={`${item.title} recap`}
              >
                <div className="aspect-square overflow-hidden bg-[color-mix(in_oklab,var(--color-surface),white_6%)]">
                  <img
                    src={item.thumbnail || item.url}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-2 text-xs text-[var(--color-muted)]">{item.event}</div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
