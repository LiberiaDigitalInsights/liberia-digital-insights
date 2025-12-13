import React from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { H1 } from '../components/ui/Typography';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useTrainingById } from '../hooks/useBackendApi';
import LazyImage from '../components/LazyImage';

export default function CourseDetail() {
  const { id } = useParams();
  const { data: courseData, loading, error } = useTrainingById(id);

  // Handle different API response structures
  const course = courseData?.course || courseData?.training || courseData;

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
        <div className="text-center">Loading course details...</div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
        <div className="text-center text-red-600">
          {error ? `Error: ${error.message}` : 'Course not found'}
        </div>
      </div>
    );
  }

  // Add debug logging to see what data we're getting
  console.log('Course data:', course);
  console.log('Course API response:', courseData);

  // Map backend data to UI format
  const mappedCourse = {
    ...course,
    title: course.title,
    summary: course.description || course.summary || '',
    date: course.startDate || course.date || 'Self-paced',
    duration: course.duration || 'N/A',
    location: course.location || 'Online',
    modality: course.modality || (course.location === 'Online' ? 'Online' : 'In-person'),
    image: course.coverImage || course.image || '/LDI_favicon.png',
    registrationUrl: course.registrationUrl || '/register',
  };

  return (
    <>
      <SEO
        title={mappedCourse.title}
        description={mappedCourse.summary}
        image={mappedCourse.image}
      />
      <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
        <Link
          to={`/register?type=course&id=${mappedCourse.id}`}
          aria-label={`Register for ${mappedCourse.title}`}
          className="block"
        >
          <div className="mb-6 h-56 w-full overflow-hidden rounded-[var(--radius-lg)] bg-gradient-to-br from-[color-mix(in_oklab,var(--color-surface),white_6%)] to-[color-mix(in_oklab,var(--color-surface),white_14%)] md:h-72">
            <LazyImage
              src={mappedCourse.image}
              alt={mappedCourse.title}
              className="h-full w-full object-cover"
              loading="lazy"
              fetchPriority="low"
              sizes="(min-width: 768px) 720px, 100vw"
            />
          </div>
        </Link>
        <header className="mb-6">
          <H1 className="mb-2 text-3xl font-bold">{mappedCourse.title}</H1>
          <div className="text-sm text-[var(--color-muted)]">
            {mappedCourse.date} • {mappedCourse.duration} • {mappedCourse.location}
          </div>
        </header>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--color-text)]">{mappedCourse.summary}</p>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button as={Link} to={`/register?type=course&id=${mappedCourse.id}`}>
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
