"use client";

import React from "react";
import { cn } from "@/lib/cn";
import Badge from "@/components/ui/Badge";
import LazyImage from "@/components/LazyImage";
import { FaPlay, FaCamera } from "react-icons/fa";

export default function GalleryItem({ item, onClick, className }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(item)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(item);
        }
      }}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-3xl border border-border/50 bg-surface transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-brand-500/20",
        className,
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-muted/10">
        <LazyImage
          src={item.thumbnail_url || item.url}
          alt={item.title || "Gallery item"}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

        <div className="absolute top-4 right-4 z-10">
          {item.type === "video" ? (
            <div className="h-10 w-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-xl shadow-rose-500/20">
              <FaPlay className="text-sm ml-0.5" />
            </div>
          ) : (
            <div className="h-10 w-10 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center shadow-xl">
              <FaCamera className="text-sm" />
            </div>
          )}
        </div>
      </div>

      <div className="absolute inset-0 flex flex-col justify-end p-6 pointer-events-none">
        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <h3 className="mb-2 line-clamp-2 text-sm font-black uppercase tracking-widest text-white italic italic leading-tight">
            {item.title}
          </h3>
          {(item.events?.title || item.podcasts?.title) && (
            <p className="mb-3 text-[10px] font-bold text-white/60 uppercase tracking-tighter">
              {item.events?.title || item.podcasts?.title}
            </p>
          )}
          <div className="flex gap-2">
            {item.category && (
              <Badge
                variant="subtle"
                className="text-[9px] font-black uppercase tracking-widest bg-brand-500/20 text-brand-500 border-none px-2"
              >
                {item.category}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
