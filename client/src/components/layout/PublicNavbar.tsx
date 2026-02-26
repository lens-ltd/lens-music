import { FC } from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/inputs/Button';
import LensLogo from '/logo.png';

interface PublicNavbarProps {
  scrolled?: boolean;
  variant?: 'landing' | 'auth';
}

const PublicNavbar: FC<PublicNavbarProps> = ({ scrolled, variant = 'landing' }) => {
  const landingLinks = [
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Revenue analytics', href: '#analytics' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ];

  const authCta =
    typeof window !== 'undefined' && window.location.pathname.includes('/signup')
      ? { label: 'Sign in', to: '/auth/login' }
      : { label: 'Create account', to: '/auth/signup' };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || variant === 'auth'
          ? 'bg-white/95 backdrop-blur-sm border-b border-[color:var(--lens-sand)]'
          : 'bg-transparent'
      }`}
      style={{ height: '64px' }}
    >
      <nav className="max-w-6xl mx-auto h-full flex items-center justify-between px-6" aria-label="Main navigation">
        <Link
          to="/"
          aria-label="Lens Music home"
          className="rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--lens-blue)]"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <img src={LensLogo} alt="Lens Logo" className="w-10 h-10 rounded-md bg-slate-600" />
        </Link>

        {variant === 'auth' ? (
          <ul className="flex items-center gap-3 list-none m-0 p-0" role="list">
            <li className="hidden sm:block">
              <Link
                to="/"
                className="text-[12px] tracking-[0.04em] text-[color:var(--lens-ink)] opacity-70 hover:opacity-100"
                style={{ fontFamily: 'var(--font-sans)', fontWeight: 400 }}
              >
                Back to home
              </Link>
            </li>
            <li>
              <Button route={authCta.to} primary className="px-4 py-2 text-[12px] tracking-[0.03em] font-normal">
                {authCta.label}
              </Button>
            </li>
          </ul>
        ) : (
          <>
            <ul className="hidden md:flex items-center gap-7 list-none m-0 p-0" role="list">
              {landingLinks.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="nav-link text-[color:var(--lens-ink)] opacity-70 hover:opacity-100 text-[12px] tracking-[0.05em]"
                    style={{ fontFamily: 'var(--font-sans)', fontWeight: 400 }}
                  >
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  to="/auth/login"
                  className="nav-link text-[color:var(--lens-ink)] opacity-70 hover:opacity-100 text-[12px] tracking-[0.05em]"
                  style={{ fontFamily: 'var(--font-sans)', fontWeight: 400 }}
                >
                  Sign in
                </Link>
              </li>
              <li>
                <Button route="/auth/signup" primary className="px-5 py-2 text-[12px] tracking-[0.04em] font-normal">
                  Create account
                </Button>
              </li>
            </ul>

            <details className="md:hidden relative" id="mobile-nav">
              <summary
                className="list-none cursor-pointer p-2 rounded focus-visible:outline-2 focus-visible:outline-[color:var(--lens-blue)]"
                aria-label="Open navigation menu"
              >
                <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden="true">
                  <rect y="0" width="22" height="1.5" rx="1" fill="rgb(16,14,9)" />
                  <rect y="7" width="22" height="1.5" rx="1" fill="rgb(16,14,9)" />
                  <rect y="14" width="22" height="1.5" rx="1" fill="rgb(16,14,9)" />
                </svg>
              </summary>
              <div className="absolute top-full right-0 mt-2 w-60 bg-white border border-[color:var(--lens-sand)] rounded-xl p-3">
                <ul className="flex flex-col gap-1 list-none m-0 p-0" role="list">
                  {landingLinks.map(({ label, href }) => (
                    <li key={label}>
                      <a
                        href={href}
                        className="block px-3 py-2 rounded-md text-[12px] text-[color:var(--lens-ink)] hover:bg-[color:var(--lens-sand)]/40"
                        style={{ fontFamily: 'var(--font-sans)', fontWeight: 400 }}
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                  <li className="pt-2 mt-1 border-t border-[color:var(--lens-sand)]">
                    <Button route="/auth/login" styled={false} className="w-full justify-start px-3 py-2 text-[12px] font-normal">
                      Sign in
                    </Button>
                  </li>
                  <li>
                    <Button route="/auth/signup" primary className="w-full text-[12px] font-normal">
                      Create account
                    </Button>
                  </li>
                </ul>
              </div>
            </details>
          </>
        )}
      </nav>
    </header>
  );
};

export default PublicNavbar;
