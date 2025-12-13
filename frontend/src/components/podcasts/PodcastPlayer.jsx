import React from 'react';
import { Card, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { FaPlay, FaPause } from 'react-icons/fa';
import AudioWaveform from './AudioWaveform';

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
  const [error, setError] = React.useState(null);
  const [extractedUrl, setExtractedUrl] = React.useState(null);
  const [isExtracting, setIsExtracting] = React.useState(false);
  const audioRef = React.useRef(null);

  // Check if URL is a sharing link and extract audio URL
  React.useEffect(() => {
    const extractAudioUrl = async () => {
      if (!audioUrl) return;

      // Check if it's a direct audio file or a sharing link
      // Handle both file extensions and common storage service URLs
      const isDirectAudio = /\.(mp3|wav|m4a|ogg|webm)(\?.*)?$/i.test(audioUrl) ||
        /\/storage\/v1\/object\/public\//i.test(audioUrl) || // Supabase storage
        /\/storage\.googleapis\.com\//i.test(audioUrl) || // Google Cloud Storage
        /\/s3\.amazonaws\.com\//i.test(audioUrl) || // AWS S3
        /\.cloudfront\.net\//i.test(audioUrl) || // CloudFront
        /\/drive\.google\.com\/uc\//i.test(audioUrl); // Google Drive direct download (not sharing)

      if (isDirectAudio) {
        // Use proxy for Google Drive URLs to avoid CORS issues
        if (audioUrl.includes('drive.google.com')) {
          setExtractedUrl(`http://localhost:5000/v1/audio/proxy/${audioUrl}`);
        } else {
          setExtractedUrl(audioUrl);
        }
        return;
      }

      // It's a sharing link, try to extract the audio URL
      setIsExtracting(true);
      setError(null);

      try {
        const response = await fetch('http://localhost:5000/v1/audio/extract', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ shareUrl: audioUrl }),
        });

        const data = await response.json();

        if (response.ok) {
          // Use proxy for extracted Google Drive URLs
          if (data.audioUrl.includes('drive.google.com')) {
            setExtractedUrl(`http://localhost:5000/v1/audio/proxy/${data.audioUrl}`);
          } else {
            setExtractedUrl(data.audioUrl);
          }
        } else {
          throw new Error(data.error || 'Failed to extract audio URL');
        }
      } catch (err) {
        console.error('Audio extraction failed:', err);
        setError('Unable to extract audio from sharing link. Please use external links below.');
      } finally {
        setIsExtracting(false);
      }
    };

    extractAudioUrl();
  }, [audioUrl]);

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const updateTimeDisplay = () => {
      // Force re-render to update waveform currentTime
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('timeupdate', updateTimeDisplay);
    audio.addEventListener('ended', () => setPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('timeupdate', updateTimeDisplay);
      audio.removeEventListener('ended', () => setPlaying(false));
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.pause();
        setPlaying(false);
        setError(null);
      } else {
        setError(null);
        audioRef.current.play().catch((error) => {
          console.error('Audio play error:', error);
          if (error.name === 'NotSupportedError') {
            setError('Audio format not supported. Please use the external links below.');
          } else {
            setError('Unable to play audio. Please try external links.');
          }
          setPlaying(false);
        });
      }
    }
  };

  const handleSeek = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
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
            <audio ref={audioRef} src={extractedUrl || undefined} preload="metadata" />
            {console.log('Audio element src:', extractedUrl)}
            {isExtracting && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-600">Extracting audio from sharing link...</p>
              </div>
            )}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            
            {/* Waveform */}
            {extractedUrl && (
              <AudioWaveform
                audioUrl={extractedUrl}
                currentTime={audioRef.current?.currentTime || 0}
                duration={audioRef.current?.duration || 0}
                onSeek={handleSeek}
              />
            )}
            
            <div className="flex items-center gap-3">
              <Button
                variant="solid"
                size="lg"
                onClick={togglePlay}
                disabled={!extractedUrl || isExtracting}
                leftIcon={playing ? <FaPause aria-hidden /> : <FaPlay aria-hidden />}
              >
                {isExtracting ? 'Loading...' : playing ? 'Pause' : 'Play'}
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
