import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicFooter from '@/components/layout/PublicFooter';
import PublicNavbar from '@/components/layout/PublicNavbar';
import { LandingPageStyles } from '@/pages/landing/landingShared';

export default function ArtistAgreement() {
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
            Artist Agreement
          </h1>
          <p className="text-sm" style={{ color: 'rgba(0,0,0,0.5)' }}>
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--lens-ink)' }}>
              1. Introduction
            </h2>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              This Artist Agreement ("Agreement") is entered into between you ("Artist," "you," or "your") and Lens Music ("Lens," "we," "us," or "our"). This Agreement governs the distribution of your musical recordings and related content through the Lens Music platform.
            </p>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              By uploading content to Lens Music, you acknowledge that you have read, understood, and agree to be bound by this Agreement, along with our Terms of Service and Privacy Policy.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--lens-ink)' }}>
              2. Definitions
            </h2>
            <ul className="list-disc pl-6 mb-4 space-y-2" style={{ color: 'rgba(0,0,0,0.75)' }}>
              <li><strong>"Recordings"</strong> means the sound recordings, musical compositions, and related audio content you upload to Lens Music.</li>
              <li><strong>"Metadata"</strong> means all information associated with your Recordings, including titles, artist names, album artwork, credits, and release dates.</li>
              <li><strong>"Distribution Partners"</strong> means streaming platforms, digital stores, and other services where Lens Music delivers your Recordings.</li>
              <li><strong>"Net Receipts"</strong> means all revenues received by Lens Music from Distribution Partners for the exploitation of your Recordings, after deduction of any third-party fees, chargebacks, or refunds.</li>
              <li><strong>"Territory"</strong> means worldwide unless otherwise specified.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--lens-ink)' }}>
              3. Grant of Rights
            </h2>
            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: 'var(--lens-ink)' }}>
              3.1 Distribution Rights
            </h3>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              You grant Lens Music the non-exclusive right to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2" style={{ color: 'rgba(0,0,0,0.75)' }}>
              <li>Distribute, reproduce, and transmit your Recordings to Distribution Partners worldwide</li>
              <li>Encode, transcode, and format your Recordings as required by Distribution Partners</li>
              <li>Display and promote your Recordings and Metadata on the Lens Music platform</li>
              <li>Collect and remit royalties on your behalf from Distribution Partners</li>
              <li>Use your artist name, likeness, and biographical information for promotional purposes related to your Recordings</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: 'var(--lens-ink)' }}>
              3.2 Territory and Term
            </h3>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              The rights granted under this Agreement apply worldwide and remain in effect until terminated by either party in accordance with Section 11 (Termination).
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: 'var(--lens-ink)' }}>
              3.3 Retained Rights
            </h3>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              You retain all ownership rights to your Recordings. This Agreement grants only the distribution rights necessary for Lens Music to provide its services. You remain free to exploit your Recordings in any manner not conflicting with the rights granted herein.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--lens-ink)' }}>
              4. Artist Representations and Warranties
            </h2>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              You represent and warrant that:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2" style={{ color: 'rgba(0,0,0,0.75)' }}>
              <li>You own or control all rights necessary to grant the licenses in this Agreement</li>
              <li>Your Recordings do not infringe upon any third-party intellectual property rights</li>
              <li>You have obtained all necessary permissions, clearances, and licenses for samples, interpolations, or other third-party content</li>
              <li>All Metadata provided is accurate and complete</li>
              <li>You have the authority to enter into this Agreement and fulfill its obligations</li>
              <li>Your Recordings comply with all applicable laws and do not contain defamatory, obscene, or illegal content</li>
              <li>You have obtained all necessary consents from featured artists, producers, and other contributors</li>
              <li>You are not subject to any conflicting agreements that would prevent you from fulfilling this Agreement</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--lens-ink)' }}>
              5. Revenue Share and Royalties
            </h2>
            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: 'var(--lens-ink)' }}>
              5.1 Revenue Split
            </h3>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              Lens Music operates on a transparent revenue share model:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2" style={{ color: 'rgba(0,0,0,0.75)' }}>
              <li><strong>Artist Share:</strong> You receive 85% of Net Receipts</li>
              <li><strong>Lens Music Share:</strong> Lens Music retains 15% of Net Receipts</li>
            </ul>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              There are no upfront fees, annual charges, or hidden costs. You only pay when you earn.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: 'var(--lens-ink)' }}>
              5.2 Payment Schedule
            </h3>
            <ul className="list-disc pl-6 mb-4 space-y-2" style={{ color: 'rgba(0,0,0,0.75)' }}>
              <li>Royalty statements and payments are issued monthly</li>
              <li>Payments are subject to a minimum threshold of $10 USD (or equivalent)</li>
              <li>Earnings below the threshold roll over to the next payment period</li>
              <li>Payment timing depends on when Lens Music receives funds from Distribution Partners (typically 60-90 days after the reporting period)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: 'var(--lens-ink)' }}>
              5.3 Payment Methods
            </h3>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              Payments are made via:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2" style={{ color: 'rgba(0,0,0,0.75)' }}>
              <li>Bank transfer (preferred method)</li>
              <li>Mobile money (for supported regions)</li>
              <li>Other methods as mutually agreed upon</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: 'var(--lens-ink)' }}>
              5.4 Taxes
            </h3>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              You are solely responsible for all taxes on your earnings. Lens Music may be required to withhold taxes as mandated by applicable law. You agree to provide all necessary tax documentation upon request.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--lens-ink)' }}>
              6. Content Delivery and Quality Standards
            </h2>
            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: 'var(--lens-ink)' }}>
              6.1 Technical Requirements
            </h3>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              Your Recordings must meet the following standards:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2" style={{ color: 'rgba(0,0,0,0.75)' }}>
              <li>Audio format: WAV or FLAC (lossless formats preferred)</li>
              <li>Sample rate: 44.1 kHz or higher</li>
              <li>Bit depth: 16-bit or higher</li>
              <li>Artwork: Minimum 3000x3000 pixels, JPG or PNG format</li>
              <li>No audio clipping, distortion, or technical defects</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: 'var(--lens-ink)' }}>
              6.2 Metadata Accuracy
            </h3>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              You must provide accurate and complete Metadata, including:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2" style={{ color: 'rgba(0,0,0,0.75)' }}>
              <li>Correct artist names, track titles, and album information</li>
              <li>Accurate credits for all contributors (writers, producers, performers)</li>
              <li>Proper genre classification</li>
              <li>Valid ISRC codes (if available)</li>
              <li>Correct release dates and territories</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: 'var(--lens-ink)' }}>
              6.3 Content Review
            </h3>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              Lens Music reserves the right to review all Recordings and Metadata before distribution. We may reject or request modifications to content that:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2" style={{ color: 'rgba(0,0,0,0.75)' }}>
              <li>Does not meet technical quality standards</li>
              <li>Contains inaccurate or incomplete Metadata</li>
              <li>Violates Distribution Partner guidelines</li>
              <li>Infringes upon third-party rights</li>
              <li>Contains prohibited content</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--lens-ink)' }}>
              7. Distribution and Delivery
            </h2>
            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: 'var(--lens-ink)' }}>
              7.1 Distribution Partners
            </h3>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              Lens Music will use commercially reasonable efforts to distribute your Recordings to major streaming platforms and digital stores, including but not limited to Spotify, Apple Music, YouTube Music, Amazon Music, and others.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: 'var(--lens-ink)' }}>
              7.2 Delivery Timeline
            </h3>
            <ul className="list-disc pl-6 mb-4 space-y-2" style={{ color: 'rgba(0,0,0,0.75)' }}>
              <li>Recordings are typically delivered to Distribution Partners within 3-5 business days of approval</li>
              <li>Live dates on platforms vary (typically 1-7 days after delivery)</li>
              <li>We recommend submitting releases at least 2 weeks before your desired release date</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: 'var(--lens-ink)' }}>
              7.3 No Guarantee of Acceptance
            </h3>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              While we deliver your Recordings to Distribution Partners, we cannot guarantee that all partners will accept or feature your content. Distribution Partners maintain their own content policies and editorial discretion.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--lens-ink)' }}>
              8. Analytics and Reporting
            </h2>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              Lens Music provides analytics and reporting tools to track:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2" style={{ color: 'rgba(0,0,0,0.75)' }}>
              <li>Streaming and download statistics</li>
              <li>Revenue and royalty earnings</li>
              <li>Geographic performance data</li>
              <li>Platform-specific metrics</li>
            </ul>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              Reporting data is provided "as is" based on information received from Distribution Partners. While we strive for accuracy, data may be subject to delays or adjustments.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--lens-ink)' }}>
              9. Takedowns and Content Removal
            </h2>
            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: 'var(--lens-ink)' }}>
              9.1 Artist-Initiated Takedowns
            </h3>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              You may request removal of your Recordings from distribution at any time. Takedown requests are processed within 5-10 business days, though complete removal from all platforms may take longer due to Distribution Partner processing times.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: 'var(--lens-ink)' }}>
              9.2 Lens-Initiated Takedowns
            </h3>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              Lens Music may remove your Recordings if:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2" style={{ color: 'rgba(0,0,0,0.75)' }}>
              <li>We receive a valid copyright infringement claim</li>
              <li>Your content violates this Agreement or our Terms of Service</li>
              <li>Distribution Partners request removal</li>
              <li>We detect fraudulent activity or artificial streaming</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: 'var(--lens-ink)' }}>
              9.3 Effect of Takedown
            </h3>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              Upon takedown, you remain entitled to any earned but unpaid royalties. However, Lens Music is not liable for any loss of revenue, exposure, or other damages resulting from content removal.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--lens-ink)' }}>
              10. Prohibited Activities
            </h2>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              You agree not to engage in:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2" style={{ color: 'rgba(0,0,0,0.75)' }}>
              <li><strong>Stream Manipulation:</strong> Using bots, click farms, or other artificial means to inflate play counts</li>
              <li><strong>Duplicate Content:</strong> Uploading the same Recording multiple times under different names or accounts</li>
              <li><strong>Misleading Metadata:</strong> Providing false or misleading information about your Recordings</li>
              <li><strong>Rights Violations:</strong> Distributing content you do not have the right to distribute</li>
              <li><strong>Platform Gaming:</strong> Attempting to manipulate algorithms or editorial placements</li>
            </ul>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              Violation of these prohibitions may result in immediate termination of this Agreement, removal of all content, and forfeiture of unpaid royalties.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--lens-ink)' }}>
              11. Termination
            </h2>
            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: 'var(--lens-ink)' }}>
              11.1 Termination by Artist
            </h3>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              You may terminate this Agreement at any time by providing written notice to Lens Music. Upon termination, we will cease distributing your Recordings to new platforms and initiate takedown procedures.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: 'var(--lens-ink)' }}>
              11.2 Termination by Lens Music
            </h3>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              Lens Music may terminate this Agreement immediately if:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2" style={{ color: 'rgba(0,0,0,0.75)' }}>
              <li>You breach any material term of this Agreement</li>
              <li>You engage in fraudulent or illegal activity</li>
              <li>Your account remains inactive for an extended period</li>
              <li>We cease operations or discontinue our services</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: 'var(--lens-ink)' }}>
              11.3 Effect of Termination
            </h3>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              Upon termination:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2" style={{ color: 'rgba(0,0,0,0.75)' }}>
              <li>All distribution rights granted to Lens Music will cease</li>
              <li>Existing distributions may remain active until removed by Distribution Partners</li>
              <li>You remain entitled to any earned but unpaid royalties</li>
              <li>Provisions regarding indemnification, liability, and confidentiality survive termination</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--lens-ink)' }}>
              12. Indemnification
            </h2>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              You agree to indemnify and hold harmless Lens Music, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including reasonable legal fees) arising from:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2" style={{ color: 'rgba(0,0,0,0.75)' }}>
              <li>Your breach of this Agreement</li>
              <li>Your Recordings or Metadata</li>
              <li>Your infringement of third-party rights</li>
              <li>Your violation of applicable laws</li>
              <li>Claims by contributors, collaborators, or other third parties</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--lens-ink)' }}>
              13. Limitation of Liability
            </h2>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              To the maximum extent permitted by law:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2" style={{ color: 'rgba(0,0,0,0.75)' }}>
              <li>Lens Music is not liable for any indirect, incidental, special, or consequential damages</li>
              <li>Our total liability shall not exceed the amount paid to you in the twelve (12) months preceding the claim</li>
              <li>We are not responsible for actions or omissions of Distribution Partners</li>
              <li>We do not guarantee specific revenue, streaming numbers, or promotional outcomes</li>
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
              This Agreement, together with our Terms of Service and Privacy Policy, constitutes the entire agreement between you and Lens Music regarding the distribution of your Recordings.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: 'var(--lens-ink)' }}>
              14.2 Amendments
            </h3>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              Lens Music may modify this Agreement at any time. Material changes will be communicated via email or platform notification. Your continued use of our services after such changes constitutes acceptance.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: 'var(--lens-ink)' }}>
              14.3 Governing Law
            </h3>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              This Agreement is governed by the laws of Rwanda. Any disputes shall be resolved through arbitration in Kigali, Rwanda.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: 'var(--lens-ink)' }}>
              14.4 Assignment
            </h3>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              You may not assign this Agreement without our prior written consent. Lens Music may assign this Agreement at any time.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: 'var(--lens-ink)' }}>
              14.5 Severability
            </h3>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              If any provision of this Agreement is found invalid or unenforceable, the remaining provisions remain in full force and effect.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--lens-ink)' }}>
              15. Contact Information
            </h2>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              For questions about this Artist Agreement, please contact:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <p className="mb-2" style={{ color: 'rgba(0,0,0,0.75)' }}>
                <strong>Lens Music</strong>
              </p>
              <p className="mb-2" style={{ color: 'rgba(0,0,0,0.75)' }}>
                Email: artists@lensmusic.rw
              </p>
              <p className="mb-2" style={{ color: 'rgba(0,0,0,0.75)' }}>
                Support: support@lensmusic.rw
              </p>
              <p className="mb-2" style={{ color: 'rgba(0,0,0,0.75)' }}>
                Address: Kigali, Rwanda
              </p>
            </div>
          </section>

          <section className="mb-10 bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--lens-ink)' }}>
              Acknowledgment
            </h2>
            <p className="mb-4 leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              By uploading content to Lens Music, you acknowledge that you have read, understood, and agree to be bound by this Artist Agreement. You confirm that you have the authority to enter into this Agreement and that all representations and warranties made herein are true and accurate.
            </p>
            <p className="leading-relaxed" style={{ color: 'rgba(0,0,0,0.75)' }}>
              If you do not agree to these terms, please do not upload content to our platform.
            </p>
          </section>
        </div>
      </article>

      <PublicFooter />
    </main>
  );
}
