"use client";

import React from "react";
import { H1, Muted } from "@/components/ui/Typography";
import EventCard from "@/components/events/EventCard";
import { useEvents } from "@/hooks/useBackendApi";
import { Tabs } from "@/components/ui/Tabs";
import Countdown from "@/components/events/Countdown";
import EmptyState from "@/components/ui/EmptyState";
import { MotionGrid, MotionItem } from "@/components/ui/MotionWrapper";

export default function EventsPage() {
  const [tab, setTab] = React.useState("upcoming");

  // Fetch data
  const { data: eventsData, loading: eventsLoading } = useEvents({ limit: 40 });
  const allEvents = eventsData?.events || [];

  // Split events into upcoming and past based on current date
  const currentDate = new Date();
  const upcoming = allEvents.filter(
    (event) => new Date(event.date) >= currentDate,
  );
  const past = allEvents.filter((event) => new Date(event.date) < currentDate);
  // Auto-switch to past if upcoming is empty
  React.useEffect(() => {
    if (!eventsLoading && upcoming.length === 0 && past.length > 0) {
      setTab("past");
    }
  }, [eventsLoading, upcoming.length, past.length]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      {/* Header */}
      <header className="mb-12">
        <H1 className="mb-4">Events</H1>
        <Muted className="max-w-3xl text-lg block mb-6">
          Discover tech events, hackathons, conferences, and meetups in Liberia.
          Stay connected with the community and grow your network.
        </Muted>

        {eventsLoading ? (
          <div className="animate-pulse h-8 w-48 bg-surface rounded-full" />
        ) : upcoming.length > 0 ? (
          <Countdown to={upcoming[0].date} />
        ) : null}
      </header>

      {/* Main Content */}
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          {
            value: "upcoming",
            label: `Upcoming (${upcoming.length})`,
            content: (
              <div className="min-h-[400px]">
                {eventsLoading ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="animate-pulse h-80 bg-surface rounded-lg"
                      ></div>
                    ))}
                  </div>
                ) : upcoming.length > 0 ? (
                  <MotionGrid className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {upcoming.map((event, idx) => (
                      <MotionItem key={event.id}>
                        <EventCard
                          {...event}
                          href={`/event/${event.slug}`}
                          image={event.cover_image_url}
                          isPast={false}
                        />
                      </MotionItem>
                    ))}
                  </MotionGrid>
                ) : (
                  <EmptyState
                    title="No upcoming events"
                    description="Check back soon or explore past recaps below."
                  />
                )}
              </div>
            ),
          },
          {
            value: "past",
            label: `Past Events (${past.length})`,
            content: (
              <div className="min-h-[400px]">
                {eventsLoading ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="animate-pulse h-80 bg-surface rounded-lg"
                      ></div>
                    ))}
                  </div>
                ) : past.length > 0 ? (
                  <MotionGrid className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {past.map((event, idx) => (
                      <MotionItem key={event.id}>
                        <EventCard
                          {...event}
                          href={`/event/${event.slug}`}
                          image={event.cover_image_url}
                          isPast={true}
                        />
                      </MotionItem>
                    ))}
                  </MotionGrid>
                ) : (
                  <EmptyState
                    title="No past events"
                    description="We'll publish recaps as events conclude."
                  />
                )}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
