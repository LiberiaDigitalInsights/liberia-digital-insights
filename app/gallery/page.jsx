"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { H1, Muted } from "@/components/ui/Typography";
import GalleryItem from "@/components/gallery/GalleryItem";
import Lightbox from "@/components/gallery/Lightbox";
import { useGallery } from "@/hooks/useGallery";
import { MotionGrid, MotionItem } from "@/components/ui/MotionWrapper";
import {
  FaFilter,
  FaImages,
  FaVideo,
  FaLayerGroup,
  FaStar,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import LazyImage from "@/components/LazyImage";
import Badge from "@/components/ui/Badge";

// Hero card for featured items
const FeaturedCard = ({ item, onClick }) => (
  <div
    role="button"
    tabIndex={0}
    onClick={() => onClick(item)}
    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick(item)}
    className="group relative cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-black"
  >
    <div className="relative aspect-video overflow-hidden">
      <LazyImage
        src={item.thumbnail_url || item.url}
        alt={item.title}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-75 group-hover:brightness-90"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />
      <div className="absolute top-4 left-4">
        <Badge
          variant="warning"
          className="text-[10px] font-black uppercase tracking-widest bg-amber-500 text-black border-none px-3 py-1"
        >
          <FaStar className="mr-1 text-[9px]" /> Featured
        </Badge>
      </div>
    </div>
    <div className="absolute inset-0 flex flex-col justify-end p-6">
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-500 mb-2">
        {item.category || "Gallery"}
      </p>
      <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-white leading-tight line-clamp-2">
        {item.title}
      </h3>
      {item.description && (
        <p className="mt-2 text-sm text-white/60 line-clamp-2 font-medium">
          {item.description}
        </p>
      )}
    </div>
  </div>
);

