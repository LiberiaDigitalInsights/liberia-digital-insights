"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { useEvents } from "@/hooks/useBackendApi";

export default function EventsWidget({ events = [], loading = false }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>EVENTS</CardTitle>
          <Link
            href="/events"
            className="text-xs ml-4 text-brand-500 hover:underline"
          >
            ALL EVENTS
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-8 bg-gray-200/20 rounded"></div>
              </div>
            ))}
          </div>
        ) : events.length > 0 ? (
          <ul className="space-y-2">
            {events.map((event) => (
              <li key={event.id}>
                <Link
                  href={`/event/${event.slug}`}
                  className="block rounded-sm px-2 py-2 text-sm text-text transition-colors duration-200 hover:bg-brand-500/10"
                >
                  {event.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-sm text-muted">No upcoming events</div>
        )}
      </CardContent>
    </Card>
  );
}
