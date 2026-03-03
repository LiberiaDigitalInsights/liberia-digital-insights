"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaExpand,
  FaCompress,
} from "react-icons/fa";
import {
  getYouTubeId,
  getVimeoId,
  getEmbedUrl,
  getVideoType,
  getVideoThumbnail,
} from "@/lib/videoUtils";
import { cn } from "@/lib/cn";

export default function VideoPlayer({ url, title, thumbnail, className }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const videoType = getVideoType(url);
  const effectiveThumbnail = thumbnail || getVideoThumbnail(url);

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

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange,
      );
    };
  }, []);

  if (videoType === "youtube" || videoType === "vimeo") {
    return (
      <div
        className={cn(
          "relative aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl border border-border/50",
          className,
        )}
      >
        <iframe
          src={getEmbedUrl(url)}
          title={title || "Video player"}
          className="absolute inset-0 w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    );
  }

  if (videoType === "unknown") {
    return (
      <div
        className={cn(
          "aspect-video rounded-3xl bg-surface border border-dashed border-border flex items-center justify-center p-8 text-center",
          className,
        )}
      >
        <div className="space-y-2">
          <p className="font-black uppercase tracking-widest text-rose-500">
            Unrecognized Format
          </p>
          <p className="text-xs text-muted font-medium break-all max-w-xs">
            {url}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative aspect-video rounded-3xl overflow-hidden bg-black group shadow-2xl border border-border/50",
        className,
      )}
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

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
        <button
          onClick={togglePlayPause}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-brand-500/20 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white transition-all duration-300 hover:bg-brand-500/40 hover:scale-110 pointer-events-auto shadow-2xl"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <FaPause className="w-6 h-6" />
          ) : (
            <FaPlay className="w-6 h-6 ml-1" />
          )}
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-between pointer-events-auto">
          <button
            onClick={toggleMute}
            className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white transition-all duration-300 hover:bg-white/20"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <FaVolumeMute className="w-5 h-5" />
            ) : (
              <FaVolumeUp className="w-5 h-5" />
            )}
          </button>

          <button
            onClick={toggleFullscreen}
            className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white transition-all duration-300 hover:bg-white/20"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <FaCompress className="w-5 h-5" />
            ) : (
              <FaExpand className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-[.loading]:opacity-100 transition-opacity">
        <div className="w-10 h-10 border-4 border-white/20 border-t-brand-500 rounded-full animate-spin" />
      </div>
    </div>
  );
}
