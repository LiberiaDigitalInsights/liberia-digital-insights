import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { useEvents } from '../../hooks/useBackendApi';

export default function EventsWidget() {
  const { data: eventsData, loading } = useEvents({ limit: 4 });
  const events = eventsData?.events || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>EVENTS</CardTitle>
          <Link to="/events" className="text-xs ml-4 text-brand-500 hover:underline">
            ALL EVENTS
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : events.length > 0 ? (
          <ul className="space-y-2">
            {events.map((event) => (
              <li key={event.id}>
                <Link
                  to={`/event/${event.slug}`}
                  className="block rounded-[var(--radius-sm)] px-2 py-2 text-sm text-[var(--color-text)] transition-colors duration-200 hover:bg-[color-mix(in_oklab,var(--color-surface),white_6%)] hover:bg-[color-mix(in_oklab,var(--color-surface),black_6%)]"
                >
                  {event.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-sm text-[var(--color-muted)]">
            No upcoming events
          </div>
        )}
      </CardContent>
    </Card>
  );
}
