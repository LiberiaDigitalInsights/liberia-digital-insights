import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { H1, H2, Muted } from '../components/ui/Typography';
import PodcastPlayer from '../components/podcasts/PodcastPlayer';
import PodcastCard from '../components/podcasts/PodcastCard';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import SEO from '../components/SEO';
import { usePodcast, usePodcasts } from '../hooks/useBackendApi';

export default function PodcastDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Fetch podcast by slug from backend
  const { data: podcastData, loading: podcastLoading, error: podcastError } = usePodcast(slug);
  const { data: relatedPodcastsData, loading: _relatedLoading } = usePodcasts({ limit: 3 });

  const podcast = podcastData?.podcast;
  const relatedPodcasts = relatedPodcastsData?.podcasts || [];

  // Loading state
  if (podcastLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
        <div className="animate-pulse">
          <div className="mb-4 h-8 w-32 bg-gray-200 rounded"></div>
          <div className="mb-4 h-12 w-3/4 bg-gray-200 rounded"></div>
          <div className="mb-8 h-64 bg-gray-200 rounded"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (podcastError || !podcast) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12 text-center">
        <H1 className="mb-4 text-3xl font-bold">Podcast Not Found</H1>
        <p className="mb-8 text-[var(--color-muted)]">
          The podcast you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/podcasts"
          className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-brand-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-brand-600"
        >
          ← Back to Podcasts
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={podcast.title}
        description={podcast.description || podcast.title}
        image={podcast.cover_image_url}
        type="article"
        author={podcast.author?.name}
        tags={podcast.tags || []}
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
          <span>Episode {podcast.episode_number}</span>
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
            audioUrl={podcast.audio_url}
            image={podcast.cover_image_url}
            date={new Date(podcast.published_at).toLocaleDateString()}
            guest={podcast.author?.name}
          />
          {/* Guest Info */}
          {podcast.author?.name && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Host</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div
                    aria-hidden
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--color-surface),white_8%)] text-sm font-semibold text-[var(--color-text)]"
                    title={podcast.author.name}
                  >
                    {String(podcast.author.name).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[var(--color-text)]">
                      {podcast.author.name}
                    </div>
                    {podcast.published_at && (
                      <div className="text-xs text-[var(--color-muted)]">
                        Published {new Date(podcast.published_at).toLocaleDateString()}
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
            {relatedPodcasts
              .filter((related) => related.id !== podcast.id)
              .map((related) => (
                <PodcastCard
                  key={related.id}
                  id={related.id}
                  title={related.title}
                  description={related.description}
                  duration={related.duration}
                  date={new Date(related.published_at).toLocaleDateString()}
                  guest={related.author?.name}
                  image={related.cover_image_url}
                  to={`/podcast/${related.slug}`}
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
