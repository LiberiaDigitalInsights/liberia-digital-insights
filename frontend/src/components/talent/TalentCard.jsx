import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Muted } from '../ui/Typography';
import Badge from '../ui/Badge';

export default function TalentCard({ name, role, bio, links, category }) {
  return (
    <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-3">
          <span className="truncate">{name}</span>
          {category && (
            <Badge variant="subtle" className="shrink-0">
              {category}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {role && (
          <div className="text-sm text-[var(--color-text)]">
            <Badge variant="outline" className="mr-2">
              {role}
            </Badge>
          </div>
        )}
        <Muted className="text-sm">{bio}</Muted>
        {links && (
          <div className="flex flex-wrap gap-3 text-sm">
            {Object.entries(links).map(([key, url]) => (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="text-brand-500 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-[var(--radius-sm)]"
              >
                {key}
              </a>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
