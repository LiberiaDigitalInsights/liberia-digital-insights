import React from 'react';
import { useParams } from 'react-router-dom';
import { H1, Muted } from '../components/ui/Typography';

export default function Category() {
  const { slug } = useParams();
  const title = decodeURIComponent(slug || '').replace(/\b\w/g, (c) => c.toUpperCase());
  return (
    <div className="mx-auto max-w-6xl p-6 space-y-2">
      <H1>{title || 'Category'}</H1>
      <Muted>Category listing page placeholder for {title}.</Muted>
    </div>
  );
}
