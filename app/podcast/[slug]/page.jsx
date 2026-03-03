"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { H1, H2, Muted } from "@/components/ui/Typography";
import { Card, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { usePodcast } from "@/hooks/useBackendApi";
import ArticleCard from "@/components/articles/ArticleCard";
import {
  FaPlay,
  FaShareAlt,
  FaCalendarAlt,
  FaClock,
  FaUser,
} from "react-icons/fa";

export default function PodcastDetail() {
  const { slug } = useParams();
  const router = useRouter();

  // Fetch podcast by slug from backend
  const {
    data: podcastData,
    loading: podcastLoading,
    error: podcastError,
  } = usePodcast(slug);

  const podcast = podcastData?.podcast;

  if (podcastLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
        <div className="animate-pulse">
          <div className="mb-4 h-8 w-32 bg-surface rounded"></div>
          <div className="mb-8 h-64 bg-surface rounded"></div>
          <div className="space-y-4">
            <div className="h-4 bg-surface rounded w-full"></div>
            <div className="h-4 bg-surface rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (podcastError || !podcast) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12 text-center">
        <H1 className="mb-4">Podcast Not Found</H1>
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
        <span>Episode {podcast.episode_number}</span>
      </nav>

      {/* Header */}
      <header className="mb-10 text-center md:text-left">
        <Badge variant="solid" className="mb-4">
          EPISODE {podcast.episode_number}
        </Badge>
        <H1 className="mb-4 text-3xl md:text-5xl font-extrabold tracking-tight">
          {podcast.title}
        </H1>

        <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-muted mt-6">
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-brand-500" />
            <span>{new Date(podcast.published_at).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaClock className="text-brand-500" />
            <span>{podcast.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaUser className="text-brand-500" />
            <span className="font-semibold text-text">
              {podcast.author?.name}
            </span>
          </div>
        </div>
      </header>

      {/* Audio Player Card */}
      <Card className="mb-12 border-none shadow-2xl bg-gradient-to-br from-brand-500/10 to-brand-600/5 p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-brand-500/10 transition-colors duration-500" />

        <div className="relative z-10 grid md:grid-cols-[200px_1fr] gap-8 items-center">
          {podcast.cover_image_url && (
            <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg border-4 border-surface">
              <img
                src={podcast.cover_image_url}
                alt={podcast.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div>
            <H2 className="text-xl font-bold mb-4">Listen to this Episode</H2>
            {/* Replace with actual audio player later */}
            <div className="bg-surface rounded-full p-2 flex items-center gap-4 shadow-sm border border-border">
              <button className="h-12 w-12 rounded-full bg-brand-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/20 hover:scale-105 transition-transform">
                <FaPlay className="ml-1" />
              </button>
              <div className="flex-1 h-2 bg-brand-500/10 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-brand-500" />
              </div>
              <span className="text-xs font-mono px-4 text-text">
                00:00 / {podcast.duration}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Description */}
      <section className="mb-12 prose prose-invert max-w-none">
        <H2 className="text-2xl font-bold mb-6">Episode Summary</H2>
        <div className="text-muted leading-relaxed text-lg">
          {podcast.description ||
            "Join us in this episode as we discuss tech innovation and digital transformation in Liberia."}
        </div>
        {podcast.content && (
          <div
            className="mt-8 border-t border-border pt-8 text-text"
            dangerouslySetInnerHTML={{ __html: podcast.content }}
          />
        )}
      </section>

      {/* CTA */}
      <Card className="bg-surface border-border p-10 text-center">
        <H2 className="mb-4">Never Miss an Episode</H2>
        <Muted className="mb-8 block">
          Subscribe to the Liberia Digital Insights Podcast on your favorite
          platform.
        </Muted>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="rounded-full bg-surface border border-border px-6 py-2 text-sm font-bold hover:bg-brand-500/5 transition-colors">
            Spotify
          </button>
          <button className="rounded-full bg-surface border border-border px-6 py-2 text-sm font-bold hover:bg-brand-500/5 transition-colors">
            Apple Podcasts
          </button>
          <button className="rounded-full bg-surface border border-border px-6 py-2 text-sm font-bold hover:bg-brand-500/5 transition-colors">
            Google Podcasts
          </button>
        </div>
      </Card>
    </div>
  );
}
