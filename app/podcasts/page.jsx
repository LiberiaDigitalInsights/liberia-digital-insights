"use client";

import React from "react";
import PodcastCard from "@/components/podcasts/PodcastCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { usePodcasts } from "@/hooks/useBackendApi";
import { MotionGrid, MotionItem } from "@/components/ui/MotionWrapper";

export default function PodcastsPage() {
  const { data: podcastsData, loading } = usePodcasts({ limit: 12 });
  const podcasts = podcastsData?.podcasts || [];
  const featured = podcasts[0];
  const rest = podcasts.slice(1);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      {/* Header */}
      <header className="mb-12">
        <SectionHeading
          subtitle="Insights, stories, and interviews from Liberia's technology leaders, entrepreneurs, and innovators."
          align="left"
        >
          Podcasts
        </SectionHeading>
      </header>

      {/* Featured Episode */}
      {loading ? (
        <div className="mb-16 animate-pulse rounded-3xl bg-surface/30 border border-border/10 h-64" />
      ) : featured ? (
        <section className="mb-16">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-brand-500">
            Latest Episode
          </p>
          <PodcastCard
            id={featured.id}
            title={featured.title}
            description={
              featured.description ||
              "Join us for a deep dive into the latest tech trends in Liberia."
            }
            duration={featured.duration}
            date={new Date(featured.published_at).toLocaleDateString()}
            guest={featured.guest}
            image={featured.cover_image_url}
            href={`/podcast/${featured.slug}`}
            tags={featured.tags || []}
            featured
          />
        </section>
      ) : null}

      {/* All Episodes */}
      {(loading || rest.length > 0) && (
        <section>
          <div className="flex items-center justify-between mb-8 border-b border-border/20 pb-4">
            <h2 className="text-2xl font-bold text-text">All Episodes</h2>
            <span className="text-sm text-muted font-medium">
              {podcasts.length} {podcasts.length === 1 ? "Episode" : "Episodes"}
            </span>
          </div>

          <MotionGrid className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {loading
              ? [1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-3xl bg-surface/30 border border-border/10 overflow-hidden"
                  >
                    <div className="aspect-video bg-surface" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 w-3/4 bg-surface rounded" />
                      <div className="h-3 w-1/2 bg-surface rounded" />
                    </div>
                  </div>
                ))
              : rest.map((podcast) => (
                  <MotionItem key={podcast.id}>
                    <PodcastCard
                      id={podcast.id}
                      title={podcast.title}
                      description={podcast.description}
                      duration={podcast.duration}
                      date={new Date(podcast.published_at).toLocaleDateString()}
                      guest={podcast.guest}
                      image={podcast.cover_image_url}
                      href={`/podcast/${podcast.slug}`}
                      tags={podcast.tags || []}
                    />
                  </MotionItem>
                ))}
          </MotionGrid>

          {!loading && rest.length === 0 && podcasts.length > 0 && (
            <p className="text-center py-8 text-sm text-muted">
              Only one episode so far — more coming soon!
            </p>
          )}

          {!loading && podcasts.length === 0 && (
            <div className="col-span-full text-center py-16 text-muted">
              <p className="text-lg font-medium">No episodes yet.</p>
              <p className="mt-2 text-sm opacity-60">
                Check back soon for the latest episodes.
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
