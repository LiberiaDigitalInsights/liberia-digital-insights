import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Button from '../ui/Button';

export default function PodcastWidget({ podcasts = [], loading = false }) {
  const latestPodcast = podcasts[0];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Liberia Digital Insights Podcast</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
          <Button variant="outline" className="w-full" disabled>
            Loading...
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liberia Digital Insights Podcast</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {latestPodcast ? (
          <div className="space-y-1">
            <div className="text-sm font-medium">
              EP.{latestPodcast.episode_number} {latestPodcast.title}
            </div>
            <div className="text-xs text-[var(--color-muted)]">
              {new Date(latestPodcast.published_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
              , Liberia Digital Insights Podcast
            </div>
            <div className="text-xs text-[var(--color-muted)]">{latestPodcast.duration}</div>
          </div>
        ) : (
          <div className="text-sm text-[var(--color-muted)] text-center py-2">
            No podcasts available
          </div>
        )}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => latestPodcast?.audio_url && window.open(latestPodcast.audio_url, '_blank')}
          disabled={!latestPodcast}
        >
          {latestPodcast ? 'Listen' : 'Not Available'}
        </Button>
      </CardContent>
    </Card>
  );
}
