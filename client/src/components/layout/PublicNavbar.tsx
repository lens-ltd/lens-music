import { FC } from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/inputs/Button';

interface PublicNavbarProps {
  scrolled?: boolean;
}

const PublicNavbar: FC<PublicNavbarProps> = ({ scrolled }) => (
  <header
    className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-white/96 backdrop-blur-md border-b border-[color:var(--lens-sand)] shadow-[0_1px_0_rgba(16,14,9,0.06)]'
        : 'bg-transparent'
    }`}
    style={{ height: '64px' }}
  >
    <nav
      className="max-w-6xl mx-auto h-full flex items-center justify-between px-6"
      aria-label="Main navigation"
    >
      <Link
        to="/"
        aria-label="Lens Music home"
        className="flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--lens-blue)] rounded"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="2" stroke="rgb(31,98,142)" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="5.5" stroke="rgb(31,98,142)" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="2" fill="rgb(31,98,142)" />
        </svg>
        <span
          className="text-[color:var(--lens-ink)] tracking-tight"
          style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', fontWeight: 700 }}
        >
          Lens Music
        </span>
      </Link>

      <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0" role="list">
        {[
          { label: 'How it works', href: '#how-it-works' },
          { label: 'Pricing', href: '#pricing' },
          { label: 'FAQ', href: '#faq' },
        ].map(({ label, href }) => (
          <li key={label}>
            <a
              href={href}
              className="nav-link text-[color:var(--lens-ink)] opacity-60 hover:opacity-100 text-[12px] tracking-[0.06em] font-medium"
              style={{ fontFamily: 'var(--font-sans)' }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              {label}
            </a>
          </li>
        ))}
        <li>
          <Link
            to="/auth/login"
            className="nav-link text-[color:var(--lens-ink)] opacity-60 hover:opacity-100 text-[12px] tracking-[0.06em] font-medium"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Sign in
          </Link>
        </li>
        <li>
          <Button route="/auth/signup" primary className="px-5 py-2 text-[12px] tracking-[0.04em] font-semibold">
            Start uploading
          </Button>
        </li>
      </ul>

      <details className="md:hidden relative group" id="mobile-nav">
        <summary
          className="list-none cursor-pointer p-2 rounded focus-visible:outline-2 focus-visible:outline-[color:var(--lens-blue)]"
          aria-label="Open navigation menu"
        >
          <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden="true">
            <rect y="0"  width="22" height="1.8" rx="1" fill="rgb(16,14,9)" />
            <rect y="7"  width="22" height="1.8" rx="1" fill="rgb(16,14,9)" />
            <rect y="14" width="22" height="1.8" rx="1" fill="rgb(16,14,9)" />
          </svg>
        </summary>
        <nav
          className="absolute top-full right-0 mt-2 w-52 bg-white border border-[color:var(--lens-sand)] rounded-lg shadow-lg p-3"
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col gap-1 list-none m-0 p-0" role="list">
            {['How it works', 'Pricing', 'FAQ'].map((label) => (
              <li key={label}>
                <a
                  href={`#${label.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block px-3 py-2 rounded text-[12px] text-[color:var(--lens-ink)] hover:bg-[color:var(--lens-sand)] transition-colors"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {label}
                </a>
              </li>
            ))}
            <li className="pt-1 border-t border-[color:var(--lens-sand)]">
              <Button route="/auth/signup" primary className="w-full text-center text-[12px] mt-1">
                Start uploading
              </Button>
            </li>
          </ul>
        </nav>
      </details>
    </nav>
  </header>
);

export default PublicNavbar;
