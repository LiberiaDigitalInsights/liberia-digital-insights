# Podcast System

## 🎙️ Overview

The Podcast System provides comprehensive functionality for managing audio content, including podcast episodes, show notes, transcripts, and audio streaming. It supports both on-demand and live podcast content for Liberia's digital community.

## ✨ Key Features

- **Audio Management**: Upload, process, and stream podcast episodes
- **Show Notes**: Rich text content with transcripts and show information
- **Guest Management**: Feature guest information and bios
- **Audio Player**: Custom audio player with playback controls
- **Transcription**: Automatic and manual transcription support
- **Analytics**: Track listening statistics and engagement
- **RSS Feeds**: Generate RSS feeds for podcast platforms

## 🏗️ Architecture

### Frontend Components

```
src/components/podcasts/
├── PodcastCard.jsx        # Podcast preview component
├── PodcastDetail.jsx      # Full podcast view
├── PodcastPlayer.jsx      # Audio player component
├── PodcastForm.jsx        # Podcast creation/editing form
├── PodcastTranscript.jsx  # Transcript display
├── PodcastAnalytics.jsx   # Podcast analytics dashboard
└── GuestProfile.jsx       # Guest profile component
```

### Backend API

```
backend/src/routes/podcasts.js  # Podcast CRUD operations
```

## 📝 Podcast Structure

```javascript
{
  id: "uuid",
  title: "Tech Talk Episode 12",
  slug: "tech-talk-episode-12",
  description: "Interview with local tech entrepreneur...",
  content: "Full show notes and transcript...",
  audio_url: "https://example.com/audio.mp3",
  audio_file_size: "45MB",
  duration: "45:30", // MM:SS format
  episode_number: 12,
  season_number: 1,
  guests: [
    {
      name: "Jane Doe",
      title: "CEO at TechStart",
      company: "TechStart Liberia",
      avatar: "https://example.com/avatar.jpg",
      bio: "Tech entrepreneur with 10+ years experience..."
    }
  ],
  host: "John Smith",
  status: "published", // draft, published, archived
  featured: false,
  tags: ["tech", "entrepreneurship", "innovation"],
  download_count: 1250,
  play_count: 5000,
  created_at: "2024-01-01T00:00:00Z",
  published_at: "2024-01-01T00:00:00Z"
}
```

## 🎵 Audio Player

### Custom Audio Player Component

```jsx
// PodcastPlayer.jsx
import { useState, useRef, useEffect } from 'react';

function PodcastPlayer({ podcast, autoPlay = false }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    const newTime = (e.target.value / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handlePlaybackRateChange = (rate) => {
    const audio = audioRef.current;
    audio.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const handleVolumeChange = (newVolume) => {
    const audio = audioRef.current;
    audio.volume = newVolume;
    setVolume(newVolume);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <audio
        ref={audioRef}
        src={podcast.audio_url}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg">{podcast.title}</h3>
          <p className="text-gray-600">{podcast.description}</p>
          {podcast.guests && podcast.guests.length > 0 && (
            <p className="text-sm text-gray-500">
              Guest: {podcast.guests.map((g) => g.name).join(', ')}
            </p>
          )}
        </div>

        <div className="text-right">
          <div className="text-sm text-gray-500">{formatTime(currentTime)}</div>
          <div className="text-sm text-gray-500">{formatTime(duration)}</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="bg-gray-200 rounded-full h-2">
          <div
            className="bg-brand-500 h-2 rounded-full transition-all duration-100"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={progressPercent}
          onChange={handleSeek}
          className="w-full mt-2"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={togglePlay}
            className="bg-brand-500 text-white p-3 rounded-full hover:bg-brand-600 transition-colors"
          >
            {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
          </button>

          <div className="flex items-center space-x-2">
            <VolumeIcon className="w-4 h-4 text-gray-500" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-20"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={playbackRate}
            onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="0.5">0.5x</option>
            <option value="0.75">0.75x</option>
            <option value="1">1x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>

          <button
            onClick={() => {
              const audio = audioRef.current;
              if (audio) {
                audio.currentTime = Math.max(0, currentTime - 15);
              }
            }}
            className="p-2 text-gray-600 hover:text-gray-800"
          >
            <RewindIcon className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              const audio = audioRef.current;
              if (audio) {
                audio.currentTime = Math.min(duration, currentTime + 15);
              }
            }}
            className="p-2 text-gray-600 hover:text-gray-800"
          >
            <FastForwardIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
```

## 📋 Podcast Management

### Podcast Creation Form

