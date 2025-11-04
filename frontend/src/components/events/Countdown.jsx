import React from 'react';

export default function Countdown({ to }) {
  const [remaining, setRemaining] = React.useState(getRemaining(to));

  React.useEffect(() => {
    const id = setInterval(() => setRemaining(getRemaining(to)), 1000);
    return () => clearInterval(id);
  }, [to]);

  if (!remaining) return null;
  const { days, hours, minutes, seconds, past } = remaining;
  if (past) return null;

  return (
    <div aria-label="countdown" className="inline-flex items-center gap-2 rounded-full bg-[color-mix(in_oklab,var(--color-surface),white_8%)] px-3 py-1 text-xs text-[var(--color-muted)]">
      <span>Starts in:</span>
      <span className="font-medium text-[var(--color-text)]">
        {days}d {hours}h {minutes}m {seconds}s
      </span>
    </div>
  );
}

function getRemaining(to) {
  try {
    const target = new Date(to);
    const now = new Date();
    const diff = target.getTime() - now.getTime();
    if (isNaN(diff)) return null;
    if (diff <= 0) return { past: true };
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { days, hours, minutes, seconds, past: false };
  } catch {
    return null;
  }
}
