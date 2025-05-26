import { useState, useEffect } from 'react';
import landingHeroImage from '/landing/landing-hero.png';
import lensMusicLogo from '/logo/lens-music-logo.png'
import { Link } from 'react-router-dom';
import Button from '@/components/inputs/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ scrolled }: { scrolled: boolean }) => {
  const navigationLinks = [
    {
      label: 'Product',
      route: '/dashboard',
    },
    {
      label: 'About',
      route: '/about',
    },
    {
      label: 'Contact',
      route: '/contact',
    },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 h-0 ${
        scrolled ? 'bg-white text-black' : 'bg-transparent text-white'
      }`}
    >
      <nav className="container w-[90%] flex items-center justify-between mx-auto px-4 py-4">
        <Link to={`#`}>
          <img src={lensMusicLogo} alt="Lens Music Logo" className="w-12" />
        </Link>
        <menu className="flex justify-between items-center gap-5">
          {navigationLinks.map((link, index) => (
            <>
              {index > 0 && <span key={index} className="text-white mx-2">•</span>}
              <Link key={index} to={link.route} className="hover:underline">
                {link.label}
              </Link>
            </>
          ))}
        </menu>
        <menu className="w-fit flex items-center gap-3">
          <Link to={`/auth/login`} className="hover:underline">Sign in</Link>
          <Button
            route={`/auth/signup`}
            className={`${
              scrolled && 'bg-black text-white'
            } bg-white text-black px-4 py-2 rounded-md`}
          >
            Sign up
          </Button>
        </menu>
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
    <main className="h-screen">
      <Navbar scrolled={scrolled} />
      <section className="h-screen relative">
        <div className="relative w-full h-full">
          <img
            src={landingHeroImage}
            alt="Full-screen background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        <article className="absolute inset-0 left-[5vh] top-[35%] bg-transparent flex flex-col items-start justify-start p-8 z-10">
          <p className="text-white text-xl md:text-2xl mb-6 max-w-md animate-slideIn">
            Discover, create, and share your musical journey with us.
          </p>
          <Button className="mt-4 border-none flex items-center">
            Get Started
            <FontAwesomeIcon icon={faLocationArrow} className="ml-2" />
          </Button>
        </article>
        <footer className="absolute bottom-12 max-w-[50vw] right-0 bg-transparent flex flex-col gap-4 items-end justify-end p-8">
          <h2 className="text-white text-4xl text-end md:text-6xl lg:text-7xl font-bold">
            The future of music distribution
          </h2>
          <p className="text-white text-lg">Working for you</p>
        </footer>
      </section>
    </main>
  );
};

export default LandingPage;
