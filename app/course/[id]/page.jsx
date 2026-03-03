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
  FaFileAlt,
  FaClock,
  FaGlobe,
  FaCertificate,
  FaPlayCircle,
  FaCheckCircle,
  FaStar,
} from "react-icons/fa";

export default function CourseDetail() {
  const { id } = useParams();
  const { data: courseData, loading, error } = useTrainingById(id);

  const course = courseData?.course || courseData?.training || courseData;

  if (loading)
    return (
      <div className="text-center py-24 font-bold text-muted animate-pulse">
        Loading Course...
      </div>
    );

  if (error || !course) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <H1 className="mb-4">Course Not Found</H1>
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
        <FaChevronLeft className="text-[10px]" /> Back to Courses
      </Link>

      <div className="grid lg:grid-cols-[1fr_400px] gap-12">
        <main>
          <div className="relative h-64 md:h-96 w-full overflow-hidden rounded-2xl shadow-2xl mb-12 group">
            <LazyImage
              src={course.coverImage || course.image}
              alt={course.title}
              className="h-full w-full group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="h-20 w-20 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-2xl shadow-brand-500/40">
                <FaPlayCircle className="text-4xl ml-1" />
              </div>
            </div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex gap-2 mb-3">
                <span className="px-3 py-1 bg-brand-500 text-white text-xs font-black uppercase rounded shadow-lg shadow-brand-500/20">
                  Self-Paced Course
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-black uppercase rounded shadow-lg">
                  Lifetime Access
                </span>
              </div>
              <H1 className="text-white text-3xl md:text-5xl font-black uppercase italic leading-none">
                {course.title}
              </H1>
            </div>
          </div>

          <section className="space-y-12">
            <div>
              <h2 className="text-2xl font-black mb-6 border-b-4 border-brand-500 w-fit pb-2 uppercase italic tracking-tighter">
                Course Overview
              </h2>
              <div
                className="text-muted leading-relaxed text-lg"
                dangerouslySetInnerHTML={{
                  __html: course.description || course.summary,
                }}
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              <Card className="p-6 text-center border-none bg-surface shadow-lg">
                <FaClock className="text-brand-500 text-3xl mx-auto mb-4" />
                <div className="font-bold text-lg">{course.duration}</div>
                <div className="text-xs font-black uppercase text-muted tracking-widest">
                  Total Content
                </div>
              </Card>
              <Card className="p-6 text-center border-none bg-surface shadow-lg">
                <FaCertificate className="text-brand-500 text-3xl mx-auto mb-4" />
                <div className="font-bold text-lg">Verified</div>
                <div className="text-xs font-black uppercase text-muted tracking-widest">
                  Certificate
                </div>
              </Card>
              <Card className="p-6 text-center border-none bg-surface shadow-lg">
                <FaStar className="text-brand-500 text-3xl mx-auto mb-4" />
                <div className="font-bold text-lg">4.9/5.0</div>
                <div className="text-xs font-black uppercase text-muted tracking-widest">
                  Rating
                </div>
              </Card>
            </div>

            <div>
              <h2 className="text-2xl font-black mb-6 border-b-4 border-brand-500 w-fit pb-2 uppercase italic tracking-tighter">
                What you will learn
              </h2>
              <ul className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <li
                    key={i}
                    className="flex gap-4 items-center bg-surface p-5 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="h-8 w-8 rounded-full bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0 font-black text-sm">
                      {i}
                    </div>
                    <span className="font-bold text-text">
                      Advanced mastery of technical concepts and practical
                      application within this module.
                    </span>
                    <FaCheckCircle className="text-emerald-500 ml-auto shrink-0" />
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
              <div className="flex items-center justify-between border-b border-border pb-4">
                <h3 className="text-2xl font-black uppercase tracking-tighter italic">
                  Course Info
                </h3>
                <span className="text-brand-500 font-bold">FREE</span>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0">
                    <FaFileAlt />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase text-muted tracking-widest">
                      Content Type
                    </div>
                    <div className="font-bold text-text">Videos & Projects</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0">
                    <FaGlobe />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase text-muted tracking-widest">
                      Modality
                    </div>
                    <div className="font-bold text-text">
                      {course.modality || "100% Online"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <Button
                  as={Link}
                  href={
                    course.registrationUrl ||
                    `/register?type=course&id=${course.id}`
                  }
                  className="w-full py-4 text-lg font-black uppercase tracking-widest shadow-xl shadow-brand-500/20"
                >
                  Enroll Now
                </Button>
                <p className="text-[10px] text-center mt-4 text-muted font-bold uppercase tracking-widest">
                  Instant access after enrollment
                </p>
              </div>

              <Card className="p-4 bg-brand-500/5 border-none">
                <h4 className="font-bold text-xs uppercase tracking-widest mb-2">
                  Requirements
                </h4>
                <ul className="text-[10px] text-muted space-y-1 font-bold">
                  <li>• Basic understanding of tech</li>
                  <li>• A modern computer & internet</li>
                  <li>• High motivation to learn</li>
                </ul>
              </Card>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
