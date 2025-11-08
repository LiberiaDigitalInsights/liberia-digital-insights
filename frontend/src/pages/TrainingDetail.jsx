import React from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { H1, Muted } from '../components/ui/Typography';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { mockTrainings } from '../data/mockTraining';
import LazyImage from '../components/LazyImage';

export default function TrainingDetail() {
  const { id } = useParams();
  const training = mockTrainings.find((t) => t.id === Number(id)) || mockTrainings[0];

  if (!training) return null;

  return (
    <>
      <SEO title={training.title} description={training.summary} image={training.image} />
      <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
        <Link
          to={`/register?type=training&id=${training.id}`}
          aria-label={`Register for ${training.title}`}
          className="block"
        >
          <div className="mb-6 h-56 w-full overflow-hidden rounded-[var(--radius-lg)] bg-gradient-to-br from-[color-mix(in_oklab,var(--color-surface),white_6%)] to-[color-mix(in_oklab,var(--color-surface),white_14%)] md:h-72">
            <LazyImage
              src={training.image}
              alt={training.title}
              className="h-full w-full object-cover"
              loading="lazy"
              fetchPriority="low"
              sizes="(min-width: 768px) 720px, 100vw"
            />
          </div>
        </Link>
        <header className="mb-6">
          <H1 className="mb-2 text-3xl font-bold">{training.title}</H1>
          <div className="text-sm text-[var(--color-muted)]">
            {training.date} • {training.duration} • {training.location}
          </div>
        </header>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--color-text)]">{training.summary}</p>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button as={Link} to={`/register?type=training&id=${training.id}`}>
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
