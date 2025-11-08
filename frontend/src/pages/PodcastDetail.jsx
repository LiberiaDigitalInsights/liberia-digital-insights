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
          {/* Guest Info */}
          {podcast.guest && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Guest</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div
                    aria-hidden
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--color-surface),white_8%)] text-sm font-semibold text-[var(--color-text)]"
                    title={podcast.guest}
                  >
                    {String(podcast.guest).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[var(--color-text)]">
                      {podcast.guest}
                    </div>
                    {podcast.date && (
                      <div className="text-xs text-[var(--color-muted)]">
                        Recorded {podcast.date}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {podcast.links && (
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              {podcast.links.youtube && (
                <a
                  href={podcast.links.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-500 hover:underline"
                >
                  Watch on YouTube
                </a>
              )}
              {podcast.links.spotify && (
                <a
                  href={podcast.links.spotify}
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-500 hover:underline"
                >
                  Listen on Spotify
                </a>
              )}
            </div>
          )}
          {/* Inline Embeds */}
          {podcast.links?.youtube && (
            <div className="mt-6 aspect-video overflow-hidden rounded-[var(--radius-md)]">
              <iframe
                title="YouTube embed"
                width="100%"
                height="100%"
                src={toYouTubeEmbed(podcast.links.youtube)}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          )}
          {podcast.links?.spotify && (
            <div className="mt-6 overflow-hidden rounded-[var(--radius-md)]">
              <iframe
                title="Spotify embed"
                style={{ borderRadius: '12px' }}
                src={toSpotifyEmbed(podcast.links.spotify)}
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            </div>
          )}
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

        {/* Transcript */}
        {podcast.description && (
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Transcript</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line text-sm text-[var(--color-text)]">
                {podcast.description}
              </p>
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

function toYouTubeEmbed(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com')) {
      const id = u.searchParams.get('v');
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
    if (u.hostname.includes('youtu.be')) {
      const id = u.pathname.slice(1);
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  } catch {
    return url;
  }
}

function toSpotifyEmbed(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes('open.spotify.com')) {
      return url
        .replace('/track/', '/embed/track/')
        .replace('/show/', '/embed/show/')
        .replace('/episode/', '/embed/episode/');
    }
    return url;
  } catch {
    return url;
  }
}
