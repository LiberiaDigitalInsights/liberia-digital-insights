import React from 'react';
import { H1 } from '../components/ui/Typography';
import PodcastCard from '../components/podcasts/PodcastCard';
import SEO from '../components/SEO';
import { generatePodcastGrid } from '../data/mockPodcasts';

export default function Podcasts() {
  const allEpisodes = generatePodcastGrid(12);

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
        {allEpisodes[0] && (
          <div className="mb-12 opacity-0 animate-slide-up">
            <PodcastCard
              {...allEpisodes[0]}
              to={`/podcast/${allEpisodes[0].id}`}
              className="md:grid md:grid-cols-2"
            />
          </div>
        )}

        {/* Episodes Grid */}
        <section>
          <h2 className="mb-6 text-xl font-bold">All Episodes</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allEpisodes.map((episode, idx) => (
              <div
                key={episode.id}
                className="opacity-0 animate-slide-up"
                style={{ animationDelay: `${100 + idx * 50}ms` }}
              >
                <PodcastCard
                  id={episode.id}
                  title={episode.title}
                  description={episode.description}
                  duration={episode.duration}
                  date={episode.date}
                  guest={episode.guest}
                  image={episode.image}
                  to={`/podcast/${episode.id}`}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
