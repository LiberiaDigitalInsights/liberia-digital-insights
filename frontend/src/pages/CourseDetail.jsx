import React from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { H1 } from '../components/ui/Typography';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { mockCourses } from '../data/mockTraining';
import LazyImage from '../components/LazyImage';

export default function CourseDetail() {
  const { id } = useParams();
  const course = mockCourses.find((c) => c.id === Number(id)) || mockCourses[0];

  if (!course) return null;

  return (
    <>
      <SEO title={course.title} description={course.summary} image={course.image} />
      <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
        <Link
          to={`/register?type=course&id=${course.id}`}
          aria-label={`Register for ${course.title}`}
          className="block"
        >
          <div className="mb-6 h-56 w-full overflow-hidden rounded-[var(--radius-lg)] bg-gradient-to-br from-[color-mix(in_oklab,var(--color-surface),white_6%)] to-[color-mix(in_oklab,var(--color-surface),white_14%)] md:h-72">
            <LazyImage
              src={course.image}
              alt={course.title}
              className="h-full w-full object-cover"
              loading="lazy"
              fetchPriority="low"
              sizes="(min-width: 768px) 720px, 100vw"
            />
          </div>
        </Link>
        <header className="mb-6">
          <H1 className="mb-2 text-3xl font-bold">{course.title}</H1>
          <div className="text-sm text-[var(--color-muted)]">
            {course.date} • {course.duration} • {course.location}
          </div>
        </header>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--color-text)]">{course.summary}</p>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button as={Link} to={`/register?type=course&id=${course.id}`}>
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
