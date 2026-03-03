"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { H1, Muted } from "@/components/ui/Typography";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useTrainingById } from "@/hooks/useBackendApi";
import LazyImage from "@/components/LazyImage";
import {
  FaChevronLeft,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaVideo,
  FaCheckCircle,
  FaUserCircle,
} from "react-icons/fa";

export default function TrainingDetail() {
  const { id } = useParams();
  const { data: trainingData, loading, error } = useTrainingById(id);

  const training =
    trainingData?.course || trainingData?.training || trainingData;

  if (loading)
    return (
      <div className="text-center py-24 font-bold text-muted animate-pulse">
        Loading Details...
      </div>
    );

  if (error || !training) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <H1 className="mb-4">Training Not Found</H1>
        <Link
          href="/training"
          className="font-bold text-brand-500 hover:underline"
        >
          ← Back to Training & Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-16">
      <Link
        href="/training"
        className="inline-flex items-center gap-2 text-sm font-bold text-brand-500 hover:text-brand-600 mb-8 transition-colors"
      >
        <FaChevronLeft className="text-[10px]" /> Back to Catalog
      </Link>

      <div className="grid lg:grid-cols-[1fr_400px] gap-12">
        <main>
          <div className="relative h-64 md:h-96 w-full overflow-hidden rounded-2xl shadow-2xl mb-12">
            <LazyImage
              src={training.coverImage || training.image}
              alt={training.title}
              className="h-full w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex gap-2 mb-3">
                <span className="px-3 py-1 bg-brand-500 text-white text-xs font-black uppercase rounded shadow-lg shadow-brand-500/20">
                  Training
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-black uppercase rounded shadow-lg">
                  {training.modality}
                </span>
              </div>
              <H1 className="text-white text-3xl md:text-5xl font-black uppercase italic leading-none">
                {training.title}
              </H1>
            </div>
          </div>

          <section className="space-y-12">
            <div>
              <h2 className="text-2xl font-black mb-6 border-b-4 border-brand-500 w-fit pb-2">
                OVERVIEW
              </h2>
              <div
                className="text-muted leading-relaxed text-lg"
                dangerouslySetInnerHTML={{
                  __html: training.description || training.summary,
                }}
              />
            </div>

            <div>
              <h2 className="text-2xl font-black mb-6 border-b-4 border-brand-500 w-fit pb-2">
                CURRICULUM HIGHLIGHTS
              </h2>
              <ul className="grid sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <li
                    key={i}
                    className="flex gap-3 items-start bg-surface p-4 rounded-xl border border-border/50"
                  >
                    <FaCheckCircle className="text-brand-500 mt-1 shrink-0" />
                    <span className="text-sm font-medium">
                      Key learning objective or module description for this
                      training program.
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </main>

        <aside className="space-y-8">
          <Card className="sticky top-24 p-8 border-none shadow-2xl bg-surface relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full -mr-16 -mt-16" />

            <div className="relative z-10 space-y-8">
              <h3 className="text-2xl font-black uppercase tracking-tighter italic border-b border-border pb-4">
                Event Details
              </h3>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0">
                    <FaCalendarAlt />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase text-muted tracking-widest">
                      Start Date
                    </div>
                    <div className="font-bold text-text">
                      {training.startDate || training.date}
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0">
                    <FaClock />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase text-muted tracking-widest">
                      Duration
                    </div>
                    <div className="font-bold text-text">
                      {training.duration}
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0">
                    {training.modality === "Online" ? (
                      <FaVideo />
                    ) : (
                      <FaMapMarkerAlt />
                    )}
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase text-muted tracking-widest">
                      Location
                    </div>
                    <div className="font-bold text-text">
                      {training.location}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <Button
                  as={Link}
                  href={
                    training.registrationUrl ||
                    `/register?type=training&id=${training.id}`
                  }
                  className="w-full py-4 text-lg font-black uppercase tracking-widest shadow-xl shadow-brand-500/20"
                >
                  Enroll Now
                </Button>
                <p className="text-[10px] text-center mt-4 text-muted font-bold uppercase tracking-widest">
                  Limited seats available
                </p>
              </div>

              <div className="pt-6 flex items-center gap-3">
                <FaUserCircle className="text-3xl text-brand-500" />
                <div>
                  <div className="text-[10px] font-black uppercase text-muted tracking-widest">
                    Instructor
                  </div>
                  <div className="text-xs font-bold text-text">
                    LDI Certified Professional
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
