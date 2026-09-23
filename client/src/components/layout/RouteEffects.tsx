import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Page-level side effects that run on every navigation:
 * - a new page starts at the top (hash links keep scrolling to their section);
 * - `[data-reveal]` elements fade up as they enter the viewport.
 */
const RouteEffects = () => {
  const { pathname, hash } = useLocation();

  // Before paint, so the new page never flashes at the old scroll position.
  useLayoutEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);

  useEffect(() => {
    const root = document.documentElement;
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      root.classList.remove('reveal-ready');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );

    // Wait one frame so the new route's elements are in the DOM.
    const frame = window.requestAnimationFrame(() => {
      root.classList.add('reveal-ready');
      document
        .querySelectorAll('[data-reveal]:not(.is-revealed)')
        .forEach((element) => observer.observe(element));
    });

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
};

export default RouteEffects;
