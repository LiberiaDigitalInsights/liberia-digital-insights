import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Button from '../ui/Button';

export default function PodcastWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Liberia Digital Insights Podcast</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <div className="text-sm font-medium">EP.01 Movement For Tech Liberia</div>
          <div className="text-xs text-[var(--color-muted)]">Jun 18, Liberia Digital Insights Podcast</div>
          <div className="text-xs text-[var(--color-muted)]">41:18</div>
        </div>
        <Button variant="outline" className="w-full">Listen</Button>
      </CardContent>
    </Card>
  );
}

