import React from 'react';
import { Link } from 'react-router-dom';
import { H1, H2, Muted } from '../components/ui/Typography';
import Button from '../components/ui/Button';
import SEO from '../components/SEO';
import { FaHome, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';

export default function NotFound() {
  return (
    <>
      <SEO title="404 - Page Not Found | Liberia Digital Insights" />
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-12 text-center">
      <div className="mb-6 flex justify-center">
        <div className="rounded-full bg-red-500/10 p-6">
          <FaExclamationTriangle className="h-16 w-16 text-red-500" />
        </div>
      </div>
      <H1 className="mb-4 text-6xl font-bold">404</H1>
      <H2 className="mb-4 text-2xl font-semibold">Page Not Found</H2>
      <Muted className="mb-8 text-lg">
        The page you're looking for doesn't exist or has been moved. Let's get you back on track.
      </Muted>
      <div className="flex flex-wrap justify-center gap-4">
        <Button as={Link} to="/" leftIcon={<FaHome />}>
          Go Home
        </Button>
        <Button variant="outline" onClick={() => window.history.back()} leftIcon={<FaArrowLeft />}>
          Go Back
        </Button>
      </div>
    </div>
    </>
  );
}
