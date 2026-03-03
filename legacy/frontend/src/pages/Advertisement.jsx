import React from 'react';
import { H1, H2, Muted } from '../components/ui/Typography';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import SEO from '../components/SEO';
import { FaFileDownload, FaEye, FaBullhorn, FaEnvelope } from 'react-icons/fa';

export default function Advertisement() {
  const packages = [
    {
      name: 'Basic Package',
      price: '$500/month',
      features: [
        'Banner ad placement (728x90)',
        'Featured in newsletter',
        'Social media mention',
        '1 article integration',
      ],
      popular: false,
    },
    {
      name: 'Premium Package',
      price: '$1,200/month',
      features: [
        'Large banner ad (970x250)',
        'Featured in newsletter',
        'Dedicated article',
        'Social media promotion',
        'Podcast sponsorship mention',
        'Events promotion',
      ],
      popular: true,
    },
    {
      name: 'Enterprise Package',
      price: 'Custom',
      features: [
        'Full page takeover option',
        'Custom content campaigns',
        'Event sponsorship',
        'Multiple article integrations',
        'Dedicated account manager',
        'Custom analytics',
      ],
      popular: false,
    },
  ];

  const adSpecs = [
    {
      name: 'Leaderboard Banner',
      size: '728 x 90 px',
      format: 'PNG, JPG, GIF (animated)',
      maxSize: '150KB',
    },
    {
      name: 'Large Banner',
      size: '970 x 250 px',
      format: 'PNG, JPG, GIF (animated)',
      maxSize: '200KB',
    },
    {
      name: 'Square Ad',
      size: '300 x 300 px',
      format: 'PNG, JPG, GIF (animated)',
      maxSize: '100KB',
    },
    {
      name: 'Skyscraper',
      size: '300 x 600 px',
      format: 'PNG, JPG, GIF (animated)',
      maxSize: '150KB',
    },
  ];

  const placements = [
    {
      icon: FaEye,
      title: 'Homepage',
      description: 'High-visibility placement on our main page with premium traffic',
    },
    {
      icon: FaBullhorn,
      title: 'Articles',
      description: 'Contextual advertising within article content',
    },
    {
      icon: FaEnvelope,
      title: 'Newsletter',
      description: 'Reach our engaged subscriber base directly',
    },
  ];

  return (
    <>
      <SEO />
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        {/* Header */}
        <header className="mb-12 text-center">
          <H1 className="mb-4">Advertising Opportunities</H1>
          <Muted className="mx-auto max-w-3xl text-lg">
            Reach Liberia's tech community and decision-makers through Liberia Digital Insights. We
            offer various advertising packages to help your brand connect with our engaged audience.
          </Muted>
        </header>

        {/* CTA Section */}
        <Card className="mb-16 bg-brand-500/5 p-8 text-center">
          <H2 className="mb-4">Ready to Advertise?</H2>
          <Muted className="mb-6 mx-auto max-w-2xl">
            Get in touch with our advertising team to discuss custom packages, rates, and
            availability.
          </Muted>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              as="a"
              href="mailto:sales@liberiadigitalinsights.news"
              leftIcon={<FaEnvelope />}
            >
              Contact Sales
            </Button>
            <Button
              variant="outline"
              leftIcon={<FaFileDownload />}
              onClick={() => {
                // Simulate download
                alert('Media kit download would start here');
              }}
            >
              Download Media Kit
            </Button>
          </div>
        </Card>

        {/* Packages */}
        <section className="mb-16">
          <H2 className="mb-8 text-center">Advertising Packages</H2>
          <div className="grid gap-6 md:grid-cols-3">
            {packages.map((pkg, idx) => (
              <Card
                key={idx}
                className={`relative p-6 ${
                  pkg.popular ? 'border-2 border-brand-500 bg-brand-500/5' : ''
                } opacity-0 animate-slide-up`}
                style={{ animationDelay: `${100 + idx * 100}ms` }}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-brand-500 px-3 py-1 text-xs font-semibold text-white">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-4 text-center">
                  <h3 className="mb-2 text-xl font-semibold">{pkg.name}</h3>
                  <div className="text-2xl font-bold text-brand-500">{pkg.price}</div>
                </div>
                <ul className="mb-6 space-y-2">
                  {pkg.features.map((feature, fIdx) => (
                    <li
                      key={fIdx}
                      className="flex items-start gap-2 text-sm text-[var(--color-muted)]"
                    >
                      <span className="mt-1 text-brand-500">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant={pkg.popular ? 'solid' : 'outline'}
                  className="w-full"
                  as="a"
                  href="mailto:sales@liberiadigitalinsights.news"
                >
                  Get Started
                </Button>
              </Card>
            ))}
          </div>
        </section>

        {/* Ad Specifications */}
        <section className="mb-16">
          <H2 className="mb-8 text-center">Ad Specifications</H2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {adSpecs.map((spec, idx) => (
              <Card
                key={idx}
                className="p-6 text-center opacity-0 animate-slide-up"
                style={{ animationDelay: `${100 + idx * 100}ms` }}
              >
                <h3 className="mb-3 text-lg font-semibold">{spec.name}</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-[var(--color-muted)]">Size:</span>{' '}
                    <span className="text-[var(--color-text)]">{spec.size}</span>
                  </div>
                  <div>
                    <span className="font-medium text-[var(--color-muted)]">Format:</span>{' '}
                    <span className="text-[var(--color-text)]">{spec.format}</span>
                  </div>
                  <div>
                    <span className="font-medium text-[var(--color-muted)]">Max Size:</span>{' '}
                    <span className="text-[var(--color-text)]">{spec.maxSize}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Placement Options */}
        <section className="mb-16">
          <H2 className="mb-8 text-center">Placement Options</H2>
          <div className="grid gap-6 md:grid-cols-3">
            {placements.map((placement, idx) => {
              const Icon = placement.icon;
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
                  <h3 className="mb-2 text-lg font-semibold">{placement.title}</h3>
                  <p className="text-sm text-[var(--color-muted)]">{placement.description}</p>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Why Advertise Section */}
        <Card className="bg-brand-500/5 p-8">
          <H2 className="mb-6 text-center">Why Advertise with Us?</H2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-lg font-semibold">Reach Tech Decision Makers</h3>
              <p className="text-sm text-[var(--color-muted)]">
                Connect with Liberia's technology leaders, entrepreneurs, and innovators who
                actively engage with our content.
              </p>
            </div>
            <div>
              <h3 className="mb-3 text-lg font-semibold">Engaged Audience</h3>
              <p className="text-sm text-[var(--color-muted)]">
                Our community includes active readers, podcast listeners, and event attendees who
                value quality technology content.
              </p>
            </div>
            <div>
              <h3 className="mb-3 text-lg font-semibold">Multiple Channels</h3>
              <p className="text-sm text-[var(--color-muted)]">
                Reach your audience through our website, newsletter, podcasts, and events for
                maximum visibility.
              </p>
            </div>
            <div>
              <h3 className="mb-3 text-lg font-semibold">Flexible Packages</h3>
              <p className="text-sm text-[var(--color-muted)]">
                Choose from standard packages or work with us to create a custom advertising
                solution that fits your needs.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
