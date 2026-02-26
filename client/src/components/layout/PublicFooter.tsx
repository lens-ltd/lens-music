import { FC } from 'react';
import { Link } from 'react-router-dom';
import LensLogo from '/logo.png';

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
            <img src={LensLogo} alt="Lens Logo" className="w-10 h-10" />
          </Link>
          <p className="text-[12px] leading-relaxed max-w-[200px]" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-sans)' }}>
            Distribution and analytics for independent artists and labels, built in Rwanda.
          </p>
        </section>

        {/* product links */}
        <nav aria-label="Product links">
          <p className="text-[10px] uppercase tracking-[0.2em] mb-4" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-sans)', fontWeight: 400 }}>
            Product
          </p>
          <ul className="flex flex-col gap-2.5 list-none p-0 m-0" role="list">
            {[
              { label: 'How it works', href: '#how-it-works' },
              { label: 'Features',     href: '#features'     },
              { label: 'Pricing',      href: '#pricing'      },
              { label: 'Dashboard',    href: '#analytics'    },
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
          <p className="text-[10px] uppercase tracking-[0.2em] mb-4" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-sans)', fontWeight: 400 }}>
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
          <p className="text-[10px] uppercase tracking-[0.2em] mb-4" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-sans)', fontWeight: 400 }}>
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
          <span className="text-[color:var(--lens-blue)] mr-0.5">*</span>
          Distribution is free. Lens charges a <span className="text-[color:var(--lens-blue)] tracking-tight text-[11px]">15% revenue share</span> on earnings generated through the platform.
        </p>
      </section>
    </section>
  </footer>
)

export default PublicFooter
