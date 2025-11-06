import React from 'react';
import SEO from '../components/SEO';
import { H1 } from '../components/ui/Typography';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import {
  getUpcomingTrainings,
  getUpcomingCourses,
  getPastTrainings,
  getPastCourses,
} from '../data/mockTraining';
import Select from '../components/ui/Select';
import EmptyState from '../components/ui/EmptyState';

export default function TrainingCourses() {
  const trainings = getUpcomingTrainings();
  const courses = getUpcomingCourses();
  const pastTrainings = getPastTrainings();
  const pastCourses = getPastCourses();

  const [location, setLocation] = React.useState('All');
  const [modality, setModality] = React.useState('All');
  const [pageT, setPageT] = React.useState(1);
  const [pageC, setPageC] = React.useState(1);
  const pageSize = 3;

  const allLocations = [
    'All',
    ...Array.from(new Set([...trainings, ...courses].map((x) => x.location))),
  ];
  const allModalities = [
    'All',
    ...Array.from(new Set([...trainings, ...courses].map((x) => x.modality || ''))),
  ].filter(Boolean);

  const applyFilters = (list) =>
    list.filter(
      (x) =>
        (location === 'All' || x.location === location) &&
        (modality === 'All' || x.modality === modality),
    );

  const filteredTrainings = applyFilters(trainings);
  const filteredCourses = applyFilters(courses);
  const pagedTrainings = filteredTrainings.slice((pageT - 1) * pageSize, pageT * pageSize);
  const pagedCourses = filteredCourses.slice((pageC - 1) * pageSize, pageC * pageSize);

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

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-end gap-3">
          <div>
            <label htmlFor="tc-location" className="mb-1 block text-sm font-medium">
              Location
            </label>
            <Select
              id="tc-location"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setPageT(1);
                setPageC(1);
              }}
            >
              {allLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label htmlFor="tc-modality" className="mb-1 block text-sm font-medium">
              Modality
            </label>
            <Select
              id="tc-modality"
              value={modality}
              onChange={(e) => {
                setModality(e.target.value);
                setPageT(1);
                setPageC(1);
              }}
            >
              {allModalities.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--color-text)]">Upcoming Training</h2>
            <div className="grid grid-cols-1 gap-4">
              {pagedTrainings.length === 0 && (
                <EmptyState
                  title="No training matches"
                  description="Try a different filter combination."
                />
              )}
              {pagedTrainings.map((t) => (
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
                      {t.date} • {t.location} • {t.modality}
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
            {filteredTrainings.length > pageSize && (
              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="subtle"
                  onClick={() => setPageT((p) => Math.max(1, p - 1))}
                  disabled={pageT === 1}
                >
                  Previous
                </Button>
                <div className="text-sm text-[var(--color-muted)]">
                  Page {pageT} of {Math.ceil(filteredTrainings.length / pageSize)}
                </div>
                <Button
                  variant="subtle"
                  onClick={() =>
                    setPageT((p) => Math.min(Math.ceil(filteredTrainings.length / pageSize), p + 1))
                  }
                  disabled={pageT >= Math.ceil(filteredTrainings.length / pageSize)}
                >
                  Next
                </Button>
              </div>
            )}
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--color-text)]">Upcoming Courses</h2>
            <div className="grid grid-cols-1 gap-4">
              {pagedCourses.length === 0 && (
                <EmptyState
                  title="No courses match"
                  description="Try a different filter combination."
                />
              )}
              {pagedCourses.map((c) => (
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
                      {c.date} • {c.location} • {c.modality}
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
            {filteredCourses.length > pageSize && (
              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="subtle"
                  onClick={() => setPageC((p) => Math.max(1, p - 1))}
                  disabled={pageC === 1}
                >
                  Previous
                </Button>
                <div className="text-sm text-[var(--color-muted)]">
                  Page {pageC} of {Math.ceil(filteredCourses.length / pageSize)}
                </div>
                <Button
                  variant="subtle"
                  onClick={() =>
                    setPageC((p) => Math.min(Math.ceil(filteredCourses.length / pageSize), p + 1))
                  }
                  disabled={pageC >= Math.ceil(filteredCourses.length / pageSize)}
                >
                  Next
                </Button>
              </div>
            )}
          </section>
        </div>

        {/* Past Recaps */}
        <section className="mt-12 space-y-6">
          <h2 className="text-xl font-semibold text-[var(--color-text)]">Recent Recaps</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Past Trainings</CardTitle>
              </CardHeader>
              <CardContent>
                {pastTrainings.length === 0 ? (
                  <EmptyState title="No past trainings" />
                ) : (
                  <ul className="space-y-2 text-sm">
                    {pastTrainings.map((pt) => (
                      <li key={pt.id} className="flex items-center justify-between">
                        <span className="truncate">{pt.title}</span>
                        <span className="text-[var(--color-muted)]">{pt.date}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Past Courses</CardTitle>
              </CardHeader>
              <CardContent>
                {pastCourses.length === 0 ? (
                  <EmptyState title="No past courses" />
                ) : (
                  <ul className="space-y-2 text-sm">
                    {pastCourses.map((pc) => (
                      <li key={pc.id} className="flex items-center justify-between">
                        <span className="truncate">{pc.title}</span>
                        <span className="text-[var(--color-muted)]">{pc.date}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
}
