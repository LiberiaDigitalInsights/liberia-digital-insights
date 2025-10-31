import React from 'react';
import { H1, Muted } from '../components/ui/Typography';

export default function Articles() {
  return (
    <div className="mx-auto max-w-6xl p-6 space-y-2">
      <H1>Articles</H1>
      <Muted>All articles with filters and categories.</Muted>
    </div>
  );
}
