import React, { useState, useRef } from 'react';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaExpand, FaCompress } from 'react-icons/fa';
import {
  getYouTubeId,
  getVimeoId,
  getEmbedUrl,
  getVideoType,
  getVideoThumbnail,
} from '../../utils/videoUtils';

export default function VideoPlayer({ url, title, thumbnail, className }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const videoType = getVideoType(url);
  const effectiveThumbnail = thumbnail || getVideoThumbnail(url);

  // Toggle play/pause for non-YouTube videos
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Toggle mute for non-YouTube videos
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  // Listen for fullscreen changes
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // If it's a YouTube video, render iframe embed
  if (videoType === 'youtube') {
    const videoId = getYouTubeId(url);
    if (!videoId) {
      return (
        <div
          className={`aspect-video rounded-lg bg-gray-900 flex items-center justify-center ${className}`}
        >
          <div className="text-center text-white">
            <p className="text-lg">Invalid YouTube URL</p>
            <p className="text-sm text-gray-400 mt-2">{url}</p>
          </div>
        </div>
      );
    }

    return (
      <div className={`relative aspect-video rounded-lg overflow-hidden bg-black ${className}`}>
        <iframe
          src={getEmbedUrl(url)}
          title={title || 'YouTube video player'}
          className="absolute inset-0 w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    );
  }

  // If it's a Vimeo video, render iframe embed
  if (videoType === 'vimeo') {
    const videoId = getVimeoId(url);
    if (!videoId) {
      return (
        <div
          className={`aspect-video rounded-lg bg-gray-900 flex items-center justify-center ${className}`}
        >
          <div className="text-center text-white">
            <p className="text-lg">Invalid Vimeo URL</p>
            <p className="text-sm text-gray-400 mt-2">{url}</p>
          </div>
        </div>
      );
    }

    return (
      <div className={`relative aspect-video rounded-lg overflow-hidden bg-black ${className}`}>
        <iframe
          src={getEmbedUrl(url)}
          title={title || 'Vimeo video player'}
          className="absolute inset-0 w-full h-full border-0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    );
  }

  // For unsupported video types, show error message
  if (videoType === 'unknown') {
    return (
      <div
        className={`aspect-video rounded-lg bg-gray-900 flex items-center justify-center ${className}`}
      >
        <div className="text-center text-white p-4">
          <p className="text-lg">Unsupported Video Format</p>
          <p className="text-sm text-gray-400 mt-2">This video format is not supported.</p>
          <p className="text-xs text-gray-500 mt-2 truncate max-w-md">{url}</p>
        </div>
      </div>
    );
  }

  // For non-YouTube videos, render HTML5 video player
  return (
    <div
      ref={containerRef}
      className={`relative aspect-video rounded-lg overflow-hidden bg-black group ${className}`}
    >
      <video
        ref={videoRef}
        src={url}
        poster={effectiveThumbnail}
        className="w-full h-full object-contain"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onClick={togglePlayPause}
        playsInline
      >
        Your browser does not support the video tag.
      </video>

      {/* Custom controls overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        {/* Center play/pause button */}
        <button
          onClick={togglePlayPause}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-300 hover:bg-white/30 hover:scale-110 pointer-events-auto"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <FaPause className="w-6 h-6" /> : <FaPlay className="w-6 h-6 ml-1" />}
        </button>

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between pointer-events-auto">
          <button
            onClick={toggleMute}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-300 hover:bg-white/30"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <FaVolumeMute className="w-4 h-4" /> : <FaVolumeUp className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleFullscreen}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-300 hover:bg-white/30"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? <FaCompress className="w-4 h-4" /> : <FaExpand className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Loading indicator */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    </div>
  );
}
