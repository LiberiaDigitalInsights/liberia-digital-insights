import React from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { H1, Muted } from '../components/ui/Typography';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useTrainingById } from '../hooks/useBackendApi';
import LazyImage from '../components/LazyImage';

export default function TrainingDetail() {
  const { id } = useParams();
  const { data: courseData, loading, error } = useTrainingById(id);

  // Handle different API response structures
  const training = courseData?.course || courseData?.training || courseData;

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
        <div className="text-center">Loading training details...</div>
      </div>
    );
  }

  if (error || !training) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
        <div className="text-center text-red-600">
          {error ? `Error: ${error.message}` : 'Training not found'}
        </div>
      </div>
    );
  }

  // Add debug logging to see what data we're getting
  console.log('Training data:', training);
  console.log('Course data:', courseData);

  // Map backend data to UI format
  const mappedTraining = {
    ...training,
    title: training.title,
    summary: training.description || training.summary || '',
    date: training.startDate || training.date || 'TBD',
    duration: training.duration || 'N/A',
    location: training.location || 'Online',
    modality: training.modality || (training.location === 'Online' ? 'Online' : 'In-person'),
    image: training.coverImage || training.image || '/LDI_favicon.png',
    registrationUrl: training.registrationUrl || '/register',
  };

  return (
    <>
      <SEO
        title={mappedTraining.title}
        description={mappedTraining.summary}
        image={mappedTraining.image}
      />
      <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
        <Link
          to={`/register?type=training&id=${mappedTraining.id}`}
          aria-label={`Register for ${mappedTraining.title}`}
          className="block"
        >
          <div className="mb-6 h-56 w-full overflow-hidden rounded-[var(--radius-lg)] bg-gradient-to-br from-[color-mix(in_oklab,var(--color-surface),white_6%)] to-[color-mix(in_oklab,var(--color-surface),white_14%)] md:h-72">
            <LazyImage
              src={mappedTraining.image}
              alt={mappedTraining.title}
              className="h-full w-full object-cover"
              loading="lazy"
              fetchPriority="low"
              sizes="(min-width: 768px) 720px, 100vw"
            />
          </div>
        </Link>
        <header className="mb-6">
          <H1 className="mb-2 text-3xl font-bold">{mappedTraining.title}</H1>
          <div className="text-sm text-[var(--color-muted)]">
            {mappedTraining.date} • {mappedTraining.duration} • {mappedTraining.location}
          </div>
        </header>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--color-text)]">{mappedTraining.summary}</p>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button as={Link} to={`/register?type=training&id=${mappedTraining.id}`}>
            Register
          </Button>
          <Button as={Link} to="/training-courses" variant="secondary">
            Back to Training & Courses
          </Button>
        </div>
      </div>
    </>
  );
}
