"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { useEvents } from "@/hooks/useBackendApi";

export default function EventsWidget({ events = [], loading = false }) {
  return (
    <Card className="bg-surface/50 border-border/40">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-brand-500 rounded-full" />
            <CardTitle className="text-lg">Upcoming Events</CardTitle>
          </div>
          <Link
            href="/events"
            className="text-[10px] font-bold text-brand-500 hover:text-brand-600 transition-colors"
          >
            ALL EVENTS
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-bg/50 rounded-xl" />
            ))}
          </div>
        ) : events.length > 0 ? (
          <ul className="space-y-3">
            {events.slice(0, 4).map((event) => (
              <li key={event.id}>
                <Link
                  href={`/event/${event.slug}`}
                  className="flex flex-col gap-1 rounded-xl bg-bg/50 border border-border/40 px-4 py-3 transition-all duration-300 hover:bg-brand-500/5 hover:border-brand-500/20 group"
                >
                  <span className="text-xs font-bold text-text group-hover:text-brand-500 transition-colors line-clamp-1 truncate">
                    {event.title}
                  </span>
                  <span className="text-[10px] text-muted font-medium">
                    {new Date(
                      event.date || event.published_at,
                    ).toLocaleDateString()}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-xs text-muted py-4 text-center border-2 border-dashed border-border/20 rounded-xl">
            No upcoming events at the moment.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
