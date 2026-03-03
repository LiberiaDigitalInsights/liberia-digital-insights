import React, { useState, useEffect, useCallback } from 'react';
import { H1 } from '../components/ui/Typography';
import GalleryItem from '../components/gallery/GalleryItem';
import Lightbox from '../components/gallery/Lightbox';
import SEO from '../components/SEO';
import { useGallery } from '../hooks/useGallery';

export default function Gallery() {
  const [filter, setFilter] = useState('all');
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

      // Fetch all data in parallel
      const [itemsData, eventsData, categoriesData] = await Promise.all([
        gallery.getItems(),
        gallery.getEvents(),
        gallery.getCategories(),
      ]);

      // Handle different response structures with better error checking
      setItems(
        Array.isArray(itemsData?.items)
          ? itemsData.items
          : Array.isArray(itemsData)
            ? itemsData
            : [],
      );
      setEvents(Array.isArray(eventsData) ? eventsData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching gallery data:', err);
      setError('Failed to load gallery data');
      // Fallback to empty arrays
      setItems([]);
      setEvents([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [gallery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredItems = React.useMemo(() => {
    if (filter === 'all') return items;

    if (filter.startsWith('event:')) {
      const eventSlug = filter.replace('event:', '');
      return items.filter((item) => item.event_type === 'event' && item.events?.slug === eventSlug);
    }

    if (filter.startsWith('podcast:')) {
      const podcastSlug = filter.replace('podcast:', '');
      return items.filter(
        (item) => item.event_type === 'podcast' && item.podcasts?.slug === podcastSlug,
      );
    }

    if (filter.startsWith('category:')) {
      const category = filter.replace('category:', '');
      return items.filter((item) => item.category === category);
    }

    return items;
  }, [filter, items]);

  const openLightbox = (item) => {
    const index = filteredItems.findIndex((i) => i.id === item.id);
    setLightboxIndex(index);
  };

  const closeLightbox = () => setLightboxIndex(null);

  const nextItem = () => {
    setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % filteredItems.length));
  };

  const previousItem = () => {
    setLightboxIndex((prev) =>
      prev === null ? null : (prev - 1 + filteredItems.length) % filteredItems.length,
    );
  };

  if (loading) {
    return (
      <>
        <SEO />
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-32 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <SEO />
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
          <div className="text-center">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO />
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        {/* Header */}
        <header className="mb-8">
          <H1 className="mb-4 text-3xl font-bold">Gallery</H1>
          <p className="text-lg text-[var(--color-muted)]">
            Photos and videos from our events, interviews, and community gatherings
          </p>
        </header>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              filter === 'all'
                ? 'bg-brand-500 text-white'
                : 'bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[color-mix(in_oklab,var(--color-surface),white_8%)]'
            }`}
          >
            All ({items.length})
          </button>

          {events.map((event) => (
            <button
              key={event.slug}
              onClick={() => setFilter(`event:${event.slug}`)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                filter === `event:${event.slug}`
                  ? 'bg-brand-500 text-white'
                  : 'bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[color-mix(in_oklab,var(--color-surface),white_8%)]'
              }`}
            >
              {event.title}
            </button>
          ))}

          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(`category:${category}`)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                filter === `category:${category}`
                  ? 'bg-brand-500 text-white'
                  : 'bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[color-mix(in_oklab,var(--color-surface),white_8%)]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="mb-6 text-sm text-[var(--color-muted)]">
          Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, idx) => (
              <div
                key={item.id}
                className="opacity-0 animate-slide-up"
                style={{ animationDelay: `${100 + idx * 30}ms` }}
              >
                <GalleryItem item={item} onClick={openLightbox} />
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-[var(--color-muted)]">
              {items.length === 0 ? 'No gallery items yet.' : 'No items found in this filter.'}
            </div>
          )}
        </div>

        {/* Lightbox */}
        {lightboxIndex !== null && (
          <Lightbox
            items={filteredItems}
            currentIndex={lightboxIndex}
            onClose={closeLightbox}
            onNext={nextItem}
            onPrevious={previousItem}
          />
        )}
      </div>
    </>
  );
}