```jsx
// PodcastForm.jsx
function PodcastForm({ podcast, onSave, onCancel }) {
  const [formData, setFormData] = useState(
    podcast || {
      title: '',
      description: '',
      content: '',
      episode_number: '',
      season_number: '',
      guests: [],
      tags: [],
      status: 'draft',
    },
  );

  const [audioFile, setAudioFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleAudioUpload = async (file) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('audio', file);

      const response = await fetch('/api/upload/audio', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setFormData((prev) => ({ ...prev, audio_url: result.url }));
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Episode Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Episode Number</label>
          <input
            type="number"
            value={formData.episode_number}
            onChange={(e) => setFormData({ ...formData, episode_number: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Season Number</label>
          <input
            type="number"
            value={formData.season_number}
            onChange={(e) => setFormData({ ...formData, season_number: e.target.value })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description *</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Audio File *</label>
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => handleAudioUpload(e.target.files[0])}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          required={!podcast}
        />
        {isUploading && <p className="text-sm text-gray-500 mt-1">Uploading audio...</p>}
        {formData.audio_url && (
          <p className="text-sm text-green-600 mt-1">Audio uploaded successfully</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Show Notes / Transcript</label>
        <RichTextEditor
          value={formData.content}
          onChange={(value) => setFormData({ ...formData, content: value })}
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600"
        >
          Save Podcast
        </button>
      </div>
    </form>
  );
}
```

## 🎤 Guest Management

### Guest Profile Component

