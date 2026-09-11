import { FC } from 'react';
import { Link } from 'react-router-dom';
import LensLogo from '/logo.png';

const PublicFooter: FC = () => (
  <footer
    id="contact"
    className="invert-surface"
    role="contentinfo"
  >
    <section className="app-container pt-16 pb-8">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-10 pb-12 border-b border-(--line)">
        <section className="col-span-2 md:col-span-1">
          <Link
            to="/"
            aria-label="Lens Music home"
            className="flex items-center gap-2.5 mb-4 rounded w-fit"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img src={LensLogo} alt="Lens Logo" className="w-10 h-10 invert" />
          </Link>
          <p className="type-meta max-w-[200px]">
            Distribution and analytics for independent artists and labels, built in Rwanda.
          </p>
        </section>

        <nav aria-label="Product links">
          <p className="type-eyebrow mb-4">Product</p>
          <ul className="flex flex-col gap-2.5 list-none p-0 m-0" role="list">
            {[
              { label: 'How it works', href: '#how-it-works' },
              { label: 'Features', href: '#features' },
              { label: 'Pricing', href: '#pricing' },
              { label: 'Dashboard', href: '#analytics' },
            ].map(({ label, href }) => (
              <li key={label}>
                <a href={href} className="link-sweep type-body-sm text-(--muted) hover:text-(--ink)">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Company links">
          <p className="type-eyebrow mb-4">Company</p>
          <ul className="flex flex-col gap-2.5 list-none p-0 m-0" role="list">
            {[
              { label: 'About', href: '/#about' },
              { label: 'Contact', href: '/#contact' },
              { label: 'FAQ', href: '/#faq' },
            ].map(({ label, href }) => (
              <li key={label}>
                <a href={href} className="link-sweep type-body-sm text-(--muted) hover:text-(--ink)">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Legal links">
          <p className="type-eyebrow mb-4">Legal</p>
          <ul className="flex flex-col gap-2.5 list-none p-0 m-0" role="list">
            {[
              { label: 'Privacy Policy', href: '/privacy-policy' },
              { label: 'Terms of Service', href: '/terms-of-service' },
              { label: 'Artist Agreement', href: '/artist-agreement' },
            ].map(({ label, href }) => (
              <li key={label}>
                <Link to={href} className="link-sweep type-body-sm text-(--muted) hover:text-(--ink)">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-7">
        <p className="type-meta">
          Distribution is free. Lens charges a 15% revenue share on earnings generated through the platform.
        </p>
      </section>
    </section>
  </footer>
);

export default PublicFooter;
