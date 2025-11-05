import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Muted } from '../ui/Typography';

export default function TalentCard({ name, role, bio, links, category }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{name}</span>
          <span className="text-xs font-medium text-[var(--color-muted)]">{category}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-sm text-[var(--color-text)]">{role}</div>
        <Muted className="text-sm">{bio}</Muted>
        {links && (
          <div className="flex flex-wrap gap-3 text-sm">
            {Object.entries(links).map(([key, url]) => (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="text-brand-500 hover:underline"
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
