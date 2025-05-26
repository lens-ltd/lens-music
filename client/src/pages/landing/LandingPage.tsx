import { useState, useEffect } from 'react';
import landingHeroImage from '/landing/landing-hero.png';
import lensMusicLogo from '/logo/lens-music-logo.png';
import { Link, useLocation } from 'react-router-dom';
import Button from '@/components/inputs/Button';

export const PublicNavbar = ({ scrolled }: { scrolled?: boolean }) => {
  /**
   * NAVIGATION
   */

  // NAVIGATION
  const { pathname } = useLocation();

  // NAVIGATION LINKS
  const navigationLinks = [
    {
      label: 'About',
      route: '#about',
    },
    {
      label: 'Contact Us',
      route: '#contact-us',
    },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 h-[9vh] ${
        scrolled ? 'bg-white text-black' : 'bg-transparent text-white'
      }`}
    >
      <nav className="container w-[90%] flex items-center justify-between mx-auto px-4 py-4">
        <Link to={`/`}>
          <img src={lensMusicLogo} alt="Lens Music Logo" className="w-8" />
        </Link>
        {!pathname.includes('/auth') ? (
          <>
            <menu className="flex justify-between items-center gap-8">
              {navigationLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.route}
                  className="text-gray-600 hover:text-primary transition-colors duration-300 font-medium text-[14px] relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </menu>
            <menu className="w-fit flex items-center gap-3">
              <Button
                route={`/auth/login`}
                primary
                className={`px-4 py-1 rounded-md`}
              >
                My account
              </Button>
            </menu>
          </>
        ) : null}
      </nav>
    </header>
  );
};

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > window.innerHeight;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <main className="min-h-screen">
      <PublicNavbar scrolled={scrolled} />

      <section
        className="pt-32 pb-20 bg-white flex flex-col items-center justify-center min-h-[80vh]"
        id="hero"
      >
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-6">
          The future of music distribution.
        </h1>
        <p className="text-xl md:text-2xl text-center text-gray-600 mb-10 max-w-2xl">
          Discover, create, and share your musical journey with us.
        </p>
        <figure className="w-full max-w-4xl mx-auto mb-10 rounded-3xl overflow-hidden shadow-xl border border-gray-100">
          <img
            src={landingHeroImage}
            alt="Dashboard Preview"
            className="w-full h-auto object-cover"
          />
        </figure>
        <Button primary>Learn More</Button>
      </section>

      <section className="py-20 px-8" id="specifications">
        <article className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold mb-16">Map Your Success</h2>

          <ul className="grid md:grid-cols-3 gap-12">
            <li className="flex flex-col">
              <article>
                <h3 className="text-6xl font-light text-gray-300 mb-6">01</h3>
                <h4 className="text-xl font-bold mb-4">Get Started</h4>
                <p className="text-gray-600">
                  With our intuitive setup, you're up and running in minutes.
                </p>
              </article>
            </li>

            <li className="flex flex-col">
              <article>
                <h3 className="text-6xl font-light text-gray-300 mb-6">02</h3>
                <h4 className="text-xl font-bold mb-4">
                  Customize and Configure
                </h4>
                <p className="text-gray-600">
                  Adapt Lens Music to your specific requirements and
                  preferences.
                </p>
              </article>
            </li>

            <li className="flex flex-col">
              <article>
                <h3 className="text-6xl font-light text-gray-300 mb-6">03</h3>
                <h4 className="text-xl font-bold mb-4">Grow Your Business</h4>
                <p className="text-gray-600">
                  Make informed decisions to exceed your goals.
                </p>
              </article>
            </li>
          </ul>
        </article>
      </section>

      {/* See the Big Picture Section */}
      <section className="py-20 px-8 bg-gray-50" id="how-to">
        <article className="max-w-5xl mx-auto">
          <header>
            <h2 className="text-4xl font-bold mb-6">See the Big Picture</h2>
            <p className="text-lg mb-12">
              Lens Music turns your data into clear, vibrant visuals that show
              you exactly what's happening in each region.
            </p>
          </header>

          <main className="grid md:grid-cols-2 gap-8">
            <nav className="space-y-8">
              <article className="flex items-start gap-4">
                <time className="text-xl font-light text-gray-400">01</time>
                <section>
                  <h3 className="text-lg font-semibold">
                    Spot Trends in Seconds
                  </h3>
                  <p className="text-gray-600">
                    No more digging through numbers.
                  </p>
                </section>
              </article>

              <article className="flex items-start gap-4">
                <time className="text-xl font-light text-gray-400">02</time>
                <section>
                  <h3 className="text-lg font-semibold">
                    Get Everyone on the Same Page
                  </h3>
                  <p className="text-gray-600">
                    Share easy-to-understand reports with your team.
                  </p>
                </section>
              </article>

              <article className="flex items-start gap-4">
                <time className="text-xl font-light text-gray-400">03</time>
                <section>
                  <h3 className="text-lg font-semibold">
                    Make Presentations Pop
                  </h3>
                  <p className="text-gray-600">
                    Interactive maps and dashboards keep your audience engaged.
                  </p>
                </section>
              </article>

              <article className="flex items-start gap-4">
                <time className="text-xl font-light text-gray-400">04</time>
                <section>
                  <h3 className="text-lg font-semibold">
                    Your Global Snapshot
                  </h3>
                  <p className="text-gray-600">
                    Get a quick, clear overview of your entire operation.
                  </p>
                </section>
              </article>

              <Button primary>Discover More</Button>
            </nav>

            <aside className="bg-gray-200 rounded-lg h-80 flex items-center justify-center">
              <figure
                className="w-full h-full animate-pulse bg-gray-300 rounded-lg"
                role="status"
                aria-label="Loading visualization"
              >
                <span className="sr-only">Loading visualization...</span>
              </figure>
            </aside>
          </main>
        </article>
      </section>

      <footer className="py-8 px-8 bg-gray-100 border-t border-gray-200">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <figure className="mb-4 md:mb-0">
            <img src={lensMusicLogo} alt="Lens Music Logo" className="w-10" />
          </figure>
          <p className="text-gray-500 text-sm">
            © Lens Music, {new Date().getFullYear()}. All Rights Reserved
          </p>
        </div>
      </footer>
    </main>
  );
};

export default LandingPage;
