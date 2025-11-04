import React from 'react';
import { H1 } from '../components/ui/Typography';
import EventCard from '../components/events/EventCard';
import { getUpcomingEvents, getPastEvents } from '../data/mockEvents';
import { Tabs } from '../components/ui/Tabs';
import SEO from '../components/SEO';
import Countdown from '../components/events/Countdown';

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
                    <div className="col-span-full py-12 text-center text-[var(--color-muted)]">
                      No upcoming events scheduled.
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
                    <div className="col-span-full py-12 text-center text-[var(--color-muted)]">
                      No past events found.
                    </div>
                  )}
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
    </>
  );
}
