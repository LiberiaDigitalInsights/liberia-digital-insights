import React from 'react';
import SEO from '../components/SEO';
import { H1 } from '../components/ui/Typography';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { getUpcomingTrainings, getUpcomingCourses } from '../data/mockTraining';

export default function TrainingCourses() {
  const trainings = getUpcomingTrainings();
  const courses = getUpcomingCourses();

  return (
    <>
      <SEO
        title="Training & Courses"
        description="Explore upcoming training programs and courses."
      />
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <header className="mb-8">
          <H1 className="mb-4 text-3xl font-bold">Training & Courses</H1>
          <p className="text-lg text-[var(--color-muted)]">
            Discover upcoming training programs and courses curated for Liberia's tech community.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--color-text)]">Upcoming Training</h2>
            <div className="grid grid-cols-1 gap-4">
              {trainings.map((t) => (
                <Card
                  key={t.id}
                  className="group overflow-hidden transition-all duration-300 hover:shadow-lg"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between gap-3">
                      <span className="truncate">{t.title}</span>
                      <span className="text-xs font-medium text-[var(--color-muted)]">
                        {t.duration}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2 text-sm text-[var(--color-muted)]">
                      {t.date} • {t.location}
                    </div>
                    <p className="mb-4 text-sm text-[var(--color-text)]">{t.summary}</p>
                    <div className="flex gap-2">
                      <Button as={Link} to={`/training/${t.id}`} variant="secondary">
                        View Details
                      </Button>
                      <Button as={Link} to={t.registrationUrl}>
                        Register
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--color-text)]">Upcoming Courses</h2>
            <div className="grid grid-cols-1 gap-4">
              {courses.map((c) => (
                <Card
                  key={c.id}
                  className="group overflow-hidden transition-all duration-300 hover:shadow-lg"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between gap-3">
                      <span className="truncate">{c.title}</span>
                      <span className="text-xs font-medium text-[var(--color-muted)]">
                        {c.duration}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2 text-sm text-[var(--color-muted)]">
                      {c.date} • {c.location}
                    </div>
                    <p className="mb-4 text-sm text-[var(--color-text)]">{c.summary}</p>
                    <div className="flex gap-2">
                      <Button as={Link} to={`/course/${c.id}`} variant="secondary">
                        View Details
                      </Button>
                      <Button as={Link} to={c.registrationUrl}>
                        Register
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
