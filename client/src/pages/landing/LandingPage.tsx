import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PublicFooter from '@/components/layout/PublicFooter';
import PublicNavbar from '@/components/layout/PublicNavbar';
import AnalyticsSection from './AnalyticsSection';
import CTASection from './CTASection';
import CompareSection from './CompareSection';
import FAQSection from './FAQSection';
import FeaturesSection from './FeaturesSection';
import HeroSection from './HeroSection';
import HowItWorksSection from './HowItWorksSection';
import PricingSection from './PricingSection';
import StoreStripSection from './StoreStripSection';
import TestimonialsSection from './TestimonialsSection';
import { LandingPageStyles } from './landingShared';

export default function LandingPage() {
  const { hash } = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 64);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!hash) return;

    const sectionId = decodeURIComponent(hash.replace('#', ''));
    const timer = window.setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (!section) return;

      const navbarOffset = 72;
      const position =
        section.getBoundingClientRect().top + window.scrollY - navbarOffset;

      window.scrollTo({
        top: Math.max(position, 0),
        behavior: 'smooth',
      });
    }, 0);

    return () => window.clearTimeout(timer);
  }, [hash]);

  return (
    <main
      className="min-h-screen bg-white text-[color:var(--lens-ink)] overflow-x-hidden"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      <LandingPageStyles />
      <PublicNavbar scrolled={scrolled} variant="landing" />
      <HeroSection />
      <StoreStripSection />
      <HowItWorksSection />
      <FeaturesSection />
      <AnalyticsSection />
      <CompareSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <PublicFooter />
    </main>
  );
}
