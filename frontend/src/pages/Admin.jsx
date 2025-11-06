import React from 'react';
import SEO from '../components/SEO';
import { H1, Muted } from '../components/ui/Typography';

export default function Admin() {
  return (
    <>
      <SEO title="Admin" />
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <H1 className="mb-4 text-3xl font-bold">Admin</H1>
        <Muted>
          This is a placeholder for the future Admin CMS. Content management features will be added
          here.
        </Muted>
      </div>
    </>
  );
}
