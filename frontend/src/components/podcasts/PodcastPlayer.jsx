import React from 'react';
import { Card, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { FaPlay, FaPause } from 'react-icons/fa';

export default function PodcastPlayer({
  title,
  description,
  duration,
  audioUrl,
  image,
  date,
  guest,
}) {
  const [playing, setPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const audioRef = React.useRef(null);

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', () => setPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', () => setPlaying(false));
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardContent className="p-6">
        {image && (
          <div className="mb-4 aspect-video overflow-hidden rounded-[var(--radius-md)] bg-[color-mix(in_oklab,var(--color-surface),white_6%)]">
            <img src={image} alt={title} className="h-full w-full object-cover" />
          </div>
        )}
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-lg font-semibold">{title}</h3>
            {description && <p className="text-sm text-[var(--color-muted)]">{description}</p>}
            {(guest || date || duration) && (
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-[var(--color-muted)]">
                {guest && <span>{guest}</span>}
                {date && <span>•</span>}
                {date && <span>{date}</span>}
                {duration && <span>•</span>}
                {duration && <span>{duration}</span>}
              </div>
            )}
          </div>

          {/* Audio Player */}
          <div className="space-y-3">
            <audio ref={audioRef} src={audioUrl || undefined} preload="metadata" />
            <div className="flex items-center gap-3">
              <Button
                variant="solid"
                size="lg"
                onClick={togglePlay}
                leftIcon={playing ? <FaPause aria-hidden /> : <FaPlay aria-hidden />}
              >
                {playing ? 'Pause' : 'Play'}
              </Button>
              <div className="flex-1 text-xs text-[var(--color-muted)]">
                {audioRef.current
                  ? `${formatTime(audioRef.current.currentTime)} / ${formatTime(audioRef.current.duration)}`
                  : duration || '0:00'}
              </div>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--color-surface),white_8%)]">
              <div
                className="h-full bg-brand-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
