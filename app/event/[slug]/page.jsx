"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { H1, Muted } from "@/components/ui/Typography";
import { Card, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useEvent } from "@/hooks/useBackendApi";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaUserFriends,
  FaShareAlt,
} from "react-icons/fa";

export default function EventDetail() {
  const { slug } = useParams();
  const router = useRouter();

  // Fetch event by slug from backend
  const {
    data: eventData,
    loading: eventLoading,
    error: eventError,
  } = useEvent(slug);

  const event = eventData?.event;
  const isPast = event ? new Date(event.date) < new Date() : false;

  if (eventLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
        <div className="animate-pulse">
          <div className="mb-4 h-8 w-32 bg-surface rounded"></div>
          <div className="mb-8 h-80 bg-surface rounded-xl"></div>
          <div className="space-y-4">
            <div className="h-4 bg-surface rounded w-full"></div>
            <div className="h-4 bg-surface rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (eventError || !event) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12 text-center">
        <H1 className="mb-4">Event Not Found</H1>
        <p className="mb-8 text-muted">
          The event you're looking for doesn't exist.
        </p>
        <Link
          href="/events"
          className="inline-flex items-center gap-2 rounded-md bg-brand-500 px-4 py-2 text-white"
        >
          ← Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-muted">
        <Link href="/" className="hover:text-text">
          Home
        </Link>
        {" / "}
        <Link href="/events" className="hover:text-text">
          Events
        </Link>
        {" / "}
        <span>{event.title}</span>
      </nav>

      <header className="mb-10 text-center md:text-left">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
          <Badge variant="solid">
            {typeof event.category === "string"
              ? event.category
              : event.category?.name}
          </Badge>
          {isPast ? (
            <Badge variant="outline">Past Event</Badge>
          ) : (
            <Badge variant="solid" className="bg-emerald-500">
              Upcoming
            </Badge>
          )}
        </div>
        <H1 className="mb-4 text-3xl md:text-5xl font-extrabold tracking-tight">
          {event.title}
        </H1>
      </header>

      <div className="grid md:grid-cols-[1fr_300px] gap-8">
        <main>
          {/* Featured Image */}
          {event.cover_image_url && (
            <div className="mb-10 overflow-hidden rounded-2xl shadow-xl">
              <img
                src={event.cover_image_url}
                alt={event.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Description */}
          <section className="prose prose-invert max-w-none mb-12">
            <h2 className="text-2xl font-bold mb-6">About the Event</h2>
            <div
              className="text-muted leading-relaxed"
              dangerouslySetInnerHTML={{
                __html:
                  event.description ||
                  "No description available for this event.",
              }}
            />
          </section>
        </main>

        <aside className="space-y-6">
          <Card className="p-6 sticky top-24">
            <h3 className="font-bold text-lg mb-4 border-b border-border pb-2">
              Event Details
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <FaCalendarAlt className="text-brand-500 mt-1 shrink-0" />
                <div>
                  <div className="text-xs text-muted uppercase font-bold tracking-wider">
                    Date
                  </div>
                  <div className="text-sm font-semibold">
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              {event.location && (
                <div className="flex gap-3">
                  <FaMapMarkerAlt className="text-brand-500 mt-1 shrink-0" />
                  <div>
                    <div className="text-xs text-muted uppercase font-bold tracking-wider">
                      Location
                    </div>
                    <div className="text-sm font-semibold">
                      {event.location}
                    </div>
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <FaUserFriends className="text-brand-500 mt-1 shrink-0" />
                <div>
                  <div className="text-xs text-muted uppercase font-bold tracking-wider">
                    Category
                  </div>
                  <div className="text-sm font-semibold">
                    {typeof event.category === "string"
                      ? event.category
                      : event.category?.name}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              {isPast ? (
                <Button variant="secondary" className="w-full" disabled>
                  Registration Closed
                </Button>
              ) : event.registrationUrl ? (
                <Button
                  as="a"
                  href={event.registrationUrl}
                  className="w-full shadow-lg shadow-brand-500/20"
                >
                  Register Now
                </Button>
              ) : (
                <Button variant="secondary" className="w-full" disabled>
                  Registration Unavailable
                </Button>
              )}
            </div>
          </Card>

          <Card className="bg-brand-500/5 border-none p-6">
            <h4 className="font-bold mb-2">Share Event</h4>
            <p className="text-xs text-muted mb-4">
              Invite your friends to join this event.
            </p>
            <div className="flex gap-2">
              <button className="p-2 rounded-full bg-surface border border-border hover:bg-brand-500/10">
                <FaShareAlt className="text-sm" />
              </button>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