```jsx
// GuestProfile.jsx
function GuestProfile({ guest }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-start space-x-4">
        <img
          src={guest.avatar || '/default-avatar.png'}
          alt={guest.name}
          className="w-16 h-16 rounded-full object-cover"
        />

        <div className="flex-1">
          <h3 className="text-lg font-semibold">{guest.name}</h3>
          <p className="text-gray-600">{guest.title}</p>
          <p className="text-gray-500">{guest.company}</p>

          {guest.bio && (
            <div className="mt-3">
              <p className="text-sm text-gray-700">{guest.bio}</p>
            </div>
          )}

          {guest.social_links && (
            <div className="mt-3 flex space-x-3">
              {guest.social_links.twitter && (
                <a
                  href={guest.social_links.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600"
                >
                  Twitter
                </a>
              )}
              {guest.social_links.linkedin && (
                <a
                  href={guest.social_links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:text-blue-800"
                >
                  LinkedIn
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

## 📊 Podcast Analytics

### Key Metrics

- **Play Count**: Total number of plays
- **Unique Listeners**: Number of unique listeners
- **Completion Rate**: Percentage of listeners who complete the episode
- **Engagement Time**: Average listening duration
- **Downloads**: Number of episode downloads
- **Geographic Distribution**: Where listeners are located

### Analytics Dashboard

```jsx
// PodcastAnalytics.jsx
function PodcastAnalytics({ podcastId }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPodcastAnalytics(podcastId).then((data) => {
      setAnalytics(data);
      setLoading(false);
    });
  }, [podcastId]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Plays</h3>
          <p className="text-2xl font-bold text-gray-900">{analytics.total_plays}</p>
          <p className="text-sm text-green-600">+15% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Unique Listeners</h3>
          <p className="text-2xl font-bold text-gray-900">{analytics.unique_listeners}</p>
          <p className="text-sm text-blue-600">Above average</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Completion Rate</h3>
          <p className="text-2xl font-bold text-gray-900">{analytics.completion_rate}%</p>
          <p className="text-sm text-green-600">Excellent</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Avg. Duration</h3>
          <p className="text-2xl font-bold text-gray-900">{analytics.avg_duration}</p>
          <p className="text-sm text-gray-600">minutes</p>
        </div>
      </div>

      {/* Additional analytics charts and data */}
    </div>
  );
}
```

## 📡 RSS Feed Generation

### RSS Feed Structure

```javascript
// Generate RSS feed for podcast platforms
const generateRSSFeed = async (podcasts) => {
  const rssItems = podcasts
    .map(
      (podcast) => `
    <item>
      <title>${podcast.title}</title>
      <description><![CDATA[${podcast.description}]]></description>
      <link>${process.env.APP_URL}/podcast/${podcast.slug}</link>
      <guid isPermaLink="false">${podcast.id}</guid>
      <pubDate>${new Date(podcast.published_at).toUTCString()}</pubDate>
      <enclosure url="${podcast.audio_url}" type="audio/mpeg" length="${podcast.audio_file_size}" />
      <itunes:duration>${podcast.duration}</itunes:duration>
      <itunes:author>${podcast.host}</itunes:author>
      ${podcast.guests.map((guest) => `<itunes:author>${guest.name}</itunes:author>`).join('')}
    </item>
  `,
    )
    .join('');

  const rssFeed = `
    <?xml version="1.0" encoding="UTF-8"?>
    <rss xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" version="2.0">
      <channel>
        <title>Liberia Digital Insights Podcast</title>
        <link>${process.env.APP_URL}</link>
        <description>Technology insights and innovation from Liberia's digital ecosystem</description>
        <language>en-us</language>
        <itunes:author>Liberia Digital Insights</itunes:author>
        <itunes:summary>Technology insights and innovation from Liberia's digital ecosystem</itunes:summary>
        <itunes:owner>
          <itunes:name>Liberia Digital Insights</itunes:name>
          <itunes:email>info@liberiadigitalinsights.com</itunes:email>
        </itunes:owner>
        <itunes:image href="${process.env.APP_URL}/podcast-cover.jpg" />
        <itunes:category text="Technology">
          <itunes:category text="Tech News" />
        </itunes:category>
        ${rssItems}
      </channel>
    </rss>
  `;

  return rssFeed;
};
```

## 🎨 Podcast Display

### Podcast Card Component

```jsx
// PodcastCard.jsx
function PodcastCard({ podcast }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-brand-100 text-brand-700 px-3 py-1 rounded-full text-sm">
              Episode {podcast.episode_number}
            </div>

            {podcast.featured && (
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                Featured
              </span>
            )}
          </div>

          <div className="text-sm text-gray-500">{podcast.duration}</div>
        </div>

        <h3 className="text-xl font-bold mb-2">
          <Link to={`/podcast/${podcast.slug}`} className="hover:text-brand-500">
            {podcast.title}
          </Link>
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-2">{podcast.description}</p>

        {podcast.guests && podcast.guests.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-500">Guest(s):</p>
            <div className="flex flex-wrap gap-2">
              {podcast.guests.map((guest, index) => (
                <span key={index} className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {guest.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>{podcast.play_count} plays</span>
            <span>{podcast.download_count} downloads</span>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? 'Pause' : 'Play'}
            </Button>

            <Button variant="outline" size="sm" as={Link} to={`/podcast/${podcast.slug}`}>
              Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## 🔧 API Integration

### Podcast Hooks

```javascript
// hooks/usePodcasts.js
export const usePodcasts = () => {
  return {
    // Get all podcasts
    getAll: async (params = {}) => {
      const response = await apiRequest(`/v1/podcasts?${queryParams.toString()}`);
      return response;
    },

    // Get single podcast
    getById: async (id) => {
      return await apiRequest(`/v1/podcasts/${id}`);
    },

    // Create podcast
    create: async (podcastData) => {
      return await apiRequest('/v1/podcasts', {
        method: 'POST',
        body: JSON.stringify(podcastData),
      });
    },

    // Update podcast
    update: async (id, podcastData) => {
      return await apiRequest(`/v1/podcasts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(podcastData),
      });
    },

    // Delete podcast
    delete: async (id) => {
      await apiRequest(`/v1/podcasts/${id}`, {
        method: 'DELETE',
      });
    },

    // Get podcast analytics
    getAnalytics: async (podcastId) => {
      return await apiRequest(`/v1/podcasts/${podcastId}/analytics`);
    },

    // Increment play count
    incrementPlayCount: async (podcastId) => {
      return await apiRequest(`/v1/podcasts/${podcastId}/play`, {
        method: 'POST',
      });
    },

    // Increment download count
    incrementDownloadCount: async (podcastId) => {
      return await apiRequest(`/v1/podcasts/${podcastId}/download`, {
        method: 'POST',
      });
    },
  };
};
```

## 🎧 Audio Processing

### Audio Upload and Processing

```javascript
// Audio processing service
const processAudioUpload = async (file) => {
  // Validate file type and size
  const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/m4a'];
  const maxSize = 100 * 1024 * 1024; // 100MB

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid audio file type');
  }

  if (file.size > maxSize) {
    throw new Error('File too large');
  }

  // Upload to storage
  const formData = new FormData();
  formData.append('audio', file);

  const response = await fetch('/api/upload/audio', {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();

  // Process audio (generate waveform, extract metadata)
  await processAudioMetadata(result.url);

  return result;
};
```

## 📋 Best Practices

### Content Creation

1. **Audio Quality**: Use high-quality microphones and recording equipment
2. **Content Structure**: Plan episodes with clear segments and timing
3. **Guest Preparation**: Send questions and topics to guests in advance
4. **Show Notes**: Provide comprehensive show notes with links and resources
5. **Transcription**: Include transcripts for accessibility

### Technical Standards

1. **Audio Format**: Use MP3 or AAC for compatibility
2. **Bitrate**: 128-192 kbps for good quality and reasonable file size
3. **File Size**: Keep episodes under 100MB for easy downloading
4. **Metadata**: Include proper ID3 tags with episode information
5. **Cover Art**: Use square images (1400x1400px minimum)

This Podcast System provides comprehensive functionality for creating, managing, and distributing audio content for Liberia's digital community.
