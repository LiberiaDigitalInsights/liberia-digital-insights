import React from 'react';
import { H1, Muted } from '../components/ui/Typography';

export default function Advertisement() {
  return (
    <div className="mx-auto max-w-6xl p-6 space-y-2">
      <H1>Advertisement</H1>
      <Muted>Media kit and advertising opportunities.</Muted>
    </div>
  );
}
