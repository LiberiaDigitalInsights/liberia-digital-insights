"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { H1, H2, Muted } from "@/components/ui/Typography";
import { Card } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { useInsight, usePodcasts, useEvents } from "@/hooks/useBackendApi";
import ContentRenderer from "@/components/ui/ContentRenderer";
import LazyImage from "@/components/LazyImage";
import PodcastWidget from "@/components/sidebar/PodcastWidget";
import EventsWidget from "@/components/sidebar/EventsWidget";
import NewsletterWidget from "@/components/sidebar/NewsletterWidget";
import AdSlot from "@/components/ads/AdSlot";

export default function InsightDetailClient() {
  const { slug } = useParams();
  const router = useRouter();

  // Fetch insight by slug from backend
  const {
    data: insightData,
    loading: insightLoading,
    error: insightError,
  } = useInsight(slug);

  const { data: podcastsData } = usePodcasts({ limit: 3 });
  const { data: eventsData } = useEvents({ limit: 3 });

  const insight = insightData?.insight;

  // Loading state
  if (insightLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
        <div className="animate-pulse">
          <div className="mb-4 h-8 w-32 bg-surface rounded"></div>
          <div className="mb-4 h-12 w-3/4 bg-surface rounded"></div>
          <div className="mb-8 h-64 bg-surface rounded"></div>
          <div className="space-y-4">
            <div className="h-4 bg-surface rounded w-full"></div>
            <div className="h-4 bg-surface rounded w-full"></div>
            <div className="h-4 bg-surface rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (insightError || !insight) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12 text-center">
        <H1 className="mb-4 text-3xl font-bold">Insight Not Found</H1>
        <p className="mb-8 text-muted">
          The insight you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/insights"
          className="inline-flex items-center gap-2 rounded-md bg-brand-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-brand-600"
        >
          ← Back to Insights
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_350px]">
        {/* Main Content */}
        <div className="space-y-8">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-muted">
            <Link href="/" className="hover:text-text">
              Home
            </Link>
            {" / "}
            <Link href="/insights" className="hover:text-text">
              Insights
            </Link>
            {" / "}
            <span>{insight.category?.name || "Insights"}</span>
          </nav>

          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="mb-6 text-sm text-muted hover:text-text transition-colors duration-200"
          >
            ← Back
          </button>

          {/* Insight Header */}
          <header className="mb-8">
            {insight.category && (
              <div className="mb-4">
                <Badge variant="solid" className="bg-blue-600">
                  Special Insight
                </Badge>
              </div>
            )}
            <H1 className="mb-4 text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
              {insight.title}
            </H1>
            {insight.excerpt && (
              <p className="mb-6 text-xl text-muted leading-relaxed font-medium">
                {insight.excerpt}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
              {insight.author?.name && (
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-500 font-bold">
                    {insight.author.name.charAt(0)}
                  </div>
                  <span className="font-semibold text-text">
                    {insight.author.name}
                  </span>
                </div>
              )}
              {insight.published_at && <span>•</span>}
              {insight.published_at && (
                <span>
                  {new Date(insight.published_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              )}
              {insight.content && <span>•</span>}
              {insight.content && (
                <span>{Math.ceil(insight.content.length / 1000)} min read</span>
              )}
            </div>
          </header>

          {/* Featured Image */}
          {insight.cover_image_url && (
            <div className="mb-10 overflow-hidden rounded-2xl shadow-2xl aspect-video relative">
              <LazyImage
                src={insight.cover_image_url}
                alt={insight.title}
                className="h-full w-full"
                priority
              />
            </div>
          )}

          {/* Insight Content */}
          <article className="mb-12">
            {insight.content ? (
              <ContentRenderer html={insight.content} />
            ) : (
              <p className="text-muted italic">
                {insight.excerpt || "No content available for this insight."}
              </p>
            )}
          </article>

          <Card className="bg-brand-500/5 border-none p-8 text-center">
            <H2 className="mb-4 text-xl font-bold">Enjoyed this Insight?</H2>
            <p className="mb-6 text-muted">
              Subscribe to our newsletter to receive the latest tech insights
              every Thursday.
            </p>
            <Link
              href="/subscribe"
              className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-8 py-3 text-white font-bold transition-all hover:scale-105 hover:bg-brand-600 shadow-xl shadow-brand-500/30"
            >
              Subscribe Now
            </Link>
          </Card>
        </div>

        {/* Sidebar */}
        <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
          <PodcastWidget podcasts={podcastsData?.podcasts || []} />
          <NewsletterWidget />
          <EventsWidget events={eventsData?.events || []} />
          <AdSlot position="sidebar" />
        </aside>
      </div>
    </div>
  );
}
