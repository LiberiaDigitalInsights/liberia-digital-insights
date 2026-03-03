"use client";

import React from "react";
import { H1, Muted } from "@/components/ui/Typography";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Link from "next/link";
import LazyImage from "@/components/LazyImage";
import { useTraining } from "@/hooks/useBackendApi";
import Select from "@/components/ui/Select";
import EmptyState from "@/components/ui/EmptyState";
import { MotionGrid, MotionItem } from "@/components/ui/MotionWrapper";
import {
  FaGraduationCap,
  FaChalkboardTeacher,
  FaMapMarkerAlt,
  FaClock,
  FaCalendarAlt,
} from "react-icons/fa";

export default function TrainingCoursesPage() {
  const { data: trainingData, loading, error } = useTraining({});
  const allTraining = trainingData?.training || [];

  const trainings = allTraining.filter((item) => item.type === "training");
  const courses = allTraining.filter((item) => item.type === "course");

  const [location, setLocation] = React.useState("All");
  const [modality, setModality] = React.useState("All");

  const allLocations = [
    "All",
    ...Array.from(new Set(allTraining.map((x) => x.location).filter(Boolean))),
  ];
  const allModalities = [
    "All",
    ...Array.from(new Set(allTraining.map((x) => x.modality).filter(Boolean))),
  ];

  const filteredTrainings = trainings.filter(
    (x) =>
      (location === "All" || x.location === location) &&
      (modality === "All" || x.modality === modality),
  );

  const filteredCourses = courses.filter(
    (x) =>
      (location === "All" || x.location === location) &&
      (modality === "All" || x.modality === modality),
  );

  if (loading)
    return (
      <div className="text-center py-20 animate-pulse font-bold text-muted uppercase tracking-widest">
        Loading Catalog...
      </div>
    );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-16">
      <header className="mb-16 text-center">
        <H1 className="mb-6 text-4xl md:text-6xl font-black tracking-tight uppercase italic underline decoration-brand-500 decoration-8 underline-offset-8">
          LEARN & GROW
        </H1>
        <Muted className="text-lg mx-auto max-w-2xl leading-relaxed">
          Master the skills of the future with our industry-leading training
          programs and courses. From coding bootcamps to entrepreneurship
          workshops.
        </Muted>
      </header>

      {/* Filters */}
      <div className="mb-16 flex flex-wrap items-center justify-center gap-6 bg-surface p-6 rounded-2xl border border-border/50 shadow-2xl">
        <div className="flex items-center gap-3">
          <span className="text-xs font-black uppercase tracking-tighter text-muted">
            Location
          </span>
          <Select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-48 bg-transparent border-none font-bold"
          >
            {allLocations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </Select>
        </div>
        <div className="h-8 w-px bg-border hidden md:block" />
        <div className="flex items-center gap-3">
          <span className="text-xs font-black uppercase tracking-tighter text-muted">
            Modality
          </span>
          <Select
            value={modality}
            onChange={(e) => setModality(e.target.value)}
            className="w-48 bg-transparent border-none font-bold"
          >
            {allModalities.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
        {/* Trainings */}
        <section className="space-y-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-lg shadow-brand-500/20">
              <FaChalkboardTeacher />
            </div>
            <h2 className="text-3xl font-black tracking-tight">
              UPCOMING TRAINING
            </h2>
          </div>

          {filteredTrainings.length === 0 ? (
            <EmptyState
              title="No training found"
              description="Try broadening your search."
            />
          ) : (
            <div className="space-y-8">
              {filteredTrainings.map((t) => (
                <Card
                  key={t.id}
                  className="group overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500"
                >
                  <div className="relative h-64 overflow-hidden">
                    <LazyImage
                      src={t.coverImage || t.image}
                      alt={t.title}
                      className="h-full w-full group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="flex gap-2 mb-2">
                        <span className="px-2 py-1 bg-brand-500 text-white text-[10px] font-black uppercase tracking-widest rounded">
                          {t.modality}
                        </span>
                        <span className="px-2 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded">
                          {t.duration}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-white leading-tight uppercase line-clamp-2">
                        {t.title}
                      </h3>
                    </div>
                  </div>
                  <CardContent className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-4 text-xs font-bold text-muted uppercase">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-brand-500" />{" "}
                        {t.startDate || t.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-brand-500" />{" "}
                        {t.location}
                      </div>
                    </div>
                    <p className="text-sm text-muted leading-relaxed line-clamp-3">
                      {t.description || t.summary}
                    </p>
                    <div className="flex gap-4 pt-4 border-t border-border/50">
                      <Button
                        as={Link}
                        href={`/training/${t.id}`}
                        variant="outline"
                        className="flex-1 font-bold"
                      >
                        Details
                      </Button>
                      <Button
                        as={Link}
                        href={`/register?type=training&id=${t.id}`}
                        className="flex-1 font-bold shadow-lg shadow-brand-500/20"
                      >
                        Register
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Courses */}
        <section className="space-y-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-lg shadow-brand-500/20">
              <FaGraduationCap />
            </div>
            <h2 className="text-3xl font-black tracking-tight">
              FEATURED COURSES
            </h2>
          </div>

          {filteredCourses.length === 0 ? (
            <EmptyState
              title="No courses found"
              description="Try broadening your search."
            />
          ) : (
            <div className="space-y-8">
              {filteredCourses.map((c) => (
                <Card
                  key={c.id}
                  className="group overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500"
                >
                  <div className="relative h-64 overflow-hidden">
                    <LazyImage
                      src={c.coverImage || c.image}
                      alt={c.title}
                      className="h-full w-full group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="flex gap-2 mb-2">
                        <span className="px-2 py-1 bg-brand-500 text-white text-[10px] font-black uppercase tracking-widest rounded">
                          {c.modality}
                        </span>
                        <span className="px-2 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded">
                          Self-Paced
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-white leading-tight uppercase line-clamp-2">
                        {c.title}
                      </h3>
                    </div>
                  </div>
                  <CardContent className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-4 text-xs font-bold text-muted uppercase">
                      <div className="flex items-center gap-2">
                        <FaClock className="text-brand-500" /> {c.duration}
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-brand-500" />{" "}
                        {c.location}
                      </div>
                    </div>
                    <p className="text-sm text-muted leading-relaxed line-clamp-3">
                      {c.description || c.summary}
                    </p>
                    <div className="flex gap-4 pt-4 border-t border-border/50">
                      <Button
                        as={Link}
                        href={`/course/${c.id}`}
                        variant="outline"
                        className="flex-1 font-bold"
                      >
                        Details
                      </Button>
                      <Button
                        as={Link}
                        href={`/register?type=course&id=${c.id}`}
                        className="flex-1 font-bold shadow-lg shadow-brand-500/20"
                      >
                        Enroll Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
