import React from 'react';
import { H1, H2, Muted } from '../components/ui/Typography';
import Card from '../components/ui/Card';
import SEO from '../components/SEO';
import { FaUsers, FaLightbulb, FaHandshake, FaRocket } from 'react-icons/fa';

export default function About() {
  const values = [
    {
      icon: FaUsers,
      title: 'Community First',
      description: 'We believe in the power of community and collaborative innovation.',
    },
    {
      icon: FaLightbulb,
      title: 'Innovation',
      description: 'We champion cutting-edge technology and innovative solutions for Liberia.',
    },
    {
      icon: FaHandshake,
      title: 'Partnership',
      description: 'We build strong partnerships to drive digital transformation.',
    },
    {
      icon: FaRocket,
      title: 'Growth',
      description: 'We support startups and entrepreneurs on their journey to success.',
    },
  ];

  const team = [
    {
      name: 'John Doe',
      role: 'Founder & CEO',
      bio: 'Passionate about technology and digital transformation in Liberia.',
    },
    {
      name: 'Jane Smith',
      role: 'Editor-in-Chief',
      bio: 'Experienced journalist with a focus on tech and innovation stories.',
    },
    {
      name: 'Mike Johnson',
      role: 'Tech Lead',
      bio: 'Full-stack developer and tech enthusiast driving our platform development.',
    },
  ];

  return (
    <>
      <SEO />
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        {/* Hero Section */}
        <header className="mb-12 text-center">
          <H1 className="mb-4">About Liberia Digital Insights</H1>
          <Muted className="mx-auto max-w-3xl text-lg">
            Liberia Digital Insights is your premier destination for technology news, insights, and
            innovation stories from Liberia and beyond. We cover everything from startup ecosystems
            to enterprise technology, digital transformation, and the people driving change in
            Liberia's tech landscape.
          </Muted>
        </header>

        {/* Mission & Vision */}
        <div className="mb-16 grid gap-8 md:grid-cols-2">
          <Card className="p-6">
            <H2 className="mb-4 text-2xl">Our Mission</H2>
            <p className="text-[var(--color-muted)]">
              To empower Liberia's digital ecosystem by providing comprehensive coverage of
              technology news, insights, and innovation. We aim to bridge the information gap,
              connect stakeholders, and inspire the next generation of tech leaders in Liberia.
            </p>
          </Card>
          <Card className="p-6">
            <H2 className="mb-4 text-2xl">Our Vision</H2>
            <p className="text-[var(--color-muted)]">
              To become the leading voice for technology and innovation in Liberia, recognized for
              quality journalism, insightful analysis, and meaningful contributions to the country's
              digital transformation journey.
            </p>
          </Card>
        </div>

        {/* Core Values */}
        <section className="mb-16">
          <H2 className="mb-8 text-center">Our Core Values</H2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <Card
                  key={idx}
                  className="p-6 text-center opacity-0 animate-slide-up"
                  style={{ animationDelay: `${100 + idx * 100}ms` }}
                >
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-brand-500/10 p-4">
                      <Icon className="h-6 w-6 text-brand-500" />
                    </div>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{value.title}</h3>
                  <p className="text-sm text-[var(--color-muted)]">{value.description}</p>
                </Card>
              );
            })}
          </div>
        </section>

        {/* What We Do */}
        <section className="mb-16">
          <H2 className="mb-8 text-center">What We Do</H2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="p-6">
              <h3 className="mb-3 text-xl font-semibold">Technology News</h3>
              <p className="text-sm text-[var(--color-muted)]">
                Stay updated with the latest technology news, trends, and developments in Liberia
                and across Africa.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="mb-3 text-xl font-semibold">Podcasts & Interviews</h3>
              <p className="text-sm text-[var(--color-muted)]">
                Listen to in-depth conversations with tech leaders, entrepreneurs, and innovators
                shaping Liberia's digital future.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="mb-3 text-xl font-semibold">Events & Community</h3>
              <p className="text-sm text-[var(--color-muted)]">
                Join us at tech events, meetups, and community gatherings. Connect with like-minded
                individuals and organizations.
              </p>
            </Card>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <H2 className="mb-8 text-center">Meet Our Team</H2>
          <div className="grid gap-6 md:grid-cols-3">
            {team.map((member, idx) => (
              <Card
                key={idx}
                className="p-6 text-center opacity-0 animate-slide-up"
                style={{ animationDelay: `${100 + idx * 100}ms` }}
              >
                <div className="mb-4 flex justify-center">
                  <div className="h-24 w-24 rounded-full bg-[color-mix(in_oklab,var(--color-surface),white_8%)] flex items-center justify-center text-2xl font-bold text-[var(--color-text)]">
                    {member.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                </div>
                <h3 className="mb-1 text-lg font-semibold">{member.name}</h3>
                <p className="mb-3 text-sm text-brand-500">{member.role}</p>
                <p className="text-sm text-[var(--color-muted)]">{member.bio}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <Card className="bg-brand-500/5 p-8 text-center">
          <H2 className="mb-4">Join Our Journey</H2>
          <Muted className="mb-6 mx-auto max-w-2xl">
            Be part of Liberia's digital transformation story. Subscribe to our newsletter, follow
            us on social media, or get in touch to learn more about how we can collaborate.
          </Muted>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/signup"
              className="rounded-[var(--radius-md)] bg-brand-500 px-6 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-brand-600"
            >
              Subscribe
            </a>
            <a
              href="/contact"
              className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-2.5 text-sm font-medium text-[var(--color-text)] transition-colors duration-200 hover:bg-[color-mix(in_oklab,var(--color-surface),white_8%)]"
            >
              Contact Us
            </a>
          </div>
        </Card>
      </div>
    </>
  );
}
