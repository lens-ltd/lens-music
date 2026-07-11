import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicFooter from '@/components/layout/PublicFooter';
import PublicNavbar from '@/components/layout/PublicNavbar';
import { LandingPageStyles } from '@/pages/landing/landingShared';

export default function TermsOfService() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const onScroll = () => setScrolled(window.scrollY > 64);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <main
      className="min-h-screen bg-white text-[color:var(--lens-ink)]"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      <LandingPageStyles />
      <PublicNavbar scrolled={scrolled} variant="landing" />
      
      <article className="max-w-4xl mx-auto px-6 py-24">
        {/* Header */}
        <header className="mb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-[color:var(--lens-blue)] hover:underline mb-6"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--lens-ink)' }}>
            Terms of Service
          </h1>
          <p className="text-sm" style={{ color: 'rgba(0,0,0,0.5)' }}>
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--lens-ink)' }}>
              1. Agreement to Terms
            </h2>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              These Terms of Service ("Terms") constitute a legally binding agreement between you and Lens Music ("Company," "we," "us," or "our") concerning your access to and use of the Lens Music platform and services.
            </p>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              By accessing or using our services, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use our services.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--lens-ink)' }}>
              2. Service Description
            </h2>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              Lens Music provides a digital music distribution platform that enables artists, labels, and rights holders to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2" style={{ color: 'rgba(0,0,0,0.75)' }}>
              <li>Upload and distribute music to streaming platforms and digital stores</li>
              <li>Manage release metadata, contributors, and rights information</li>
              <li>Track performance analytics and royalty earnings</li>
              <li>Manage lyrics and synchronization data</li>
              <li>Collaborate with team members and contributors</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--lens-ink)' }}>
              3. Account Registration and Eligibility
            </h2>
            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: 'var(--lens-ink)' }}>
              3.1 Eligibility
            </h3>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              You must be at least 18 years old to use our services. By creating an account, you represent and warrant that you meet this age requirement and have the legal capacity to enter into these Terms.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: 'var(--lens-ink)' }}>
              3.2 Account Security
            </h3>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              You are responsible for:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2" style={{ color: 'rgba(0,0,0,0.75)' }}>
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized access or security breach</li>
              <li>Providing accurate and complete registration information</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: 'var(--lens-ink)' }}>
              3.3 Account Termination
            </h3>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              We reserve the right to suspend or terminate your account at any time for violation of these Terms, fraudulent activity, or any other reason at our sole discretion.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--lens-ink)' }}>
              4. Content Rights and Licenses
            </h2>
            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: 'var(--lens-ink)' }}>
              4.1 Your Content
            </h3>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              You retain all ownership rights to the music, artwork, and other content you upload to Lens Music ("Your Content"). By uploading Your Content, you represent and warrant that:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2" style={{ color: 'rgba(0,0,0,0.75)' }}>
              <li>You own or have obtained all necessary rights, licenses, and permissions for Your Content</li>
              <li>Your Content does not infringe upon any third-party intellectual property rights</li>
              <li>Your Content complies with all applicable laws and regulations</li>
              <li>You have the authority to grant the licenses described in these Terms</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: 'var(--lens-ink)' }}>
              4.2 License Grant to Lens Music
            </h3>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              By uploading Your Content, you grant Lens Music a worldwide, non-exclusive, royalty-free license to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2" style={{ color: 'rgba(0,0,0,0.75)' }}>
              <li>Store, process, and transmit Your Content as necessary to provide our services</li>
              <li>Distribute Your Content to streaming platforms, digital stores, and other distribution partners</li>
              <li>Create derivative works for technical purposes (e.g., format conversion, encoding)</li>
              <li>Display Your Content in promotional materials with your prior consent</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: 'var(--lens-ink)' }}>
              4.3 Content Removal
            </h3>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              We reserve the right to remove or refuse to distribute any content that violates these Terms, infringes upon third-party rights, or is otherwise objectionable in our sole discretion.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--lens-ink)' }}>
              5. Revenue Share and Payments
            </h2>
            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: 'var(--lens-ink)' }}>
              5.1 Revenue Share Model
            </h3>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              Lens Music operates on a revenue share model. Distribution is free, and we charge a <strong>15% revenue share</strong> on earnings generated through the platform. This means you retain 85% of all royalties earned from streaming platforms and digital stores.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: 'var(--lens-ink)' }}>
              5.2 Payment Terms
            </h3>
            <ul className="list-disc pl-6 mb-4 space-y-2" style={{ color: 'rgba(0,0,0,0.75)' }}>
              <li>Royalty payments are processed monthly, subject to a minimum payout threshold</li>
              <li>Payments are made via bank transfer or other agreed-upon methods</li>
              <li>You are responsible for providing accurate payment information</li>
              <li>Payment timing may vary based on when we receive funds from distribution partners</li>
              <li>You are responsible for any applicable taxes on your earnings</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: 'var(--lens-ink)' }}>
              5.3 Reporting
            </h3>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              We provide analytics and reporting tools to track your earnings and performance. While we strive for accuracy, reporting data is provided "as is" and may be subject to adjustments based on information received from distribution partners.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--lens-ink)' }}>
              6. Prohibited Conduct
            </h2>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              You agree not to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2" style={{ color: 'rgba(0,0,0,0.75)' }}>
              <li>Upload content that infringes upon third-party intellectual property rights</li>
              <li>Engage in fraudulent streaming or artificial inflation of play counts</li>
              <li>Use automated systems or bots to access or interact with our services</li>
              <li>Attempt to circumvent security measures or access restricted areas</li>
              <li>Upload malicious code, viruses, or harmful content</li>
              <li>Impersonate another person or entity</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Use our services for any illegal purpose</li>
              <li>Reverse engineer or attempt to extract source code from our platform</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--lens-ink)' }}>
              7. Intellectual Property
            </h2>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              The Lens Music platform, including its design, features, functionality, and underlying technology, is owned by Lens Music and protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or create derivative works based on our platform without our express written permission.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--lens-ink)' }}>
              8. Third-Party Services
            </h2>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              Our services may integrate with or link to third-party platforms, services, and websites. We are not responsible for the content, policies, or practices of these third parties. Your use of third-party services is subject to their respective terms and conditions.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--lens-ink)' }}>
              9. Disclaimers and Limitations of Liability
            </h2>
            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: 'var(--lens-ink)' }}>
              9.1 Service Availability
            </h3>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              Our services are provided "as is" and "as available" without warranties of any kind. We do not guarantee uninterrupted, error-free, or secure access to our platform. We reserve the right to modify, suspend, or discontinue any aspect of our services at any time.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: 'var(--lens-ink)' }}>
              9.2 Limitation of Liability
            </h3>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              To the maximum extent permitted by law, Lens Music shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or goodwill, arising from your use of our services.
            </p>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              Our total liability to you for any claims arising from these Terms or your use of our services shall not exceed the amount you paid to us in the twelve (12) months preceding the claim.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--lens-ink)' }}>
              10. Indemnification
            </h2>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              You agree to indemnify, defend, and hold harmless Lens Music and its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2" style={{ color: 'rgba(0,0,0,0.75)' }}>
              <li>Your violation of these Terms</li>
              <li>Your Content or its distribution</li>
              <li>Your infringement of any third-party rights</li>
              <li>Your use of our services</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--lens-ink)' }}>
              11. Dispute Resolution
            </h2>
            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: 'var(--lens-ink)' }}>
              11.1 Governing Law
            </h3>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              These Terms shall be governed by and construed in accordance with the laws of Rwanda, without regard to its conflict of law provisions.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: 'var(--lens-ink)' }}>
              11.2 Arbitration
            </h3>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              Any disputes arising from these Terms or your use of our services shall be resolved through binding arbitration in accordance with the rules of the Kigali International Arbitration Centre, except where prohibited by law.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--lens-ink)' }}>
              12. Changes to Terms
            </h2>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the updated Terms on our platform and updating the "Last updated" date. Your continued use of our services after such changes constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--lens-ink)' }}>
              13. Termination
            </h2>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              Either party may terminate this agreement at any time. Upon termination:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2" style={{ color: 'rgba(0,0,0,0.75)' }}>
              <li>Your access to our services will be revoked</li>
              <li>We will cease distributing Your Content to new platforms</li>
              <li>Existing distributions may remain active until removed by distribution partners</li>
              <li>You remain entitled to any earned but unpaid royalties</li>
              <li>Provisions regarding intellectual property, indemnification, and liability shall survive termination</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--lens-ink)' }}>
              14. General Provisions
            </h2>
            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: 'var(--lens-ink)' }}>
              14.1 Entire Agreement
            </h3>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              These Terms, together with our Privacy Policy and Artist Agreement, constitute the entire agreement between you and Lens Music regarding your use of our services.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: 'var(--lens-ink)' }}>
              14.2 Severability
            </h3>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: 'var(--lens-ink)' }}>
              14.3 Waiver
            </h3>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              Our failure to enforce any provision of these Terms shall not constitute a waiver of that provision or any other provision.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: 'var(--lens-ink)' }}>
              14.4 Assignment
            </h3>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              You may not assign or transfer these Terms without our prior written consent. We may assign these Terms at any time without notice.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--lens-ink)' }}>
              15. Contact Information
            </h2>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              If you have questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <p className="mb-2" style={{ color: 'rgba(0,0,0,0.75)' }}>
                <strong>Lens Music</strong>
              </p>
              <p className="mb-2" style={{ color: 'rgba(0,0,0,0.75)' }}>
                Email: legal@lensmusic.rw
              </p>
              <p className="mb-2" style={{ color: 'rgba(0,0,0,0.75)' }}>
                Address: Kigali, Rwanda
              </p>
            </div>
          </section>
        </div>
      </article>

      <PublicFooter />
    </main>
  );
}