const FilterPill = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all duration-200 ${
      active
        ? "bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-500/20"
        : "bg-surface border-border hover:border-brand-500/50 text-muted hover:text-text"
    }`}
  >
    {children}
  </button>
);

export default function GalleryPage() {
  const [filter, setFilter] = useState("all");
  const [mediaType, setMediaType] = useState("all"); // "all" | "image" | "video"
  const [searchQuery, setSearchQuery] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [items, setItems] = useState([]);
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const gallery = useGallery();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [itemsData, eventsData, categoriesData] = await Promise.all([
        gallery.getItems(),
        gallery.getEvents(),
        gallery.getCategories(),
      ]);

      setItems(
        Array.isArray(itemsData?.items)
          ? itemsData.items
          : Array.isArray(itemsData)
            ? itemsData
            : [],
      );
      setEvents(Array.isArray(eventsData) ? eventsData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (err) {
      console.error("Gallery Error:", err);
      setError("System malfunction: Gallery data offline.");
    } finally {
      setLoading(false);
    }
  }, [gallery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const featuredItems = useMemo(() => items.filter((i) => i.featured), [items]);

  const filteredItems = useMemo(() => {
    let result = items;

    // Category / event filter
    if (filter !== "all") {
      if (filter.startsWith("event:")) {
        const eventSlug = filter.replace("event:", "");
        result = result.filter((item) => item.events?.slug === eventSlug);
      } else if (filter.startsWith("category:")) {
        const category = filter.replace("category:", "");
        result = result.filter((item) => item.category === category);
      }
    }

    // Media type filter
    if (mediaType !== "all") {
      result = result.filter((item) => item.type === mediaType);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.category?.toLowerCase().includes(q) ||
          (Array.isArray(item.tags) &&
            item.tags.some((t) => t.toLowerCase().includes(q))),
      );
    }

    return result;
  }, [filter, items, mediaType, searchQuery]);

  const handleItemClick = useCallback(
    (item) => {
      const idx = items.findIndex((i) => i.id === item.id);
      setLightboxIndex(idx);
    },
    [items],
  );

  const handleJump = useCallback((targetIdx) => {
    setLightboxIndex(targetIdx);
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 animate-pulse text-center">
        <H1 className="mb-4 opacity-10">THE VISUAL HUB</H1>
        <Muted className="uppercase tracking-[0.4em] text-[10px] font-black">
          Decrypting archive...
        </Muted>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-20 bg-background text-text">
      {/* Page Header */}
      <header className="mb-16 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[200px] w-full bg-brand-500/5 blur-[120px]" />
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-surface border border-border/50 mb-8">
          <div className="h-2 w-2 rounded-full bg-brand-500 animate-ping" />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Live Visual Archive
          </span>
        </div>
        <H1 className="mb-6 text-5xl md:text-7xl font-black uppercase italic tracking-tighter decoration-brand-500 underline underline-offset-8 decoration-8 leading-none">
          Visual Intelligence
        </H1>
        <Muted className="max-w-2xl mx-auto text-lg md:text-xl font-bold uppercase tracking-tight leading-tight italic">
          High-fidelity visual reports from the frontier of Liberia&apos;s
          digital transformation.
        </Muted>
      </header>

      {/* Featured Section */}
      {featuredItems.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <FaStar className="text-amber-400 text-sm" />
            <h2 className="text-xs font-black uppercase tracking-widest text-muted">
              Featured Assets
            </h2>
            <div className="flex-1 h-px bg-border/50" />
          </div>
          <div
            className={`grid gap-4 ${
              featuredItems.length === 1
                ? "grid-cols-1"
                : featuredItems.length === 2
                  ? "grid-cols-1 md:grid-cols-2"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {featuredItems.slice(0, 3).map((item) => (
              <FeaturedCard
                key={item.id}
                item={item}
                onClick={handleItemClick}
              />
            ))}
          </div>
        </section>
      )}

      {/* Filter & Search Bar */}
      <section className="mb-10 sticky top-24 z-40 bg-background/90 backdrop-blur-3xl py-5 border-b border-border/50">
        {/* Search */}
        <div className="relative mb-4 max-w-sm">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm" />
          <input
            type="search"
            placeholder="Search gallery..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-3 rounded-2xl bg-surface border border-border/50 focus:border-brand-500 focus:outline-none text-sm font-bold text-text placeholder-muted transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text"
            >
              <FaTimes className="text-sm" />
            </button>
          )}
        </div>

        {/* Filter pills row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Media type */}
          <FilterPill
            active={mediaType === "all"}
            onClick={() => setMediaType("all")}
          >
            <FaLayerGroup /> All
          </FilterPill>
          <FilterPill
            active={mediaType === "image"}
            onClick={() => setMediaType("image")}
          >
            <FaImages /> Images
          </FilterPill>
          <FilterPill
            active={mediaType === "video"}
            onClick={() => setMediaType("video")}
          >
            <FaVideo /> Videos
          </FilterPill>

          {/* Divider */}
          {(categories.length > 0 || events.length > 0) && (
            <div className="h-5 w-px bg-border/50 mx-1 hidden sm:block" />
          )}

          {/* Event filters */}
          {events.slice(0, 3).map((event) => (
            <FilterPill
              key={event.slug}
              active={filter === `event:${event.slug}`}
              onClick={() =>
                setFilter(
                  filter === `event:${event.slug}`
                    ? "all"
                    : `event:${event.slug}`,
                )
              }
            >
              {event.title}
            </FilterPill>
          ))}

          {/* Category filters */}
          {categories.map((category) => (
            <FilterPill
              key={category}
              active={filter === `category:${category}`}
              onClick={() =>
                setFilter(
                  filter === `category:${category}`
                    ? "all"
                    : `category:${category}`,
                )
              }
            >
              {category}
            </FilterPill>
          ))}
        </div>

        {/* Result count */}
        <p className="text-[10px] font-black uppercase tracking-widest text-muted mt-3">
          {filteredItems.length} asset{filteredItems.length !== 1 ? "s" : ""}{" "}
          found
        </p>
      </section>

      {/* Gallery Grid */}
      <MotionGrid className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <MotionItem key={item.id}>
              <GalleryItem item={item} onClick={handleItemClick} />
            </MotionItem>
          ))
        ) : (
          <div className="col-span-full py-32 text-center rounded-3xl border-2 border-dashed border-border/50">
            <FaImages className="text-6xl text-muted/20 mx-auto mb-6" />
            <Muted className="font-black uppercase tracking-widest">
              {searchQuery
                ? `No results for "${searchQuery}"`
                : "No assets matching requirements."}
            </Muted>
          </div>
        )}
      </MotionGrid>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          items={items}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNext={() => setLightboxIndex((prev) => (prev + 1) % items.length)}
          onPrevious={() =>
            setLightboxIndex((prev) => (prev - 1 + items.length) % items.length)
          }
        />
      )}
    </div>
  );
}
