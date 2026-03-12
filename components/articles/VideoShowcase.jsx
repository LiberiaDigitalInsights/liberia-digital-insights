import React from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import LazyImage from "@/components/LazyImage";
import { FaPlay } from "react-icons/fa";

export default function VideoShowcase({ videos = [], loading = false }) {
  const featured = videos[0];
  const remaining = videos.slice(1, 4);

  if (loading) {
    return (
      <div className="bg-[#1a1a1a] py-16 px-4 md:px-6 rounded-[2.5rem] animate-pulse h-[600px]" />
    );
  }

  return (
    <section className="bg-[#1a1a1a] py-16 px-4 md:px-6 rounded-[2.5rem] overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center gap-4 mb-10 border-b border-white/10 pb-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Latest <span className="text-brand-500">Interviews</span>
          </h2>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.5fr_1fr]">
          {/* Featured Video */}
          {featured && (
            <Link
              href={`/podcast/${featured.slug}`}
              className="group relative block overflow-hidden rounded-3xl aspect-video bg-surface/50 shadow-2xl"
            >
              <LazyImage
                src={featured.cover_image_url}
                alt={featured.title}
                className="h-full w-full transition-transform duration-700 group-hover:scale-105 object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/40 to-transparent" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-20 w-20 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-[0_0_50px_rgba(136,38,39,0.5)] scale-90 group-hover:scale-100 transition-all duration-300">
                  <FaPlay className="ml-1 text-2xl" />
                </div>
              </div>

              <div className="absolute bottom-8 left-8 right-8">
                <div className="text-xs font-bold text-brand-500 mb-3 tracking-wide">
                  FEATURED INTERVIEW
                </div>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight mb-2 group-hover:text-brand-200 transition-colors">
                  {featured.title}
                </h3>
              </div>
            </Link>
          )}

          {/* Video List */}
          <div className="space-y-6">
            {remaining.map((video) => (
              <Link
                key={video.id}
                href={`/podcast/${video.slug}`}
                className="group flex gap-4 items-center bg-white/5 p-4 rounded-2xl hover:bg-white/10 transition-all duration-300 border border-white/5"
              >
                <div className="relative w-32 h-20 rounded-xl overflow-hidden shrink-0 shadow-lg">
                  <LazyImage
                    src={video.cover_image_url}
                    alt={video.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/60 transition-colors">
                    <FaPlay className="text-white text-xs" />
                  </div>
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-[10px] font-bold tracking-wider text-brand-500 mb-1">
                    PODCAST
                  </span>
                  <h4 className="text-sm font-semibold text-white line-clamp-2 leading-snug group-hover:text-brand-300 transition-colors">
                    {video.title}
                  </h4>
                  <span className="text-[10px] font-medium text-white/40 mt-2 tracking-wide">
                    {new Date(video.published_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </Link>
            ))}

            <Link
              href="/podcasts"
              className="block w-full text-center py-4 rounded-2xl border border-white/10 text-white font-semibold text-sm hover:bg-white/10 hover:border-brand-500/50 transition-all duration-300 mt-8 tracking-wide"
            >
              Watch All Interviews
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
