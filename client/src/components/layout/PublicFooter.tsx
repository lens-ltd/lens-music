import { FC } from 'react';
import { Link } from 'react-router-dom';

const PublicFooter: FC = () => (
  <footer
    id="contact"
    className="bg-[color:var(--lens-ink)] text-white"
    role="contentinfo"
  >
    <section className="max-w-6xl mx-auto px-6 pt-16 pb-8">
      {/* top grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
        {/* brand */}
        <section className="col-span-2 md:col-span-1">
          <Link
            to="/"
            aria-label="Lens Music home"
            className="flex items-center gap-2.5 mb-4 focus-visible:outline-2 focus-visible:outline-white rounded w-fit"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="2" stroke="white" strokeWidth="1.5" opacity="0.8"/>
              <circle cx="12" cy="12" r="5.5" stroke="white" strokeWidth="1.5" opacity="0.8"/>
              <circle cx="12" cy="12" r="2" fill="white" opacity="0.8"/>
            </svg>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '15px', fontWeight: 700 }}>
              Lens Music
            </span>
          </Link>
          <p className="text-[12px] leading-relaxed max-w-[200px]" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-sans)' }}>
            Free music distribution for independent artists and labels, built in Rwanda.
          </p>
        </section>

        {/* product links */}
        <nav aria-label="Product links">
          <p className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-4" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-sans)' }}>
            Product
          </p>
          <ul className="flex flex-col gap-2.5 list-none p-0 m-0" role="list">
            {[
              { label: 'How it works', href: '#how-it-works' },
              { label: 'Features',     href: '#features'     },
              { label: 'Pricing',      href: '#pricing'      },
              { label: 'Dashboard',    href: '#dashboard'    },
            ].map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="footer-link text-[12px]"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* company */}
        <nav aria-label="Company links">
          <p className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-4" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-sans)' }}>
            Company
          </p>
          <ul className="flex flex-col gap-2.5 list-none p-0 m-0" role="list">
            {[
              { label: 'About',   href: '#about'   },
              { label: 'Contact', href: '#contact' },
              { label: 'FAQ',     href: '#faq'     },
            ].map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="footer-link text-[12px]"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* legal */}
        <nav aria-label="Legal links">
          <p className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-4" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-sans)' }}>
            Legal
          </p>
          <ul className="flex flex-col gap-2.5 list-none p-0 m-0" role="list">
            {['Privacy Policy', 'Terms of Service', 'Artist Agreement'].map(label => (
              <li key={label}>
                <a
                  href="#"
                  className="footer-link text-[12px]"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      {/* bottom row */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-7">
        <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-sans)' }}>
          Distribution is free. Lens charges a 15% revenue share on earnings generated through the platform.
        </p>
        <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-sans)' }}>
          © Lens Music, {new Date().getFullYear()}. All rights reserved.
        </p>
      </section>
    </section>
  </footer>
);

export default PublicFooter;
