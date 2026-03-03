"use client";

import React from "react";
import { H1, Muted } from "@/components/ui/Typography";
import PodcastCard from "@/components/podcasts/PodcastCard";
import { usePodcasts } from "@/hooks/useBackendApi";
import { MotionGrid, MotionItem } from "@/components/ui/MotionWrapper";

export default function PodcastsPage() {
  const { data: podcastsData, loading: podcastsLoading } = usePodcasts({
    limit: 12,
  });
  const podcasts = podcastsData?.podcasts || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      {/* Header */}
      <header className="mb-12 text-center">
        <H1 className="mb-4">Podcasts</H1>
        <Muted className="mx-auto max-w-2xl text-lg">
          Insights, stories, and interviews from Liberia’s technology leaders,
          entrepreneurs, and innovators. Listen to the latest episodes of
          Liberia Digital Insights Podcast.
        </Muted>
      </header>

      {/* Featured Episode */}
      {podcastsLoading ? (
        <div className="mb-12 animate-pulse">
          <div className="h-64 bg-surface rounded-lg"></div>
        </div>
      ) : podcasts.length > 0 ? (
        <section className="mb-16">
          <PodcastCard
            id={podcasts[0].id}
            title={podcasts[0].title}
            description={
              podcasts[0].description ||
              "Join us for a deep dive into the latest tech trends in Liberia."
            }
            duration={podcasts[0].duration}
            date={new Date(podcasts[0].published_at).toLocaleDateString()}
            guest={podcasts[0].author?.name}
            image={podcasts[0].cover_image_url}
            href={`/podcast/${podcasts[0].slug}`}
            className="md:grid md:grid-cols-[1.2fr_0.8fr]"
          />
        </section>
      ) : null}

      {/* Episodes Grid */}
      <section>
        <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
          <h2 className="text-2xl font-bold text-text">All Episodes</h2>
          <Muted className="text-sm font-medium">
            {podcasts.length} Episodes
          </Muted>
        </div>

        <MotionGrid className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {podcastsLoading ? (
            [1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-surface rounded mb-4"></div>
                <div className="h-4 bg-surface rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-surface rounded w-1/2"></div>
              </div>
            ))
          ) : podcasts.length > 0 ? (
            podcasts.map((podcast, idx) => (
              <MotionItem key={podcast.id}>
                <PodcastCard
                  id={podcast.id}
                  title={podcast.title}
                  description={podcast.description}
                  duration={podcast.duration}
                  date={new Date(podcast.published_at).toLocaleDateString()}
                  guest={podcast.author?.name}
                  image={podcast.cover_image_url}
                  href={`/podcast/${podcast.slug}`}
                />
              </MotionItem>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted">No podcasts available yet.</p>
            </div>
          )}
        </MotionGrid>
      </section>
    </div>
  );
}
