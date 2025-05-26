import { useState, useEffect } from 'react';
import landingHeroImage from '/landing/landing-hero.png';
import lensMusicLogo from '/logo/lens-music-logo.png'
import { Link } from 'react-router-dom';
import Button from '@/components/inputs/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationArrow, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ scrolled }: { scrolled: boolean }) => {
  const navigationLinks = [
    {
      label: 'Benefits',
      route: '#benefits',
    },
    {
      label: 'Specifications',
      route: '#specifications',
    },
    {
      label: 'How-to',
      route: '#how-to',
    },
    {
      label: 'Contact Us',
      route: '#contact-us',
    },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-white text-black' : 'bg-transparent text-white'
      }`}
    >
      <nav className="container w-[90%] flex items-center justify-between mx-auto px-4 py-4">
        <Link to={`#`}>
          <img src={lensMusicLogo} alt="Lens Music Logo" className="w-12" />
        </Link>
        <menu className="flex justify-between items-center gap-5">
          {navigationLinks.map((link, index) => (
            <Link key={index} to={link.route} className="hover:underline">
              {link.label}
            </Link>
          ))}
        </menu>
        <menu className="w-fit flex items-center gap-3">
          <Link to={`/auth/login`} className="hover:underline">Sign in</Link>
          <Button
            route={`/auth/signup`}
            className={`${
              scrolled ? 'bg-primary text-white' : 'bg-white text-black'
            } px-4 py-2 rounded-md`}
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
    <main className="min-h-screen">
      <Navbar scrolled={scrolled} />
      
      {/* Hero Section - Keeping the existing hero image */}
      <section className="h-screen relative" id="hero">
        <figure className="relative w-full h-full">
          <img
            src={landingHeroImage}
            alt="Full-screen background"
            className="w-full h-full object-cover"
          />
          <figcaption className="absolute inset-0 bg-black opacity-60"></figcaption>
        </figure>
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

      {/* Browse Everything Section */}
      <section className="py-20 px-8 flex flex-col items-center justify-center" id="benefits">
        <h2 className="text-5xl font-bold mb-16 text-center">Browse everything.</h2>
        <figure className="w-full max-w-4xl mx-auto bg-gray-100 rounded-lg overflow-hidden shadow-xl">
          <img 
            src="https://placehold.co/800x500/e9e9e9/31343C?text=Dashboard+Preview" 
            alt="Dashboard Preview" 
            className="w-full h-auto"
          />
          <figcaption className="sr-only">Dashboard visualization showing music analytics</figcaption>
        </figure>
      </section>

      {/* Connect with us Section */}
      <section className="py-16 px-8 bg-gray-50" id="contact-us">
        <article className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Connect with us</h2>
          <p className="text-lg mb-8">
            Schedule a quick call to learn how Lens Music can turn your musical talent into a powerful advantage.
          </p>
          <Button 
            className="bg-primary text-white px-6 py-3 rounded-md inline-block"
          >
            Learn More
            <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
          </Button>
        </article>
      </section>

      {/* Map Your Success Section */}
      <section className="py-20 px-8" id="specifications">
        <article className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold mb-16">Map Your Success</h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            <article className="flex flex-col">
              <h3 className="text-6xl font-light text-gray-300 mb-6">01</h3>
              <h4 className="text-xl font-bold mb-4">Get Started</h4>
              <p className="text-gray-600">
                With our intuitive setup, you're up and running in minutes.
              </p>
            </article>
            
            <article className="flex flex-col">
              <h3 className="text-6xl font-light text-gray-300 mb-6">02</h3>
              <h4 className="text-xl font-bold mb-4">Customize and Configure</h4>
              <p className="text-gray-600">
                Adapt Lens Music to your specific requirements and preferences.
              </p>
            </article>
            
            <article className="flex flex-col">
              <h3 className="text-6xl font-light text-gray-300 mb-6">03</h3>
              <h4 className="text-xl font-bold mb-4">Grow Your Business</h4>
              <p className="text-gray-600">
                Make informed decisions to exceed your goals.
              </p>
            </article>
          </div>
        </article>
      </section>

      {/* See the Big Picture Section */}
      <section className="py-20 px-8 bg-gray-50" id="how-to">
        <article className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">See the Big Picture</h2>
          <p className="text-lg mb-12">
            Lens Music turns your data into clear, vibrant visuals that show you exactly what's happening in each region.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-8">
              <article className="flex items-start gap-4">
                <span className="text-xl font-light text-gray-400">01</span>
                <div>
                  <h4 className="text-lg font-semibold">Spot Trends in Seconds</h4>
                  <p className="text-gray-600">No more digging through numbers.</p>
                </div>
              </article>
              
              <article className="flex items-start gap-4">
                <span className="text-xl font-light text-gray-400">02</span>
                <div>
                  <h4 className="text-lg font-semibold">Get Everyone on the Same Page</h4>
                  <p className="text-gray-600">Share easy-to-understand reports with your team.</p>
                </div>
              </article>
              
              <article className="flex items-start gap-4">
                <span className="text-xl font-light text-gray-400">03</span>
                <div>
                  <h4 className="text-lg font-semibold">Make Presentations Pop</h4>
                  <p className="text-gray-600">Interactive maps and dashboards keep your audience engaged.</p>
                </div>
              </article>
              
              <article className="flex items-start gap-4">
                <span className="text-xl font-light text-gray-400">04</span>
                <div>
                  <h4 className="text-lg font-semibold">Your Global Snapshot</h4>
                  <p className="text-gray-600">Get a quick, clear overview of your entire operation.</p>
                </div>
              </article>
              
              <Button className="bg-primary text-white px-6 py-3 rounded-md mt-6">
                Discover More
              </Button>
            </div>
            
            <figure className="bg-gray-200 rounded-lg h-80 flex items-center justify-center">
              <img 
                src="https://placehold.co/400x300/e9e9e9/31343C?text=Feature+Visualization" 
                alt="Feature Visualization" 
                className="max-w-full max-h-full"
              />
            </figure>
          </div>
        </article>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 px-8">
        <article className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <figure className="bg-gray-200 rounded-lg h-80 flex items-center justify-center">
            <img 
              src="https://placehold.co/400x400/e9e9e9/31343C?text=Testimonial+Image" 
              alt="Testimonial" 
              className="max-w-full max-h-full rounded-lg"
            />
          </figure>
          
          <div>
            <blockquote className="text-2xl font-medium mb-6">
              "I was skeptical, but Lens Music has completely transformed the way I manage my business. The data visualizations are so clear and intuitive, and the platform is so easy to use. I can't imagine running my company without it."
            </blockquote>
            <figcaption>
              <cite className="text-lg font-bold">John Smith</cite>
              <p className="text-gray-600">Head of Data</p>
            </figcaption>
          </div>
        </article>
      </section>

      {/* Trusted By Section */}
      <section className="py-16 px-8 border-t border-gray-200">
        <article className="max-w-5xl mx-auto">
          <h3 className="text-center text-gray-500 mb-12">Trusted by:</h3>
          <div className="flex flex-wrap justify-center gap-12 items-center">
            <figure className="w-32 h-16 flex items-center justify-center">
              <img src="https://placehold.co/120x60/e9e9e9/31343C?text=Logo+1" alt="Company 1" />
            </figure>
            <figure className="w-32 h-16 flex items-center justify-center">
              <img src="https://placehold.co/120x60/e9e9e9/31343C?text=Logo+2" alt="Company 2" />
            </figure>
            <figure className="w-32 h-16 flex items-center justify-center">
              <img src="https://placehold.co/120x60/e9e9e9/31343C?text=Logo+3" alt="Company 3" />
            </figure>
            <figure className="w-32 h-16 flex items-center justify-center">
              <img src="https://placehold.co/120x60/e9e9e9/31343C?text=Logo+4" alt="Company 4" />
            </figure>
          </div>
        </article>
      </section>

      {/* Footer */}
      <footer className="py-8 px-8 bg-gray-100 border-t border-gray-200">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <figure className="mb-4 md:mb-0">
            <img src={lensMusicLogo} alt="Lens Music Logo" className="w-10" />
          </figure>
          <p className="text-gray-500 text-sm">© Lens Music, {new Date().getFullYear()}. All Rights Reserved</p>
        </div>
      </footer>
    </main>
  );
};

export default LandingPage;
