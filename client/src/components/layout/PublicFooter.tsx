import { FC } from 'react';
import { Link } from 'react-router-dom';
import LensLogo from '/logo-mark.png';

const linkClassName = 'link-sweep text-sm text-(--muted) hover:text-(--ink)';

const productLinks = [
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'FAQ', href: '/#faq' },
];

const accountLinks = [
  { label: 'Create free account', to: '/auth/signup' },
  { label: 'Sign in', to: '/auth/login' },
];

const legalLinks = [
  { label: 'Privacy policy', to: '/privacy-policy' },
  { label: 'Terms of service', to: '/terms-of-service' },
  { label: 'Artist agreement', to: '/artist-agreement' },
];

const PublicFooter: FC = () => (
  <footer id="contact" className="bg-(--paper)" role="contentinfo">
    <div className="app-container grid grid-cols-2 gap-10 py-16 md:grid-cols-4">
      <div className="col-span-2 md:col-span-1">
        <Link
          to="/"
          aria-label="Lens Music home"
          className="block w-fit rounded-(--radius-control)"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <img src={LensLogo} alt="Lens Music" className="h-7 w-auto" />
        </Link>
        <p className="mt-4 max-w-[28ch] type-meta">
          Distribution and earnings reporting for independent artists and
          labels, built in Rwanda.
        </p>
      </div>

      <nav aria-label="Product">
        <p className="equipment-label">Product</p>
        <ul className="mt-4 flex list-none flex-col gap-3 p-0" role="list">
          {productLinks.map(({ label, href }) => (
            <li key={label}>
              <a href={href} className={linkClassName}>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <nav aria-label="Account">
        <p className="equipment-label">Account</p>
        <ul className="mt-4 flex list-none flex-col gap-3 p-0" role="list">
          {accountLinks.map(({ label, to }) => (
            <li key={label}>
              <Link to={to} className={linkClassName}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <nav aria-label="Legal">
        <p className="equipment-label">Legal</p>
        <ul className="mt-4 flex list-none flex-col gap-3 p-0" role="list">
          {legalLinks.map(({ label, to }) => (
            <li key={label}>
              <Link to={to} className={linkClassName}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>

    <div className="app-container pb-10">
      <p className="type-meta">© {new Date().getFullYear()} Lens Music</p>
    </div>
  </footer>
);

export default PublicFooter;
