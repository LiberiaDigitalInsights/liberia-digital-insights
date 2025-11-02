import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { H1, H2, Muted } from '../components/ui/Typography';
import PodcastPlayer from '../components/podcasts/PodcastPlayer';
import PodcastCard from '../components/podcasts/PodcastCard';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import SEO from '../components/SEO';
import { mockPodcasts, generatePodcastGrid } from '../data/mockPodcasts';

export default function PodcastDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const podcast = mockPodcasts.find((p) => p.id === Number(id)) || mockPodcasts[0];
  const relatedPodcasts = generatePodcastGrid(3).filter((p) => p.id !== podcast.id);

  return (
    <>
      <SEO
        title={podcast.title}
        description={podcast.description || podcast.title}
        image={podcast.image}
        type="article"
        author={podcast.guest}
        tags={podcast.tags || [podcast.category]}
      />
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-[var(--color-muted)]">
        <Link to="/" className="hover:text-[var(--color-text)]">
          Home
        </Link>
        {' / '}
        <Link to="/podcasts" className="hover:text-[var(--color-text)]">
          Podcasts
        </Link>
        {' / '}
        <span>Episode {id}</span>
      </nav>

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-sm text-[var(--color-muted)] transition-colors duration-200 hover:text-[var(--color-text)]"
      >
        ← Back
      </button>

      {/* Podcast Player */}
      <div className="mb-12">
        <PodcastPlayer
          title={podcast.title}
          description={podcast.description}
          duration={podcast.duration}
          audioUrl={podcast.audioUrl}
          image={podcast.image}
          date={podcast.date}
          guest={podcast.guest}
        />
      </div>

      {/* Show Notes */}
      {podcast.showNotes && podcast.showNotes.length > 0 && (
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Show Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {podcast.showNotes.map((note, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500 text-xs font-medium text-white">
                    {idx + 1}
                  </span>
                  <span className="text-sm text-[var(--color-text)]">{note}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Episode Details */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Episode Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {podcast.date && (
            <div>
              <span className="font-medium text-[var(--color-text)]">Published:</span>{' '}
              <span className="text-[var(--color-muted)]">{podcast.date}</span>
            </div>
          )}
          {podcast.duration && (
            <div>
              <span className="font-medium text-[var(--color-text)]">Duration:</span>{' '}
              <span className="text-[var(--color-muted)]">{podcast.duration}</span>
            </div>
          )}
          {podcast.guest && (
            <div>
              <span className="font-medium text-[var(--color-text)]">Guest:</span>{' '}
              <span className="text-[var(--color-muted)]">{podcast.guest}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Related Episodes */}
      <section>
        <H2 className="mb-6 text-2xl font-bold">More Episodes</H2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {relatedPodcasts.map((related) => (
            <PodcastCard
              key={related.id}
              id={related.id}
              title={related.title}
              description={related.description}
              duration={related.duration}
              date={related.date}
              guest={related.guest}
              image={related.image}
              to={`/podcast/${related.id}`}
            />
          ))}
        </div>
      </section>
    </div>
    </>
  );
}
