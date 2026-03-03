"use client";

import React from "react";

export default function Countdown({ to }) {
  const [remaining, setRemaining] = React.useState(null);

  React.useEffect(() => {
    setRemaining(getRemaining(to));
    const id = setInterval(() => setRemaining(getRemaining(to)), 1000);
    return () => clearInterval(id);
  }, [to]);

  if (!remaining) return null;
  const { days, hours, minutes, seconds, past } = remaining;
  if (past) return null;

  return (
    <div
      aria-label="countdown"
      className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-4 py-1.5 text-xs text-brand-600 font-bold"
    >
      <span className="opacity-70 uppercase tracking-wider">Starts in:</span>
      <span className="font-mono">
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
