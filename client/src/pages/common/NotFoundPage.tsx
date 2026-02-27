import { Link, useNavigate } from 'react-router-dom';
import PublicFooter from '@/components/layout/PublicFooter';
import PublicNavbar from '@/components/layout/PublicNavbar';
import Button from '@/components/inputs/Button';
import { LandingPageStyles, SectionLabel } from '@/pages/landing/landingShared';
import Navbar from '@/containers/Navbar';
import { useAppSelector } from '@/state/hooks';

export default function NotFoundPage() {

  // NAVIGATION
  const navigate = useNavigate();

  // STATE VARIABLES
  const { token } = useAppSelector((state) => state.auth);

  return (
    <main
      className="h-screen bg-white text-[color:var(--lens-ink)] overflow-x-hidden"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      <LandingPageStyles />
      {token ? <Navbar /> : <PublicNavbar scrolled variant="landing" />}

      <section className="pb-18 md:pb-24">
        <article className="mx-auto max-w-4xl px-6 h-full min-h-[calc(100vh-64px)] flex items-center justify-center">
          <section className="rounded-2xl border border-[color:var(--lens-sand)] bg-white/90 p-7 md:p-12 shadow-[0_20px_60px_-30px_rgba(16,14,9,0.25)]">
            <SectionLabel>Error 404</SectionLabel>
            <h1 className="mt-4 text-[clamp(36px,8vw,72px)] leading-[0.95] tracking-[-0.03em] text-[color:var(--lens-ink)]">
              This page missed the beat.
            </h1>
            <p className="mt-5 max-w-2xl text-[14px] leading-7 text-[color:var(--lens-ink)]/72">
              The route you entered does not exist. Return to the homepage or
              sign in to continue managing releases, artists, and analytics.
            </p>

            <section className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center">
              <Button route="#" onClick={(e) => {
                e.preventDefault();
                navigate(-1);
              }} primary className="px-6 py-2.5 text-[12px] tracking-[0.04em]">
                Back
              </Button>
              <Button route="/" className="px-6 py-2.5 text-[12px] tracking-[0.04em]">
                Explore
              </Button>
            </section>

            <p className="mt-8 text-[11px] text-[color:var(--lens-ink)]/55">
              Need help? Visit the{' '}
              <Link
                to="/#faq"
                className="underline underline-offset-4 hover:text-[color:var(--lens-blue)] transition-colors"
              >
                FAQ section
              </Link>
              .
            </p>
          </section>
        </article>
      </section>

      <PublicFooter />
    </main>
  );
}
