import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { H1, H2, Muted } from '../components/ui/Typography';
import PodcastPlayer from '../components/podcasts/PodcastPlayer';
import PodcastCard from '../components/podcasts/PodcastCard';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import SEO from '../components/SEO';
import { usePodcast, usePodcasts, useCategories } from '../hooks/useBackendApi';

export default function PodcastDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isTranscriptExpanded, setIsTranscriptExpanded] = useState(false);

  // Fetch podcast by slug from backend
  const { data: podcastData, loading: podcastLoading, error: podcastError } = usePodcast(slug);
  const { data: relatedPodcastsData, loading: _relatedLoading } = usePodcasts({ limit: 3 });
  const { data: categoriesData } = useCategories();

  const podcast = podcastData?.podcast;
  const relatedPodcasts = relatedPodcastsData?.podcasts || [];
  const categories = categoriesData?.data || [];

  // Helper function to strip HTML tags
  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  // Helper function to get category name by ID
  const getCategoryName = (categoryId) => {
    if (!categoryId) return 'N/A';
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

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
          <span>
            {podcast.episode_number && podcast.season_number
              ? `S${podcast.season_number}E${podcast.episode_number}`
              : podcast.episode_number
                ? `Episode ${podcast.episode_number}`
                : podcast.title}
          </span>
        </nav>

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-sm text-[var(--color-muted)] transition-colors duration-200 hover:text-[var(--color-text)]"
        >
          ← Back to Podcasts
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
                    <div className="text-xs text-[var(--color-muted)]">Guest Speaker</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {/* External Links */}
          {(podcast.youtube_url ||
            podcast.spotify_url ||
            podcast.apple_podcasts_url ||
            podcast.facebook_url) && (
            <div className="mt-6">
              <H2 className="mb-4 text-xl font-semibold">Listen on Your Favorite Platform</H2>
              <div className="grid gap-3 md:grid-cols-2">
                {podcast.youtube_url && (
                  <a
                    href={podcast.youtube_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-all hover:bg-[color-mix(in_oklab,var(--color-surface),white_8%)] hover:shadow-md"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-red-600 text-white">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-[var(--color-text)]">YouTube</div>
                      <div className="text-sm text-[var(--color-muted)]">Watch video version</div>
                    </div>
                  </a>
                )}
                {podcast.spotify_url && (
                  <a
                    href={podcast.spotify_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-all hover:bg-[color-mix(in_oklab,var(--color-surface),white_8%)] hover:shadow-md"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-green-600 text-white">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.569-.88.851-1.449.611-3.966-1.531-8.361-1.871-12.706-1.028-.569.12-1.131-.24-1.27-.849-.12-.569.24-1.131.849-1.27 4.681-.902 9.486-.542 13.771 1.068.568.24.851.881.61 1.45l-.005.018zm1.448-3.22c-.301.721-1.131 1.051-1.831.75-4.521-1.771-11.412-2.281-16.713-1.249-.721.15-1.431-.3-1.571-1.021-.15-1.15.41-2.35 1.05-3.11z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-[var(--color-text)]">Spotify</div>
                      <div className="text-sm text-[var(--color-muted)]">Stream on Spotify</div>
                    </div>
                  </a>
                )}
                {podcast.apple_podcasts_url && (
                  <a
                    href={podcast.apple_podcasts_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-all hover:bg-[color-mix(in_oklab,var(--color-surface),white_8%)] hover:shadow-md"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-900 text-white">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-[var(--color-text)]">Apple Podcasts</div>
                      <div className="text-sm text-[var(--color-muted)]">Listen on Apple</div>
                    </div>
                  </a>
                )}
                {podcast.facebook_url && (
                  <a
                    href={podcast.facebook_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-all hover:bg-[color-mix(in_oklab,var(--color-surface),white_8%)] hover:shadow-md"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-600 text-white">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-[var(--color-text)]">Facebook</div>
                      <div className="text-sm text-[var(--color-muted)]">Watch on Facebook</div>
                    </div>
                  </a>
                )}
              </div>
            </div>
          )}
          {/* Inline Embeds */}
          {podcast.youtube_url && (
            <div className="mt-6 aspect-video overflow-hidden rounded-[var(--radius-md)]">
              <iframe
                title="YouTube embed"
                width="100%"
                height="100%"
                src={toYouTubeEmbed(podcast.youtube_url)}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          )}
          {podcast.spotify_url && (
            <div className="mt-6 overflow-hidden rounded-[var(--radius-md)]">
              <iframe
                title="Spotify embed"
                style={{ borderRadius: '12px' }}
                src={toSpotifyEmbed(podcast.spotify_url)}
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
        {podcast.transcript && (
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Transcript</CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const plainText = stripHtml(podcast.transcript);
                const isLong = plainText.length > 500;
                const displayText =
                  isLong && !isTranscriptExpanded ? plainText.substring(0, 500) + '...' : plainText;

                return (
                  <div>
                    <p className="whitespace-pre-line text-sm text-[var(--color-text)]">
                      {displayText}
                    </p>
                    {isLong && (
                      <button
                        onClick={() => setIsTranscriptExpanded(!isTranscriptExpanded)}
                        className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      >
                        {isTranscriptExpanded ? 'Read less' : 'Read more'}
                      </button>
                    )}
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}

        {/* Episode Details */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Episode Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {podcast.published_at && (
              <div>
                <span className="font-medium text-[var(--color-text)]">Published:</span>{' '}
                <span className="text-[var(--color-muted)]">
                  {new Date(podcast.published_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
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
            {(podcast.episode_number || podcast.season_number) && (
              <div>
                <span className="font-medium text-[var(--color-text)]">Episode:</span>{' '}
                <span className="text-[var(--color-muted)]">
                  {podcast.episode_number && podcast.season_number
                    ? `S${podcast.season_number}E${podcast.episode_number}`
                    : podcast.episode_number
                      ? `Episode ${podcast.episode_number}`
                      : `Season ${podcast.season_number}`}
                </span>
              </div>
            )}
            {podcast.category_id && (
              <div>
                <span className="font-medium text-[var(--color-text)]">Category:</span>{' '}
                <span className="text-[var(--color-muted)]">
                  {getCategoryName(podcast.category_id)}
                </span>
              </div>
            )}
            {podcast.language && (
              <div>
                <span className="font-medium text-[var(--color-text)]">Language:</span>{' '}
                <span className="text-[var(--color-muted)]">
                  {podcast.language === 'en'
                    ? 'English'
                    : podcast.language === 'fr'
                      ? 'French'
                      : podcast.language === 'es'
                        ? 'Spanish'
                        : podcast.language}
                </span>
              </div>
            )}
            {podcast.tags && podcast.tags.length > 0 && (
              <div>
                <span className="font-medium text-[var(--color-text)]">Tags:</span>{' '}
                <span className="text-[var(--color-muted)]">{podcast.tags.join(', ')}</span>
              </div>
            )}
            {podcast.is_featured && (
              <div>
                <span className="font-medium text-[var(--color-text)]">Featured:</span>{' '}
                <span className="text-[var(--color-muted)]">Yes</span>
              </div>
            )}
            {(podcast.plays_count || podcast.downloads_count || podcast.likes_count) && (
              <div className="grid grid-cols-3 gap-4 pt-2">
                {podcast.plays_count !== undefined && (
                  <div className="text-center">
                    <div className="font-medium text-[var(--color-text)]">
                      {podcast.plays_count || 0}
                    </div>
                    <div className="text-xs text-[var(--color-muted)]">Plays</div>
                  </div>
                )}
                {podcast.downloads_count !== undefined && (
                  <div className="text-center">
                    <div className="font-medium text-[var(--color-text)]">
                      {podcast.downloads_count || 0}
                    </div>
                    <div className="text-xs text-[var(--color-muted)]">Downloads</div>
                  </div>
                )}
                {podcast.likes_count !== undefined && (
                  <div className="text-center">
                    <div className="font-medium text-[var(--color-text)]">
                      {podcast.likes_count || 0}
                    </div>
                    <div className="text-xs text-[var(--color-muted)]">Likes</div>
                  </div>
                )}
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
