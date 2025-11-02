import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

const events = [
  'Orange Summer Challenge 2nd Edition',
  'DIGITECH EXPO 2025 AI CHALLENGE',
  'Monrovia Tech Submit 2025',
  'MTN HACKATON 2025',
];

export default function EventsWidget() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>EVENTS</CardTitle>
          <Link to="/events" className="text-xs text-brand-500 hover:underline">
            ALL EVENTS
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {events.map((event, idx) => (
            <li key={idx}>
              <Link
                to="/events"
                className="block rounded-[var(--radius-sm)] px-2 py-2 text-sm text-[var(--color-text)] transition-colors duration-200 hover:bg-[color-mix(in_oklab,var(--color-surface),white_6%)]"
              >
                {event}
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
