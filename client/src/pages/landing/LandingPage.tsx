import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PublicFooter from '@/components/layout/PublicFooter';
import PublicNavbar from '@/components/layout/PublicNavbar';
import CTASection from './CTASection';
import FAQSection from './FAQSection';
import HeroSection from './HeroSection';
import HowItWorksSection from './HowItWorksSection';
import PricingSection from './PricingSection';
import WhatYouGetSection from './WhatYouGetSection';
import { useAppSelector } from '@/state/hooks';

export default function LandingPage() {

  // STATE
  const { token } = useAppSelector((state) => state.auth);

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

  if (token) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <main className="min-h-screen bg-(--paper) text-(--ink) overflow-x-clip">
      <PublicNavbar scrolled={scrolled} variant="landing" />
      <HeroSection />
      <HowItWorksSection />
      <WhatYouGetSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <PublicFooter />
    </main>
  );
}
