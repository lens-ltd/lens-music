import { FC } from "react";
import { Link } from "react-router-dom";
import Button from "@/components/inputs/Button";
import LensLogo from "/logo-mark.png";
import { LuMenu } from "react-icons/lu";

interface PublicNavbarProps {
  scrolled?: boolean;
  variant?: "landing" | "auth";
}

const PublicNavbar: FC<PublicNavbarProps> = ({
  scrolled,
  variant = "landing",
}) => {
  const landingLinks = [
    { label: "How it works", href: "/#how-it-works" },
    { label: "Pricing", href: "/#pricing" },
    { label: "FAQ", href: "/#faq" },
  ];

  const authCta = { label: "Sign in", to: "/auth/login" };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-(--paper) transition-shadow duration-(--dur-state) ${
        scrolled && variant === "landing" ? "shadow-[0_4px_20px_rgba(0,0,0,0.06)]" : ""
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
            alt="Lens Music"
            className="h-7 w-auto"
          />
        </Link>

        {variant === "auth" ? (
          <ul className="flex items-center gap-3 list-none m-0 p-0" role="list">
            <li className="hidden sm:block">
              <Link
                to="/"
                className="link-sweep text-sm text-(--muted) hover:text-(--ink)"
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
                    className="inline-flex h-(--control-md) items-center rounded-(--radius-control) px-3 text-sm text-(--ink) transition-colors duration-(--dur-state) hover:bg-(--surface)"
                  >
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  to="/auth/login"
                  className="inline-flex h-(--control-md) items-center rounded-(--radius-control) px-3 text-sm text-(--ink) transition-colors duration-(--dur-state) hover:bg-(--surface)"
                >
                  Sign in
                </Link>
              </li>
              <li className="pl-2">
                <Button route="/auth/signup" primary>
                  Create free account
                </Button>
              </li>
            </ul>

            <details className="md:hidden relative" id="mobile-nav">
              <summary
                className="grid size-(--control-md) cursor-pointer list-none place-items-center rounded-(--radius-control) hover:bg-(--surface) [&::-webkit-details-marker]:hidden"
                aria-label="Open navigation menu"
              >
                <LuMenu className="size-5" aria-hidden="true" />
              </summary>
              <div className="absolute top-full right-0 mt-2 w-64 rounded-(--radius-control) bg-(--paper) p-2 shadow-(--shadow-menu)">
                <ul
                  className="flex flex-col gap-1 list-none m-0 p-0"
                  role="list"
                >
                  {landingLinks.map(({ label, href }) => (
                    <li key={label}>
                      <a
                        href={href}
                        className="flex h-10 items-center rounded-(--radius-control) px-3 text-sm text-(--ink) hover:bg-(--surface)"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                  <li>
                    <Link
                      to="/auth/login"
                      className="flex h-10 items-center rounded-(--radius-control) px-3 text-sm text-(--ink) hover:bg-(--surface)"
                    >
                      Sign in
                    </Link>
                  </li>
                  <li className="mt-2">
                    <Button route="/auth/signup" primary className="w-full">
                      Create free account
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
