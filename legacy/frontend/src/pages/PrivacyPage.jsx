import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <div className="mx-auto max-w-4xl px-6 py-12 md:px-8 md:py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <Link to="/" className="inline-flex items-center gap-3 mb-8">
            <Logo />
          </Link>
          <h1 className="text-4xl font-bold text-[var(--color-text)] mb-4">Privacy Policy</h1>
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
              <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
              <p className="text-[var(--color-muted)] leading-relaxed">
                Liberia Digital Insights ("we," "us," or "our") is committed to protecting your
                privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard
                your information when you visit our website liberiadigitalinsights.com and use our
                services.
              </p>
              <p className="text-[var(--color-muted)] leading-relaxed">
                By using our website, you consent to the collection and use of information in
                accordance with this policy.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>

              <h3 className="text-xl font-medium mb-3">Personal Information</h3>
              <p className="text-[var(--color-muted)] leading-relaxed mb-4">
                We may collect personally identifiable information that you voluntarily provide to
                us, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[var(--color-muted)] mb-6">
                <li>Name and email address (for newsletter subscription)</li>
                <li>Company and organization details</li>
                <li>Job position and professional information</li>
                <li>Contact information submitted through our forms</li>
                <li>Comments and feedback you provide</li>
              </ul>

              <h3 className="text-xl font-medium mb-3">Automatically Collected Information</h3>
              <p className="text-[var(--color-muted)] leading-relaxed mb-4">
                When you visit our website, we automatically collect certain technical information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[var(--color-muted)] mb-6">
                <li>IP address and geolocation data</li>
                <li>Browser type, operating system, and device information</li>
                <li>Pages visited and time spent on our site</li>
                <li>Referring website and search terms</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
              <p className="text-[var(--color-muted)] leading-relaxed mb-4">
                We use the information we collect for various purposes, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[var(--color-muted)]">
                <li>To provide and maintain our website and services</li>
                <li>To send you our newsletter with insights and updates</li>
                <li>To respond to your inquiries and provide customer support</li>
                <li>To improve our website based on user feedback and analytics</li>
                <li>To monitor usage patterns and analyze website performance</li>
                <li>To detect, prevent, and address technical issues</li>
                <li>To comply with legal obligations and protect our rights</li>
              </ul>
            </section>

            {/* Information Sharing */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Information Sharing and Disclosure</h2>
              <p className="text-[var(--color-muted)] leading-relaxed mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third
                parties without your consent, except as described in this policy:
              </p>

              <h3 className="text-xl font-medium mb-3">Service Providers</h3>
              <p className="text-[var(--color-muted)] leading-relaxed mb-4">
                We may share information with trusted third-party service providers who assist us in
                operating our website, such as:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[var(--color-muted)] mb-6">
                <li>Email marketing services (for newsletter delivery)</li>
                <li>Web hosting and analytics providers</li>
                <li>Customer support platforms</li>
              </ul>

              <h3 className="text-xl font-medium mb-3">Legal Requirements</h3>
              <p className="text-[var(--color-muted)] leading-relaxed">
                We may disclose your information if required by law or in good faith belief that
                such action is necessary to comply with legal obligations, protect our rights, or
                investigate fraud.
              </p>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
              <p className="text-[var(--color-muted)] leading-relaxed">
                We implement appropriate technical and organizational measures to protect your
                personal information against unauthorized access, alteration, disclosure, or
                destruction. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking Technologies</h2>
              <p className="text-[var(--color-muted)] leading-relaxed mb-4">
                We use cookies and similar tracking technologies to enhance your experience on our
                website:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[var(--color-muted)]">
                <li>
                  <strong>Essential Cookies:</strong> Required for basic website functionality
                </li>
                <li>
                  <strong>Analytics Cookies:</strong> Help us understand how visitors interact with
                  our site
                </li>
                <li>
                  <strong>Marketing Cookies:</strong> Used to deliver relevant content and
                  advertisements
                </li>
              </ul>
              <p className="text-[var(--color-muted)] leading-relaxed mt-4">
                You can control cookie settings through your browser preferences.
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Your Privacy Rights</h2>
              <p className="text-[var(--color-muted)] leading-relaxed mb-4">
                You have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[var(--color-muted)]">
                <li>Access and review your personal information</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Request deletion of your personal information</li>
                <li>Opt-out of marketing communications</li>
                <li>Request a copy of your data (data portability)</li>
              </ul>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
              <p className="text-[var(--color-muted)] leading-relaxed">
                Our website is not intended for children under 13 years of age. We do not knowingly
                collect personal information from children under 13. If you become aware that we
                have collected information from a child under 13, please contact us immediately.
              </p>
            </section>

            {/* International Data Transfers */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">International Data Transfers</h2>
              <p className="text-[var(--color-muted)] leading-relaxed">
                Your information may be transferred to and processed in countries other than your
                own. We ensure appropriate safeguards are in place to protect your data in
                accordance with applicable data protection laws.
              </p>
            </section>

            {/* Changes to This Policy */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Changes to This Privacy Policy</h2>
              <p className="text-[var(--color-muted)] leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any
                changes by posting the new policy on this page and updating the "Last updated" date.
                You are advised to review this policy periodically for any changes.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-[var(--color-muted)] leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data practices, please
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

export default PrivacyPage;
