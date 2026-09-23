import { Link, useNavigate } from 'react-router-dom';
import PublicFooter from '@/components/layout/PublicFooter';
import PublicNavbar from '@/components/layout/PublicNavbar';
import Button from '@/components/inputs/Button';
import Navbar from '@/containers/Navbar';
import { useAppSelector } from '@/state/hooks';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { token } = useAppSelector((state) => state.auth);

  return (
    <main className="min-h-screen bg-(--paper) text-(--ink) overflow-x-hidden">
      {token ? <Navbar /> : <PublicNavbar scrolled variant="landing" />}

      <section className="app-container flex min-h-[calc(100vh-64px)] flex-col justify-center py-24">
        <p className="type-meta">Error 404</p>
        <h1 className="mt-3 type-hero max-w-[16ch]">This page doesn't exist.</h1>
        <p className="mt-6 max-w-[46ch] type-body text-(--muted)">
          The link may be broken or the page may have moved. Go back, or start
          again from the home page.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button primary route="/">
            Go to home
          </Button>
          <Button
            route="#"
            onClick={(e) => {
              e.preventDefault();
              navigate(-1);
            }}
          >
            Go back
          </Button>
        </div>

        <p className="mt-10 type-meta">
          Have a question?{' '}
          <Link to="/#faq" className="link-sweep text-(--signal)">
            Read the FAQ
          </Link>
        </p>
      </section>

      <PublicFooter />
    </main>
  );
}
