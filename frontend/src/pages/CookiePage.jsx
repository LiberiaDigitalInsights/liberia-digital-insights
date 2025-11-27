import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

const CookiePage = () => {
  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <div className="mx-auto max-w-4xl px-6 py-12 md:px-8 md:py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <Link to="/" className="inline-flex items-center gap-3 mb-8">
            <Logo />
          </Link>
          <h1 className="text-4xl font-bold text-[var(--color-text)] mb-4">Cookie Policy</h1>
          <p className="text-lg text-[var(--color-muted)]">
            Last updated:{' '}
            {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="space-y-8 text-[var(--color-text)]">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">What Are Cookies?</h2>
              <p className="text-[var(--color-muted)] leading-relaxed mb-4">
                Cookies are small text files that are stored on your device (computer, tablet, or
                mobile) when you visit a website. They help websites remember information about your
                visit, making your experience more efficient and personalized.
              </p>
              <p className="text-[var(--color-muted)] leading-relaxed">
                This Cookie Policy explains how Liberia Digital Insights uses cookies and similar
                tracking technologies on our website.
              </p>
            </section>

            {/* Types of Cookies We Use */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Types of Cookies We Use</h2>

              <div className="space-y-6">
                <div className="border border-[var(--color-border)] rounded-lg p-6">
                  <h3 className="text-xl font-medium mb-3 text-[var(--color-text)]">
                    Essential Cookies
                  </h3>
                  <p className="text-[var(--color-muted)] leading-relaxed mb-3">
                    These cookies are necessary for the website to function properly. They enable
                    basic functionalities like page navigation, access to secure areas, and
                    authentication.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-[var(--color-muted)] text-sm">
                    <li>Session management</li>
                    <li>Security authentication</li>
                    <li>Load balancing</li>
                    <li>User preferences storage</li>
                  </ul>
                  <p className="text-sm text-[var(--color-muted)] mt-3">
                    <strong>Lifetime:</strong> Session-based or persistent (up to 1 year)
                  </p>
                </div>

                <div className="border border-[var(--color-border)] rounded-lg p-6">
                  <h3 className="text-xl font-medium mb-3 text-[var(--color-text)]">
                    Analytics Cookies
                  </h3>
                  <p className="text-[var(--color-muted)] leading-relaxed mb-3">
                    These cookies help us understand how visitors interact with our website by
                    collecting and reporting information anonymously.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-[var(--color-muted)] text-sm">
                    <li>Page views and user behavior</li>
                    <li>Time spent on pages</li>
                    <li>Bounce rates and exit pages</li>
                    <li>Device and browser information</li>
                    <li>Geographic location (country/region level)</li>
                  </ul>
                  <p className="text-sm text-[var(--color-muted)] mt-3">
                    <strong>Third-party services:</strong> Google Analytics, Hotjar
                  </p>
                  <p className="text-sm text-[var(--color-muted)]">
                    <strong>Lifetime:</strong> 2 years (configurable)
                  </p>
                </div>

                <div className="border border-[var(--color-border)] rounded-lg p-6">
                  <h3 className="text-xl font-medium mb-3 text-[var(--color-text)]">
                    Marketing Cookies
                  </h3>
                  <p className="text-[var(--color-muted)] leading-relaxed mb-3">
                    These cookies are used to deliver advertisements that are relevant to you and
                    your interests. They also help measure the effectiveness of advertising
                    campaigns.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-[var(--color-muted)] text-sm">
                    <li>Ad personalization</li>
                    <li>Campaign tracking</li>
                    <li>Conversion measurement</li>
                    <li>Remarketing and retargeting</li>
                  </ul>
                  <p className="text-sm text-[var(--color-muted)] mt-3">
                    <strong>Third-party services:</strong> Google Ads, Facebook Pixel, LinkedIn
                    Insight Tag
                  </p>
                  <p className="text-sm text-[var(--color-muted)]">
                    <strong>Lifetime:</strong> 30 days to 2 years
                  </p>
                </div>

                <div className="border border-[var(--color-border)] rounded-lg p-6">
                  <h3 className="text-xl font-medium mb-3 text-[var(--color-text)]">
                    Functional Cookies
                  </h3>
                  <p className="text-[var(--color-muted)] leading-relaxed mb-3">
                    These cookies enable enhanced functionality and personalization, such as videos
                    and live chats.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-[var(--color-muted)] text-sm">
                    <li>Newsletter subscription preferences</li>
                    <li>Language and region settings</li>
                    <li>Social media integration</li>
                    <li>Content customization</li>
                  </ul>
                  <p className="text-sm text-[var(--color-muted)] mt-3">
                    <strong>Lifetime:</strong> 1 year or until manually cleared
                  </p>
                </div>
              </div>
            </section>

            {/* How We Use Cookies */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">How We Use Cookies</h2>
              <p className="text-[var(--color-muted)] leading-relaxed mb-4">
                We use cookies for the following purposes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[var(--color-muted)]">
                <li>
                  <strong>Website Performance:</strong> To monitor and improve website performance
                  and user experience
                </li>
                <li>
                  <strong>Analytics:</strong> To understand how our audience uses our website and
                  content
                </li>
                <li>
                  <strong>Personalization:</strong> To remember your preferences and provide
                  customized content
                </li>
                <li>
                  <strong>Security:</strong> To protect against fraud and maintain website security
                </li>
                <li>
                  <strong>Advertising:</strong> To serve relevant advertisements and measure their
                  effectiveness
                </li>
                <li>
                  <strong>Communication:</strong> To manage newsletter subscriptions and email
                  preferences
                </li>
              </ul>
            </section>

            {/* Third-Party Cookies */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Third-Party Cookies</h2>
              <p className="text-[var(--color-muted)] leading-relaxed mb-4">
                We use various third-party services that may set cookies on your device:
              </p>

              <div className="space-y-4">
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4">
                  <h4 className="font-medium text-[var(--color-text)] mb-2">Google Analytics</h4>
                  <p className="text-sm text-[var(--color-muted)] mb-2">
                    Purpose: Website analytics and user behavior tracking
                  </p>
                  <p className="text-sm text-[var(--color-muted)]">
                    Privacy Policy:{' '}
                    <a
                      href="https://policies.google.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-500 hover:underline"
                    >
                      Google Privacy Policy
                    </a>
                  </p>
                </div>

                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4">
                  <h4 className="font-medium text-[var(--color-text)] mb-2">Google Ads</h4>
                  <p className="text-sm text-[var(--color-muted)] mb-2">
                    Purpose: Advertising and conversion tracking
                  </p>
                  <p className="text-sm text-[var(--color-muted)]">
                    Privacy Policy:{' '}
                    <a
                      href="https://policies.google.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-500 hover:underline"
                    >
                      Google Privacy Policy
                    </a>
                  </p>
                </div>

                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4">
                  <h4 className="font-medium text-[var(--color-text)] mb-2">Facebook/Meta</h4>
                  <p className="text-sm text-[var(--color-muted)] mb-2">
                    Purpose: Social media integration and advertising
                  </p>
                  <p className="text-sm text-[var(--color-muted)]">
                    Privacy Policy:{' '}
                    <a
                      href="https://www.facebook.com/policy.php"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-500 hover:underline"
                    >
                      Meta Privacy Policy
                    </a>
                  </p>
                </div>

                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4">
                  <h4 className="font-medium text-[var(--color-text)] mb-2">LinkedIn</h4>
                  <p className="text-sm text-[var(--color-muted)] mb-2">
                    Purpose: Professional networking and advertising
                  </p>
                  <p className="text-sm text-[var(--color-muted)]">
                    Privacy Policy:{' '}
                    <a
                      href="https://www.linkedin.com/legal/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-500 hover:underline"
                    >
                      LinkedIn Privacy Policy
                    </a>
                  </p>
                </div>
              </div>
            </section>

            {/* Managing Cookies */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Managing Your Cookie Preferences</h2>

              <h3 className="text-xl font-medium mb-3">Browser Settings</h3>
              <p className="text-[var(--color-muted)] leading-relaxed mb-4">
                You can control cookies through your browser settings. Most browsers allow you to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[var(--color-muted)] mb-6">
                <li>View all cookies stored on your device</li>
                <li>Delete specific cookies or all cookies</li>
                <li>Block cookies from specific websites</li>
                <li>Block third-party cookies</li>
                <li>Receive notifications when cookies are set</li>
              </ul>

              <h3 className="text-xl font-medium mb-3">Browser-Specific Instructions</h3>
              <div className="space-y-4 mb-6">
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4">
                  <h4 className="font-medium text-[var(--color-text)] mb-2">Chrome</h4>
                  <p className="text-sm text-[var(--color-muted)]">
                    Settings → Privacy and security → Cookies and other site data
                  </p>
                </div>
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4">
                  <h4 className="font-medium text-[var(--color-text)] mb-2">Firefox</h4>
                  <p className="text-sm text-[var(--color-muted)]">
                    Options → Privacy & Security → Cookies and Site Data
                  </p>
                </div>
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4">
                  <h4 className="font-medium text-[var(--color-text)] mb-2">Safari</h4>
                  <p className="text-sm text-[var(--color-muted)]">
                    Preferences → Privacy → Cookies and website data
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-medium mb-3">Cookie Consent Banner</h3>
              <p className="text-[var(--color-muted)] leading-relaxed">
                When you first visit our website, you'll see a cookie consent banner where you can
                choose which types of cookies to accept. You can change your preferences at any time
                by clicking the cookie settings icon in the footer.
              </p>
            </section>

            {/* Cookie Lifespan */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Cookie Lifespan</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-brand-500 mt-2"></div>
                  <div>
                    <h4 className="font-medium text-[var(--color-text)]">Session Cookies</h4>
                    <p className="text-sm text-[var(--color-muted)]">
                      Deleted when you close your browser
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-brand-500 mt-2"></div>
                  <div>
                    <h4 className="font-medium text-[var(--color-text)]">Persistent Cookies</h4>
                    <p className="text-sm text-[var(--color-muted)]">
                      Remain on your device for a set period (hours to years)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-brand-500 mt-2"></div>
                  <div>
                    <h4 className="font-medium text-[var(--color-text)]">First-Party Cookies</h4>
                    <p className="text-sm text-[var(--color-muted)]">Set by our website directly</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-brand-500 mt-2"></div>
                  <div>
                    <h4 className="font-medium text-[var(--color-text)]">Third-Party Cookies</h4>
                    <p className="text-sm text-[var(--color-muted)]">
                      Set by external services integrated into our website
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Impact of Disabling Cookies */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Impact of Disabling Cookies</h2>
              <p className="text-[var(--color-muted)] leading-relaxed mb-4">
                Disabling cookies may affect your experience on our website:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[var(--color-muted)]">
                <li>
                  <strong>Essential cookies:</strong> Disabling may prevent the website from
                  functioning properly
                </li>
                <li>
                  <strong>Analytics cookies:</strong> Disabling won't affect functionality but
                  limits our ability to improve the site
                </li>
                <li>
                  <strong>Marketing cookies:</strong> Disabling may result in less relevant
                  advertisements
                </li>
                <li>
                  <strong>Functional cookies:</strong> Disabling may remove personalized features
                  and preferences
                </li>
              </ul>
            </section>

            {/* Updates to Cookie Policy */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Updates to This Cookie Policy</h2>
              <p className="text-[var(--color-muted)] leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in our use of
                cookies or applicable legal requirements. We will notify you of any significant
                changes by posting the updated policy on our website and updating the "Last updated"
                date.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-[var(--color-muted)] leading-relaxed mb-4">
                If you have any questions about our use of cookies or this Cookie Policy, please
                contact us:
              </p>
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6 mt-4">
                <ul className="space-y-2 text-[var(--color-muted)]">
                  <li>
                    <strong>Email:</strong> privacy@liberiadigitalinsights.com
                  </li>
                  <li>
                    <strong>Website:</strong> www.liberiadigitalinsights.com
                  </li>
                  <li>
                    <strong>Address:</strong> Liberia Digital Insights, Monrovia, Liberia
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-[var(--color-border)] text-center">
          <Link
            to="/"
            className="text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CookiePage;
