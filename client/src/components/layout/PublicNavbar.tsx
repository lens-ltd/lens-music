import { FC } from "react";
import { Link } from "react-router-dom";
import Button from "@/components/inputs/Button";
import LensLogo from "/logo.png";

interface PublicNavbarProps {
  scrolled?: boolean;
  variant?: "landing" | "auth";
}

const PublicNavbar: FC<PublicNavbarProps> = ({
  scrolled,
  variant = "landing",
}) => {
  const landingLinks = [
    { label: "How it works", href: "#how-it-works" },
    { label: "Revenue analytics", href: "#analytics" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  const authCta = { label: "Sign in", to: "/auth/login" };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-(--paper) ${
        scrolled || variant === "auth" ? "border-b border-(--line)" : ""
      }`}
      style={{ height: "64px" }}
    >
      <nav
        className="app-container flex h-full items-center justify-between"
        aria-label="Main navigation"
      >
        <Link
          to="/"
          aria-label="Lens Music home"
          className="rounded-(--radius-control) outline-none"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <img
            src={LensLogo}
            alt="Lens Logo"
            className="h-10 w-10 rounded-(--radius-control) object-contain"
          />
        </Link>

        {variant === "auth" ? (
          <ul className="flex items-center gap-3 list-none m-0 p-0" role="list">
            <li className="hidden sm:block">
              <Link
                to="/"
                className="link-sweep type-body-sm text-(--muted) hover:text-(--ink)"
              >
                Back to home
              </Link>
            </li>
            <li>
              <Button route={authCta.to} primary>
                {authCta.label}
              </Button>
            </li>
          </ul>
        ) : (
          <>
            <ul
              className="hidden md:flex items-center gap-1 list-none m-0 p-0"
              role="list"
            >
              {landingLinks.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="inline-flex min-h-10 items-center rounded-lg px-3 type-body-sm text-(--ink) transition-[background-color] duration-200 hover:bg-(--surface)"
                  >
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  to="/auth/login"
                  className="inline-flex min-h-10 items-center rounded-lg px-3 type-body-sm text-(--ink) transition-[background-color] duration-200 hover:bg-(--surface)"
                >
                  Sign in
                </Link>
              </li>
              <li className="pl-2">
                <Button route="/auth/signup" primary>
                  Create account
                </Button>
              </li>
              <li>
                <Link
                  to="/auth/request-invitation"
                  className="inline-flex min-h-10 items-center rounded-lg px-3 type-body-sm text-(--muted) hover:text-(--ink)"
                >
                  Request invite
                </Link>
              </li>
            </ul>

            <details className="md:hidden relative" id="mobile-nav">
              <summary
                className="list-none cursor-pointer p-2 rounded-(--radius-control)"
                aria-label="Open navigation menu"
              >
                <svg
                  width="22"
                  height="16"
                  viewBox="0 0 22 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <rect y="0" width="22" height="1.5" rx="1" fill="currentColor" />
                  <rect y="7" width="22" height="1.5" rx="1" fill="currentColor" />
                  <rect y="14" width="22" height="1.5" rx="1" fill="currentColor" />
                </svg>
              </summary>
              <div className="absolute top-full right-0 mt-2 w-60 card-framed p-3 shadow-[var(--shadow-menu)]">
                <ul
                  className="flex flex-col gap-1 list-none m-0 p-0"
                  role="list"
                >
                  {landingLinks.map(({ label, href }) => (
                    <li key={label}>
                      <a
                        href={href}
                        className="block px-3 py-2 rounded-(--radius-control) type-body-sm text-(--ink) hover:bg-(--surface)"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                  <li className="pt-2 mt-1 border-t border-(--line)">
                    <Button
                      route="/auth/signup"
                      primary
                      className="w-full justify-start"
                    >
                      Create account
                    </Button>
                  </li>
                  <li>
                    <Button
                      route="/auth/request-invitation"
                      styled={false}
                      className="w-full justify-start"
                    >
                      Request invite
                    </Button>
                  </li>
                  <li>
                    <Button
                      route="/auth/login"
                      styled={false}
                      className="w-full justify-start"
                    >
                      Sign in
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
