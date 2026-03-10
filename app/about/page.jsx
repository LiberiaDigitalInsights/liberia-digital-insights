"use client";

import React from "react";
import { H1, H2, Muted } from "@/components/ui/Typography";
import Card from "@/components/ui/Card";
import {
  FaUsers,
  FaLightbulb,
  FaHandshake,
  FaRocket,
  FaGlobe,
  FaCertificate,
} from "react-icons/fa";
import { MotionGrid, MotionItem } from "@/components/ui/MotionWrapper";

export default function AboutPage() {
  const values = [
    {
      icon: FaLightbulb,
      title: "Innovation",
      description:
        "We strive to inspire and embrace innovative solutions to drive Liberia’s digital transformation.",
    },
    {
      icon: FaUsers,
      title: "Collaboration",
      description:
        "We believe in teamwork and partnerships to achieve collective success.",
    },
    {
      icon: FaHandshake,
      title: "Integrity",
      description:
        "We maintain transparency, accountability, and trust in all our engagements.",
    },
    {
      icon: FaRocket,
      title: "Empowerment",
      description:
        "We are committed to empowering individuals and businesses with knowledge to thrive in the digital age.",
    },
    {
      icon: FaCertificate,
      title: "Excellence",
      description:
        "We pursue quality and excellence in everything we do, ensuring impactful outcomes.",
    },
    {
      icon: FaGlobe,
      title: "Inclusivity",
      description:
        "We champion diversity and inclusion, ensuring every voice is heard and valued.",
    },
  ];

  const team = [
    {
      name: "James Anointed Morgan Jr.",
      role: "CEO & Founder",
      bio: "Visionary leader driving digital transformation in Liberia.",
    },
    {
      name: "Isaac L. Kamara, Jr",
      role: "Tech Lead",
      bio: "Full-stack developer and tech enthusiast leading our platform evolution.",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      {/* Hero Section */}
      <header className="mb-20 text-center">
        <H1 className="mb-6 text-4xl md:text-6xl font-extrabold tracking-tight">
          About Us
        </H1>
        <Muted className="mx-auto max-w-3xl text-lg md:text-xl leading-relaxed">
          Liberia Digital Insights is a premier platform dedicated to
          illuminating the path of digital transformation and innovation in
          Liberia. We empower the next generation with the knowledge they need
          to thrive in an increasingly digital world.
        </Muted>
      </header>

      {/* Mission & Vision */}
      <div className="mb-24 grid gap-8 md:grid-cols-2">
        <Card className="p-8 border-none bg-brand-500/5 shadow-sm">
          <H2 className="mb-4 text-3xl font-bold">Our Mission</H2>
          <p className="text-muted text-lg leading-relaxed">
            To provide high-quality, accessible tech content that informs,
            educates, and inspires Liberians to embrace technology, fostering a
            future where innovation drives national growth.
          </p>
        </Card>
        <Card className="p-8 border-none bg-brand-500/5 shadow-sm">
          <H2 className="mb-4 text-3xl font-bold">Our Vision</H2>
          <p className="text-muted text-lg leading-relaxed">
            To be the leading tech media hub in West Africa, bridging the gap
            between global tech trends and local innovation, and empowering a
            million Liberians through digital literacy.
          </p>
        </Card>
      </div>

      {/* Core Values */}
      <section className="mb-24">
        <div className="text-center mb-12">
          <H2 className="mb-4 text-4xl font-bold">Our Core Values</H2>
          <Muted>The principles that guide everything we do.</Muted>
        </div>
        <MotionGrid className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {values.map((value, idx) => {
            const Icon = value.icon;
            return (
              <MotionItem key={idx}>
                <Card className="p-8 text-center h-full hover:shadow-xl transition-shadow duration-300 border-border/50">
                  <div className="mb-6 flex justify-center">
                    <div className="rounded-2xl bg-brand-500/10 p-4 text-brand-500 shadow-inner">
                      <Icon className="h-8 w-8" />
                    </div>
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-text">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {value.description}
                  </p>
                </Card>
              </MotionItem>
            );
          })}
        </MotionGrid>
      </section>

      {/* What We Do */}
      <section className="mb-24 px-4 py-16 bg-brand-500/5 rounded-4xl">
        <div className="text-center mb-12">
          <H2 className="mb-4 text-4xl font-black italic tracking-tighter text-brand-500">
            WHAT WE DO
          </H2>
          <Muted>Our core activities and impact areas.</Muted>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <Card className="p-8 border-none bg-surface/50 backdrop-blur-sm shadow-xl hover:-translate-y-2 transition-transform duration-300">
            <h3 className="mb-4 text-2xl font-bold text-text">
              Digital Literacy
            </h3>
            <p className="text-muted leading-relaxed">
              We provide essential training and resources to help Liberians
              navigate the digital landscape with confidence and skill.
            </p>
          </Card>
          <Card className="p-8 border-none bg-surface/50 backdrop-blur-sm shadow-xl hover:-translate-y-2 transition-transform duration-300">
            <h3 className="mb-4 text-2xl font-bold text-text">
              Tech Journalism
            </h3>
            <p className="text-muted leading-relaxed">
              In-depth reporting on technology trends, local innovation stories,
              and policy developments shaping Liberia's future.
            </p>
          </Card>
          <Card className="p-8 border-none bg-surface/50 backdrop-blur-sm shadow-xl hover:-translate-y-2 transition-transform duration-300">
            <h3 className="mb-4 text-2xl font-bold text-text">
              Community Building
            </h3>
            <p className="text-muted leading-relaxed">
              Fostering a vibrant ecosystem where developers, entrepreneurs, and
              tech enthusiasts can connect and collaborate.
            </p>
          </Card>
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-24">
        <div className="text-center mb-12">
          <H2 className="mb-4 text-4xl font-bold">Meet Our Team</H2>
          <Muted>The humans behind the insights.</Muted>
        </div>
        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {team.map((member, idx) => (
            <Card key={idx} className="p-8 text-center border-border/50">
              <div className="mb-6 flex justify-center">
                <div className="h-24 w-24 rounded-full bg-brand-500/10 flex items-center justify-center text-4xl font-black text-brand-500 shadow-xl border-4 border-surface">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
              </div>
              <h3 className="mb-1 text-2xl font-bold text-text">
                {member.name}
              </h3>
              <p className="mb-4 text-sm font-bold uppercase tracking-widest text-brand-500">
                {member.role}
              </p>
              <p className="text-sm text-muted leading-relaxed">{member.bio}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mb-12">
        <Card className="relative overflow-hidden p-12 text-center bg-brand-500 text-white border-none shadow-2xl shadow-brand-500/40 rounded-[2.5rem]">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-black rounded-full blur-[100px]"></div>
          </div>
          <H2 className="mb-6 text-4xl md:text-5xl font-black italic tracking-tighter">
            JOIN THE DIGITAL REVOLUTION
          </H2>
          <p className="mb-10 mx-auto max-w-2xl text-lg text-white/90 font-medium">
            Be part of Liberia's digital transformation story. Subscribe to our
            newsletter, follow us on social media, or get in touch to learn more
            about how we can collaborate.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="/register"
              className="rounded-2xl bg-white px-10 py-4 text-lg font-black uppercase tracking-tighter text-brand-500 hover:scale-105 transition-transform shadow-xl"
            >
              Get Started
            </a>
            <a
              href="/contact"
              className="rounded-2xl border-2 border-white/30 backdrop-blur-sm bg-white/10 px-10 py-4 text-lg font-black uppercase tracking-tighter text-white hover:bg-white/20 transition-all shadow-xl"
            >
              Contact Us
            </a>
          </div>
        </Card>
      </section>
    </div>
  );
}
