/**
 * Video utility functions for handling different video formats and platforms
 */

/**
 * Check if a URL is a YouTube video
 * @param {string} url - The URL to check
 * @returns {boolean} - True if it's a YouTube video
 */
export const isYouTube = (url) => {
  if (!url || typeof url !== 'string') return false;

  const youtubePatterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/embed\/([^&]+)/,
    /youtu\.be\/([^&]+)/,
    /youtube\.com\/v\/([^&]+)/,
    /youtube\.com\/shorts\/([^&]+)/,
  ];

  return youtubePatterns.some((pattern) => pattern.test(url));
};

/**
 * Extract YouTube video ID from URL
 * @param {string} url - The YouTube URL
 * @returns {string|null} - The video ID or null if not found
 */
export const getYouTubeId = (url) => {
  if (!url || typeof url !== 'string') return null;

  const patterns = [
    { regex: /youtube\.com\/watch\?v=([^&]+)/, group: 1 },
    { regex: /youtube\.com\/embed\/([^&]+)/, group: 1 },
    { regex: /youtu\.be\/([^&]+)/, group: 1 },
    { regex: /youtube\.com\/v\/([^&]+)/, group: 1 },
    { regex: /youtube\.com\/shorts\/([^&]+)/, group: 1 },
  ];

  for (const { regex, group } of patterns) {
    const match = url.match(regex);
    if (match) return match[group];
  }
  return null;
};

/**
 * Check if a URL is a Vimeo video
 * @param {string} url - The URL to check
 * @returns {boolean} - True if it's a Vimeo video
 */
export const isVimeo = (url) => {
  if (!url || typeof url !== 'string') return false;

  const vimeoPatterns = [/vimeo\.com\/(\d+)/, /player\.vimeo\.com\/video\/(\d+)/];

  return vimeoPatterns.some((pattern) => pattern.test(url));
};

/**
 * Extract Vimeo video ID from URL
 * @param {string} url - The Vimeo URL
 * @returns {string|null} - The video ID or null if not found
 */
export const getVimeoId = (url) => {
  if (!url || typeof url !== 'string') return null;

  const patterns = [
    { regex: /vimeo\.com\/(\d+)/, group: 1 },
    { regex: /player\.vimeo\.com\/video\/(\d+)/, group: 1 },
  ];

  for (const { regex, group } of patterns) {
    const match = url.match(regex);
    if (match) return match[group];
  }
  return null;
};

/**
 * Check if a URL is a direct video file
 * @param {string} url - The URL to check
 * @returns {boolean} - True if it's a direct video file
 */
export const isDirectVideo = (url) => {
  if (!url || typeof url !== 'string') return false;

  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv', '.flv', '.wmv'];
  const lowerUrl = url.toLowerCase();

  return videoExtensions.some((ext) => lowerUrl.includes(ext));
};

/**
 * Get video type from URL
 * @param {string} url - The URL to check
 * @returns {string} - The video type ('youtube', 'vimeo', 'direct', 'unknown')
 */
export const getVideoType = (url) => {
  if (!url || typeof url !== 'string') return 'unknown';

  if (isYouTube(url)) return 'youtube';
  if (isVimeo(url)) return 'vimeo';
  if (isDirectVideo(url)) return 'direct';

  return 'unknown';
};

/**
 * Get embed URL for different video platforms
 * @param {string} url - The original video URL
 * @param {Object} options - Embed options
 * @returns {string|null} - The embed URL or null if not supported
 */
export const getEmbedUrl = (url, options = {}) => {
  const videoType = getVideoType(url);

  switch (videoType) {
    case 'youtube': {
      const videoId = getYouTubeId(url);
      if (!videoId) return null;

      const params = new URLSearchParams({
        rel: '0',
        modestbranding: '1',
        playsinline: '1',
        ...options,
      });

      return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
    }

    case 'vimeo': {
      const videoId = getVimeoId(url);
      if (!videoId) return null;

      const params = new URLSearchParams({
        autoplay: '0',
        byline: '0',
        portrait: '0',
        title: '0',
        ...options,
      });

      return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
    }

    case 'direct':
      return url;

    default:
      return null;
  }
};

/**
 * Get video thumbnail URL
 * @param {string} url - The video URL
 * @returns {string|null} - The thumbnail URL or null if not available
 */
export const getVideoThumbnail = (url) => {
  const videoType = getVideoType(url);

  switch (videoType) {
    case 'youtube': {
      const videoId = getYouTubeId(url);
      if (!videoId) return null;
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }

    case 'vimeo': {
      const videoId = getVimeoId(url);
      if (!videoId) return null;
      // Vimeo requires API call to get thumbnail, return null for now
      return null;
    }

    default:
      return null;
  }
};
