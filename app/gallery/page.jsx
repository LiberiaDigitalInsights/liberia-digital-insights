"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { H1, Muted } from "@/components/ui/Typography";
import GalleryItem from "@/components/gallery/GalleryItem";
import Lightbox from "@/components/gallery/Lightbox";
import { useGallery } from "@/hooks/useGallery";
import { MotionGrid, MotionItem } from "@/components/ui/MotionWrapper";
import { FaFilter, FaImages, FaVideo, FaLayerGroup } from "react-icons/fa";

export default function GalleryPage() {
  const [filter, setFilter] = useState("all");
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

  const filteredItems = useMemo(() => {
    if (filter === "all") return items;
    if (filter.startsWith("event:")) {
      const eventSlug = filter.replace("event:", "");
      return items.filter((item) => item.events?.slug === eventSlug);
    }
    if (filter.startsWith("category:")) {
      const category = filter.replace("category:", "");
      return items.filter((item) => item.category === category);
    }
    return items;
  }, [filter, items]);

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
      <header className="mb-20 text-center relative">
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

      <section className="mb-12 flex flex-wrap items-center justify-center gap-3 md:gap-4 sticky top-24 z-40 bg-background/80 backdrop-blur-3xl py-6 border-b border-border/50">
        <button
          onClick={() => setFilter("all")}
          className={`group flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
            filter === "all"
              ? "bg-brand-500 border-brand-500 text-white shadow-2xl shadow-brand-500/20"
              : "bg-surface border-border hover:border-brand-500/50"
          }`}
        >
          <FaLayerGroup
            className={filter === "all" ? "text-white" : "text-brand-500"}
          />
          All Assets ({items.length})
        </button>

        {events.slice(0, 3).map((event) => (
          <button
            key={event.slug}
            onClick={() => setFilter(`event:${event.slug}`)}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
              filter === `event:${event.slug}`
                ? "bg-brand-500 border-brand-500 text-white shadow-2xl shadow-brand-500/20"
                : "bg-surface border-border hover:border-brand-500/50"
            }`}
          >
            {event.title}
          </button>
        ))}

        <div className="h-4 w-px bg-border/50 mx-2 hidden md:block" />

        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(`category:${category}`)}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
              filter === `category:${category}`
                ? "bg-brand-500 border-brand-500 text-white shadow-2xl shadow-brand-500/20"
                : "bg-surface border-border hover:border-brand-500/50"
            }`}
          >
            {category}
          </button>
        ))}
      </section>

      <MotionGrid className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item, idx) => (
            <MotionItem key={item.id}>
              <GalleryItem
                item={item}
                onClick={() =>
                  setLightboxIndex(items.findIndex((i) => i.id === item.id))
                }
              />
            </MotionItem>
          ))
        ) : (
          <div className="col-span-full py-32 text-center rounded-3xl border-2 border-dashed border-border/50">
            <FaImages className="text-6xl text-muted/20 mx-auto mb-6" />
            <Muted className="font-black uppercase tracking-widest">
              No assets matching requirements.
            </Muted>
          </div>
        )}
      </MotionGrid>

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
