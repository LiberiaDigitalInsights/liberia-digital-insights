import React from 'react';

export default function AdSlot({ position = 'inline', className = '' }) {
  const [ads, setAds] = React.useState([]);
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [fadeOn, setFadeOn] = React.useState(true);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('ads_list');
      if (saved) {
        const list = JSON.parse(saved) || [];
        setAds(list);
      }
    } catch {
      setAds([]);
    }
  }, []);

  const visible = ads.filter((a) => a && a.status === 'published' && a.position === position);

  // Auto-rotate when multiple ads available
  React.useEffect(() => {
    if (visible.length <= 1 || paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % visible.length);
    }, 9000);
    return () => clearInterval(id);
  }, [visible.length, paused]);

  // Reset index if visible set changes
  React.useEffect(() => {
    setIndex(0);
  }, [position, ads.length]);

  const onEnter = () => setPaused(true);
  const onLeave = () => setPaused(false);
  // Trigger fade on index change
  React.useEffect(() => {
    setFadeOn(false);
    const t = setTimeout(() => setFadeOn(true), 20);
    return () => clearTimeout(t);
  }, [index]);

  if (visible.length === 0) return null;

  // Hero (navbar) slot: fixed height; parent controls exact width
  if (position === 'hero') {
    const ad = visible[index] || visible[0];
    return (
      <div
        className={`w-full overflow-hidden ${className}`}
        style={{ display: 'flex', justifyContent: 'flex-end' }}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
        <a
          href={ad.link || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 w-full items-center justify-center"
          style={{ opacity: fadeOn ? 1 : 0, transition: 'opacity 700ms ease-in-out' }}
        >
          {ad.image ? (
            <img
              src={ad.image}
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
    <div className={className} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <div className={wrapperClass} style={{ opacity: fadeOn ? 1 : 0, transition: 'opacity 700ms ease-in-out' }}>
        <a
          key={current.id}
          href={current.link || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="group block overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[color-mix(in_oklab,var(--color-surface),white_4%)]"
        >
          {current.image ? (
            <img
              src={current.image}
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
