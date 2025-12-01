import React from 'react';
import { H1 } from '../components/ui/Typography';
import PodcastCard from '../components/podcasts/PodcastCard';
import SEO from '../components/SEO';
import { usePodcasts } from '../hooks/useBackendApi';

export default function Podcasts() {
  const { data: podcastsData, loading: podcastsLoading } = usePodcasts({ limit: 12 });
  const podcasts = podcastsData?.podcasts || [];

  return (
    <>
      <SEO />
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        {/* Header */}
        <header className="mb-8">
          <H1 className="mb-4 text-3xl font-bold">Podcasts</H1>
          <p className="text-lg text-[var(--color-muted)]">
            Listen to interviews, insights, and discussions about tech in Liberia
          </p>
        </header>

        {/* Featured Episode */}
        {podcastsLoading ? (
          <div className="mb-12 animate-pulse">
            <div className="h-48 bg-gray-200 rounded-lg"></div>
          </div>
        ) : podcasts.length > 0 ? (
          <div className="mb-12 opacity-0 animate-slide-up">
            <PodcastCard
              id={podcasts[0].id}
              title={podcasts[0].title}
              description={podcasts[0].description}
              duration={podcasts[0].duration}
              date={new Date(podcasts[0].published_at).toLocaleDateString()}
              guest={podcasts[0].author?.name}
              image={podcasts[0].cover_image_url}
              to={`/podcast/${podcasts[0].slug}`}
              className="md:grid md:grid-cols-2"
            />
          </div>
        ) : null}

        {/* Episodes Grid */}
        <section>
          <h2 className="mb-6 text-xl font-bold">All Episodes</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {podcastsLoading ? (
              // Loading skeleton
              [1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))
            ) : podcasts.length > 0 ? (
              podcasts.map((podcast, idx) => (
                <div
                  key={podcast.id}
                  className="opacity-0 animate-slide-up"
                  style={{ animationDelay: `${100 + idx * 50}ms` }}
                >
                  <PodcastCard
                    id={podcast.id}
                    title={podcast.title}
                    description={podcast.description}
                    duration={podcast.duration}
                    date={new Date(podcast.published_at).toLocaleDateString()}
                    guest={podcast.author?.name}
                    image={podcast.cover_image_url}
                    to={`/podcast/${podcast.slug}`}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-[var(--color-muted)]">
                  No podcasts available yet.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
