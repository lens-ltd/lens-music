import { Link, useNavigate } from 'react-router-dom';
import PublicFooter from '@/components/layout/PublicFooter';
import PublicNavbar from '@/components/layout/PublicNavbar';
import Button from '@/components/inputs/Button';
import { SectionLabel } from '@/pages/landing/landingShared';
import Navbar from '@/containers/Navbar';
import { useAppSelector } from '@/state/hooks';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { token } = useAppSelector((state) => state.auth);

  return (
    <main className="min-h-screen bg-(--paper) text-(--ink) overflow-x-hidden">
      {token ? <Navbar /> : <PublicNavbar scrolled variant="landing" />}

      <section className="pb-16 md:pb-20">
        <article className="mx-auto max-w-4xl px-6 min-h-[calc(100vh-64px)] flex items-center justify-center">
          <section className="card-framed w-full p-7 md:p-12">
            <SectionLabel>Error 404</SectionLabel>
            <h1 className="mt-4 type-display">
              This page missed the beat.
            </h1>
            <p className="mt-5 max-w-[46ch] type-body text-(--slate)">
              The route you entered does not exist. Return to the homepage or
              sign in to continue managing releases, artists, and analytics.
            </p>

            <section className="mt-8 flex flex-col w-full sm:flex-row gap-3 sm:items-center">
              <Button route="#" onClick={(e) => {
                e.preventDefault();
                navigate(-1);
              }}>
                Back
              </Button>
              <Button primary route="/">
                Explore
              </Button>
            </section>

            <p className="mt-8 type-meta">
              Need help? Visit the{' '}
              <Link to="/#faq" className="link-sweep text-(--lens-blue)">
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
