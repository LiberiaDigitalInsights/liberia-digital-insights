"use client";

import React, { useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { H1, H2, Muted } from "@/components/ui/Typography";
import { Card } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import PodcastCard from "@/components/podcasts/PodcastCard";
import GuestModal from "@/components/podcasts/GuestModal";
import { usePodcast, usePodcasts, useTalents } from "@/hooks/useBackendApi";
import BookmarkButton from "@/components/ui/BookmarkButton";
import ShareButton from "@/components/ui/ShareButton";

// ── Helpers ────────────────────────────────────────────────────────────────────
function fmt(s) {
  if (isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function toYouTubeEmbed(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
    if (u.hostname.includes("youtu.be"))
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
  } catch {}
  return url;
}

function toSpotifyEmbed(url) {
  try {
    return url
      .replace("/track/", "/embed/track/")
      .replace("/show/", "/embed/show/")
      .replace("/episode/", "/embed/episode/");
  } catch {}
  return url;
}

// ── Inline Audio Player ────────────────────────────────────────────────────────
function InlinePlayer({ src, image, title, duration }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [totalTime, setTotalTime] = useState(duration || "0:00");

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setPlaying(!playing);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const { currentTime: ct, duration: d } = audioRef.current;
    setCurrentTime(fmt(ct));
    setProgress(d ? (ct / d) * 100 : 0);
    if (!isNaN(d)) setTotalTime(fmt(d));
  };

  const handleSeek = (e) => {
    if (!audioRef.current?.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    audioRef.current.currentTime =
      ((e.clientX - rect.left) / rect.width) * audioRef.current.duration;
  };

  return (
    <Card className="mb-8 border border-border/10 bg-surface/30 rounded-3xl p-5 md:p-6">
      {src && (
        <audio
          ref={audioRef}
          src={src}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setPlaying(false)}
          preload="metadata"
        />
      )}
      <div className="grid grid-cols-[auto_1fr] gap-5 items-center">
        {/* Cover thumbnail */}
        <div className="relative h-20 w-20 shrink-0 rounded-xl overflow-hidden border border-border/10 shadow-md">
          {image ? (
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-brand-500/10 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-8 h-8 text-brand-500/40"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          )}
        </div>

        {/* Player controls */}
        <div>
          <p className="mb-3 text-sm font-semibold text-text truncate">
            {title || "Listen to this Episode"}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              aria-label={playing ? "Pause" : "Play"}
              className="h-10 w-10 shrink-0 rounded-full bg-brand-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/30 hover:scale-105 transition-transform"
            >
              {playing ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 ml-0.5"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <div className="flex-1">
              <div
                className="h-1.5 bg-border/30 rounded-full overflow-hidden cursor-pointer mb-1"
                onClick={handleSeek}
              >
                <div
                  className="h-full bg-brand-500 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-muted">
                <span>{currentTime}</span>
                <span>{totalTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Platform link row ──────────────────────────────────────────────────────────
const PLATFORMS = [
  {
    key: "youtube_url",
    label: "YouTube",
    sub: "Watch video version",
    bg: "bg-red-600",
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    key: "spotify_url",
    label: "Spotify",
    sub: "Stream on Spotify",
    bg: "bg-green-600",
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.569-.88.851-1.449.611-3.966-1.531-8.361-1.871-12.706-1.028-.569.12-1.131-.24-1.27-.849-.12-.569.24-1.131.849-1.27 4.681-.902 9.486-.542 13.771 1.068.568.24.851.881.61 1.45l-.005.018zm1.448-3.22c-.301.721-1.131 1.051-1.831.75-4.521-1.771-11.412-2.281-16.713-1.249-.721.15-1.431-.3-1.571-1.021-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
    ),
  },
  {
    key: "apple_podcasts_url",
    label: "Apple Podcasts",
    sub: "Listen on Apple",
    bg: "bg-gray-900",
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
    ),
  },
  {
    key: "facebook_url",
    label: "Facebook",
    sub: "Watch on Facebook",
    bg: "bg-blue-600",
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

// ── Main page ──────────────────────────────────────────────────────────────────
export default function PodcastDetail() {
  const { slug } = useParams();
  const router = useRouter();
  const [transcriptExpanded, setTranscriptExpanded] = useState(false);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [guestLoading, setGuestLoading] = useState(false);

  const { data: podcastData, loading, error } = usePodcast(slug);
  const { data: allData } = usePodcasts({ limit: 4 });

  const podcast = podcastData?.podcast;
  const related = (allData?.podcasts || [])
    .filter((p) => p.id !== podcast?.id && p.slug !== slug)
    .slice(0, 3);

  // Fetch full guest profile — prefer guest_profile JSONB from the podcast itself
  const handleGuestClick = async () => {
    if (!podcast?.guest) return;

    // If guest_profile JSONB is already on the podcast, use it directly
    if (podcast.guest_profile) {
      const gp = podcast.guest_profile;
      setSelectedGuest({
        name: podcast.guest,
        role: gp.title || "Guest Speaker",
        avatar_url: gp.photo_url || null,
        bio: gp.bio || null,
        location: gp.location || null,
        skills: gp.skills || [],
        links: {
          ...(gp.twitter ? { twitter: gp.twitter } : {}),
          ...(gp.linkedin ? { linkedin: gp.linkedin } : {}),
          ...(gp.website ? { website: gp.website } : {}),
        },
      });
      setIsGuestModalOpen(true);
      return;
    }

    // If we already fetched this guest from talents, just open
    if (selectedGuest && selectedGuest.name === podcast.guest) {
      setIsGuestModalOpen(true);
      return;
    }

    setGuestLoading(true);
    try {
      // Search for talent by name as fallback
      const response = await fetch(
        `/api/v1/talents?search=${encodeURIComponent(podcast.guest)}`,
      );
      const result = await response.json();

      if (result.talents && result.talents.length > 0) {
        const match =
          result.talents.find(
            (t) => t.name.toLowerCase() === podcast.guest.toLowerCase(),
          ) || result.talents[0];
        setSelectedGuest(match);
      } else {
        setSelectedGuest({
          name: podcast.guest,
          role: "Guest Speaker",
          bio: "No additional profile information available for this guest speaker.",
        });
      }
      setIsGuestModalOpen(true);
    } catch (err) {
      console.error("Failed to fetch guest profile:", err);
      setSelectedGuest({
        name: podcast.guest,
        role: "Guest Speaker",
      });
      setIsGuestModalOpen(true);
    } finally {
      setGuestLoading(false);
    }
  };

  const episodeLabel =
    podcast?.episode_number && podcast?.season_number
      ? `S${podcast.season_number}E${podcast.episode_number}`
      : podcast?.episode_number
        ? `Episode ${podcast.episode_number}`
        : "Episode —";

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
        <div className="animate-pulse space-y-5">
          <div className="h-6 w-32 bg-surface rounded" />
          <div className="h-10 w-3/4 bg-surface rounded" />
          <div className="rounded-3xl bg-surface/30 h-32 border border-border/10" />
          <div className="h-4 w-full bg-surface rounded" />
          <div className="h-4 w-3/4 bg-surface rounded" />
        </div>
      </div>
    );
  }

  if (error || !podcast) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12 text-center">
        <H1 className="mb-4">Episode Not Found</H1>
        <p className="mb-8 text-muted">
          The episode you're looking for doesn't exist.
        </p>
        <Link
          href="/podcasts"
          className="inline-flex items-center gap-2 rounded-md bg-brand-500 px-4 py-2 text-white"
        >
          ← Back to Podcasts
        </Link>
      </div>
    );
  }

  // Platform links that actually have a URL
  const availablePlatforms = PLATFORMS.filter((p) => podcast[p.key]);
  const transcript = podcast.transcript || null;
  const showNotes = podcast.showNotes || [];

  const guestPhoto = podcast.guest_profile?.photo_url;
  const guestTitle = podcast.guest_profile?.title;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-muted">
        <Link href="/" className="hover:text-text">
          Home
        </Link>
        {" / "}
        <Link href="/podcasts" className="hover:text-text">
          Podcasts
        </Link>
        {" / "}
        <span>{episodeLabel}</span>
      </nav>

      <button
        onClick={() => router.back()}
        className="mb-6 text-sm text-muted hover:text-text transition-colors"
      >
        ← Back
      </button>

      {/* Header */}
      <header className="mb-8">
        <div className="mb-4">
          <Badge variant="solid">{episodeLabel}</Badge>
        </div>
        <div className="flex items-start justify-between gap-4">
          <H1 className="flex-1 text-3xl md:text-4xl font-bold leading-tight">
            {podcast.title}
          </H1>
          <div className="flex items-center gap-2 mt-1">
            <ShareButton
              title={podcast.title}
              url={typeof window !== "undefined" ? window.location.href : ""}
            />
            <BookmarkButton
              contentId={podcast.id}
              contentType="podcast"
              size="lg"
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted">
          <span>Hosted by {podcast.author?.name || "LDI Staff"}</span>
          {podcast.published_at && <span>•</span>}
          {podcast.published_at && (
            <span>
              {new Date(podcast.published_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          )}
          {podcast.duration && (
            <>
              <span>•</span>
              <span>{podcast.duration}</span>
            </>
          )}
        </div>
      </header>

      {/* ── Inline player ── */}
      <InlinePlayer
        src={podcast.audio_url}
        image={podcast.cover_image_url}
        title={podcast.title}
        duration={podcast.duration}
      />

      {/* ── Guest card ── */}
      {podcast.guest && (
        <Card
          className="mb-8 border border-border/10 bg-surface/30 rounded-2xl p-5 cursor-pointer hover:bg-surface/50 hover:border-border/30 transition-all group relative overflow-hidden"
          onClick={handleGuestClick}
        >
          {/* Subtle hover effect */}
          <div className="absolute inset-0 bg-linear-to-r from-brand-500/0 via-brand-500/5 to-brand-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative z-10">
            <div className="mb-4 text-xs font-bold uppercase tracking-widest text-muted flex items-center justify-between">
              Guest Speaker
              {guestLoading && (
                <div className="h-3 w-3 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 shrink-0 rounded-2xl overflow-hidden bg-brand-500/20 flex items-center justify-center text-brand-500 font-bold text-xl group-hover:scale-110 transition-transform duration-300 border border-border/10">
                {guestPhoto ? (
                  <img
                    src={guestPhoto}
                    alt={podcast.guest}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  String(podcast.guest).charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text group-hover:text-brand-400 transition-colors">
                  {podcast.guest}
                </p>
                {guestTitle && (
                  <p className="text-xs text-brand-500 font-medium mt-0.5">
                    {guestTitle}
                  </p>
                )}
                <p className="text-xs text-muted mt-0.5">
                  Click to view full profile →
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* ── Platform links ── */}
      {availablePlatforms.length > 0 && (
        <div className="mb-10">
          <H2 className="mb-4 text-lg font-semibold">
            Listen on Your Favourite Platform
          </H2>
          <div className="grid gap-3 sm:grid-cols-2">
            {availablePlatforms.map((p) => (
              <a
                key={p.key}
                href={podcast[p.key]}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-border/10 bg-surface/30 p-4 transition-all hover:border-border/30 hover:shadow-lg hover:shadow-black/20"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${p.bg} text-white`}
                >
                  {p.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-text">{p.label}</p>
                  <p className="text-xs text-muted">{p.sub}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ── YouTube embed ── */}
      {podcast.youtube_url && (
        <div className="mb-10 aspect-video overflow-hidden rounded-2xl border border-border/10">
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

      {/* ── Spotify embed ── */}
      {podcast.spotify_url && (
        <div className="mb-10 overflow-hidden rounded-xl">
          <iframe
            title="Spotify embed"
            style={{ borderRadius: "12px" }}
            src={toSpotifyEmbed(podcast.spotify_url)}
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </div>
      )}

      {/* ── Episode Summary ── */}
      <section className="mb-10">
        <H2 className="text-2xl font-bold mb-4">Episode Summary</H2>
        <div
          className="text-muted leading-relaxed text-lg mb-6"
          dangerouslySetInnerHTML={{
            __html:
              podcast.description ||
              "Join us in this episode as we discuss tech innovation and digital transformation in Liberia.",
          }}
        />

        {podcast.content && (
          <div
            className="prose prose-invert max-w-none border-t border-border/20 pt-8 text-text"
            dangerouslySetInnerHTML={{ __html: podcast.content }}
          />
        )}
      </section>

      {/* ── Show Notes ── */}
      {showNotes.length > 0 && (
        <Card className="mb-8 border border-border/10 bg-surface/30 rounded-2xl p-5 md:p-6">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-muted">
            Show Notes
          </p>
          <ul className="space-y-3">
            {showNotes.map((note, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500 text-[11px] font-bold text-white">
                  {idx + 1}
                </span>
                <span className="text-sm text-text">{note}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* ── Transcript ── */}
      {transcript && (
        <div
          className="mb-8 border border-border/10 bg-surface/30 rounded-2xl p-5 md:p-6 cursor-pointer select-none"
          onClick={() => setTranscriptExpanded(!transcriptExpanded)}
        >
          {/* Always-visible header with chevron */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold uppercase tracking-widest text-muted">
              Transcript
            </p>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-500">
              <span>{transcriptExpanded ? "Collapse" : "Show full"}</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`w-3.5 h-3.5 transition-transform duration-300 ${transcriptExpanded ? "rotate-180" : ""}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
          {/* Max-height clipping — preserves HTML structure */}
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${transcriptExpanded ? "max-h-none" : "max-h-48"}`}
            style={
              transcriptExpanded
                ? {}
                : {
                    WebkitMaskImage:
                      "linear-gradient(to bottom, black 60%, transparent 100%)",
                    maskImage:
                      "linear-gradient(to bottom, black 60%, transparent 100%)",
                  }
            }
          >
            <div
              className="prose prose-invert max-w-none text-sm"
              dangerouslySetInnerHTML={{ __html: transcript }}
            />
          </div>
        </div>
      )}

      {/* ── Episode Details ── */}
      <Card className="mb-12 border border-border/10 bg-surface/30 rounded-2xl p-5 md:p-6">
        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-muted">
          Episode Details
        </p>
        <dl className="space-y-2.5 text-sm">
          {podcast.published_at && (
            <div className="flex gap-2">
              <dt className="font-semibold text-text w-28 shrink-0">
                Published
              </dt>
              <dd className="text-muted">
                {new Date(podcast.published_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </dd>
            </div>
          )}
          {podcast.duration && (
            <div className="flex gap-2">
              <dt className="font-semibold text-text w-28 shrink-0">
                Duration
              </dt>
              <dd className="text-muted">{podcast.duration}</dd>
            </div>
          )}
          {podcast.guest && (
            <div className="flex gap-2">
              <dt className="font-semibold text-text w-28 shrink-0">Guest</dt>
              <dd className="text-muted">{podcast.guest}</dd>
            </div>
          )}
          {(podcast.episode_number || podcast.season_number) && (
            <div className="flex gap-2">
              <dt className="font-semibold text-text w-28 shrink-0">Episode</dt>
              <dd className="text-muted">{episodeLabel}</dd>
            </div>
          )}
          {podcast.category?.name && (
            <div className="flex gap-2">
              <dt className="font-semibold text-text w-28 shrink-0">
                Category
              </dt>
              <dd className="text-muted">{podcast.category.name}</dd>
            </div>
          )}
          {podcast.language && (
            <div className="flex gap-2">
              <dt className="font-semibold text-text w-28 shrink-0">
                Language
              </dt>
              <dd className="text-muted">
                {podcast.language === "en"
                  ? "English"
                  : podcast.language === "fr"
                    ? "French"
                    : podcast.language}
              </dd>
            </div>
          )}
          {podcast.tags?.length > 0 && (
            <div className="flex gap-2">
              <dt className="font-semibold text-text w-28 shrink-0">Tags</dt>
              <dd className="text-muted">{podcast.tags.join(", ")}</dd>
            </div>
          )}
        </dl>

        {/* Stats row */}
        {(podcast.plays_count !== undefined ||
          podcast.downloads_count !== undefined ||
          podcast.likes_count !== undefined) && (
          <div className="mt-5 pt-4 border-t border-border/10 grid grid-cols-3 gap-4 text-center">
            {podcast.plays_count !== undefined && (
              <div>
                <p className="text-lg font-bold text-text">
                  {podcast.plays_count || 0}
                </p>
                <p className="text-xs text-muted">Plays</p>
              </div>
            )}
            {podcast.downloads_count !== undefined && (
              <div>
                <p className="text-lg font-bold text-text">
                  {podcast.downloads_count || 0}
                </p>
                <p className="text-xs text-muted">Downloads</p>
              </div>
            )}
            {podcast.likes_count !== undefined && (
              <div>
                <p className="text-lg font-bold text-text">
                  {podcast.likes_count || 0}
                </p>
                <p className="text-xs text-muted">Likes</p>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* ── More Episodes ── */}
      {related.length > 0 && (
        <section className="mb-12">
          <H2 className="mb-6 text-xl font-bold">More Episodes</H2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((ep) => (
              <PodcastCard
                key={ep.id}
                id={ep.id}
                title={ep.title}
                description={ep.description}
                duration={ep.duration}
                date={new Date(ep.published_at).toLocaleDateString()}
                guest={ep.guest}
                image={ep.cover_image_url}
                href={`/podcast/${ep.slug}`}
                tags={ep.tags || []}
              />
            ))}
          </div>
        </section>
      )}
      {/* ── Guest Modal ── */}
      <GuestModal
        open={isGuestModalOpen}
        onClose={() => setIsGuestModalOpen(false)}
        guest={selectedGuest}
      />
    </div>
  );
}
