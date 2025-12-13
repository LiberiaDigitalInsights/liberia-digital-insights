import React from 'react';
import { useAdvertisements } from '../../hooks/useBackendApi';

export default function AdSlot({ position = 'inline', className = '', rotateSeconds = 9 }) {
  const { data: advertisementsData, loading } = useAdvertisements({ status: 'active' });
  const advertisements = advertisementsData?.advertisements || [];
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [fadeOn, setFadeOn] = React.useState(true);
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const containerRef = React.useRef(null);
  const [inView, setInView] = React.useState(true);
  const elapsedRef = React.useRef(0);

  // Map advertisement type to position
  const positionMap = {
    hero: 'banner',
    sidebar: 'sidebar',
    inline: 'featured',
  };

  const visible = advertisements.filter((ad) => {
    const adType = ad.type || 'banner';
    const mappedPosition = positionMap[position] || position;
    return ad.status === 'active' && adType === mappedPosition;
  });

  // Auto-rotate based on visibility time (not wall time)
  React.useEffect(() => {
    if (visible.length <= 1) return;
    let effective = rotateSeconds;
    try {
      const g = Number(localStorage.getItem('ads_rotate_seconds'));
      if (!Number.isNaN(g) && g > 0) effective = g;
    } catch {
      /* empty */
    }
    const tickMs = 250;
    const id = setInterval(() => {
      if (paused || reducedMotion || document.visibilityState !== 'visible' || !inView) {
        return;
      }
      const next = elapsedRef.current + tickMs / 1000;
      if (next >= effective) {
        setIndex((i) => (i + 1) % visible.length);
        elapsedRef.current = 0;
      } else {
        elapsedRef.current = next;
      }
    }, tickMs);
    return () => clearInterval(id);
  }, [visible.length, paused, reducedMotion, inView, rotateSeconds]);

  // Respect reduced motion and page visibility
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReducedMotion(!!mq.matches);
    apply();
    mq.addEventListener?.('change', apply);
    const onVis = () => {
      // restart fade on visibility regain
      setFadeOn(true);
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      mq.removeEventListener?.('change', apply);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  // Observe slot visibility in viewport
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        setInView((e?.intersectionRatio || 0) >= 0.5);
      },
      { threshold: [0, 0.5, 1] },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Reset index if visible set changes
  React.useEffect(() => {
    setIndex(0);
  }, [position, advertisements.length]);

  const onEnter = () => setPaused(true);
  const onLeave = () => setPaused(false);
  // Trigger fade on index change
  React.useEffect(() => {
    if (reducedMotion) return;
    setFadeOn(false);
    const t = setTimeout(() => setFadeOn(true), 20);
    return () => clearTimeout(t);
  }, [index, reducedMotion]);

  if (loading || visible.length === 0) return null;

  // Hero (navbar) slot: fixed height; parent controls exact width
  if (position === 'hero') {
    const ad = visible[index] || visible[0];
    return (
      <div
        className={`w-full overflow-hidden ${className}`}
        style={{ display: 'flex', justifyContent: 'flex-end' }}
        ref={containerRef}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
        <a
          href={ad.target_url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 w-full items-center justify-center"
          style={{
            opacity: fadeOn || reducedMotion ? 1 : 0,
            transition: reducedMotion ? 'none' : 'opacity 700ms ease-in-out',
          }}
        >
          {ad.image_url ? (
            <img
              src={ad.image_url}
              alt={ad.title || 'Advertisement'}
              className="h-full max-h-full w-auto object-contain"
            />
          ) : null}
        </a>
      </div>
    );
  }

  // Sidebar or inline grids
  const wrapperClass = 'block';
  const current = visible[index] || visible[0];

  return (
    <div ref={containerRef} className={className} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <div
        className={wrapperClass}
        style={{
          opacity: fadeOn || reducedMotion ? 1 : 0,
          transition: reducedMotion ? 'none' : 'opacity 700ms ease-in-out',
        }}
      >
        <a
          key={current.id}
          href={current.target_url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="group block overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[color-mix(in_oklab,var(--color-surface),white_4%)]"
        >
          {current.image_url ? (
            <img
              src={current.image_url}
              alt={current.title || 'Advertisement'}
              className={`w-full ${position === 'sidebar' ? 'h-40 object-cover' : 'h-40 object-cover'}`}
            />
          ) : null}
          {current.title ? (
            <div className="p-3 text-sm font-medium group-hover:underline">{current.title}</div>
          ) : null}
        </a>
      </div>
    </div>
  );
}
