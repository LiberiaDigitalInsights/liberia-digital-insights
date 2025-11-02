import React from 'react';
import { H1 } from '../components/ui/Typography';
import GalleryItem from '../components/gallery/GalleryItem';
import Lightbox from '../components/gallery/Lightbox';
import SEO from '../components/SEO';
import { mockGallery, getAllEvents, getAllCategories } from '../data/mockGallery';

export default function Gallery() {
  const [filter, setFilter] = React.useState('all');
  const [lightboxIndex, setLightboxIndex] = React.useState(null);
  const events = getAllEvents();
  const categories = getAllCategories();

  const filteredItems =
    filter === 'all'
      ? mockGallery
      : filter.startsWith('event:')
        ? mockGallery.filter((item) => item.event === filter.replace('event:', ''))
        : filter.startsWith('category:')
          ? mockGallery.filter((item) => item.category === filter.replace('category:', ''))
          : mockGallery;

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
          All ({mockGallery.length})
        </button>
        {events.map((event) => (
          <button
            key={event}
            onClick={() => setFilter(`event:${event}`)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              filter === `event:${event}`
                ? 'bg-brand-500 text-white'
                : 'bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[color-mix(in_oklab,var(--color-surface),white_8%)]'
            }`}
          >
            {event}
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
            No items found in this filter.
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
