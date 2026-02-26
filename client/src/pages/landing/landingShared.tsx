import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAmazon,
  faApple,
  faDeezer,
  faSpotify,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export const sampleChartData = [
  { month: 'Aug', value: 780 },
  { month: 'Sep', value: 940 },
  { month: 'Oct', value: 1210 },
  { month: 'Nov', value: 1335 },
  { month: 'Dec', value: 1580 },
  { month: 'Jan', value: 1840 },
  { month: 'Feb', value: 2055 },
];

export function useInView<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, inView };
}

export function useStatCounter(target: number, active: boolean, duration = 1400) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;

    let current = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = window.setInterval(() => {
      current += step;
      if (current >= target) {
        setCount(target);
        window.clearInterval(timer);
        return;
      }
      setCount(current);
    }, 16);

    return () => window.clearInterval(timer);
  }, [active, duration, target]);

  return count;
}

export const fadeUp = (inView: boolean, delay = 0): CSSProperties => ({
  opacity: inView ? 1 : 0,
  transform: inView ? 'translateY(0)' : 'translateY(20px)',
  transition: `opacity 0.55s ease ${delay}s, transform 0.55s ease ${delay}s`,
});

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p
      className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--lens-blue)]"
      style={{ fontFamily: 'var(--font-sans)', fontWeight: 400 }}
    >
      {children}
    </p>
  );
}

export function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="shrink-0 mt-0.5">
      <circle cx="7" cy="7" r="6.5" stroke="rgb(31,98,142)" opacity="0.18" />
      <path d="M4 7.1 6.1 9.1 10 5" stroke="rgb(31,98,142)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const storeIcons: Record<string, IconDefinition> = {
  Spotify: faSpotify,
  'Apple Music': faApple,
  Deezer: faDeezer,
  Tidal: faApple,
  'YouTube Music': faYoutube,
  Audiomack: faAmazon,
  'Amazon Music': faAmazon,
};

export function StoreIcon({ name }: { name: string }) {
  return (
    <figure className="flex flex-col items-center gap-2 opacity-60 hover:opacity-90 transition-opacity" aria-label={name}>
      <span className="text-[15px] text-[color:var(--lens-ink)]/75">
        <FontAwesomeIcon icon={storeIcons[name]} />
      </span>
      <figcaption className="text-[10px] text-[color:var(--lens-ink)]/70 font-normal">{name}</figcaption>
    </figure>
  );
}

export function LandingPageStyles() {
  return (
    <style>{`
      .nav-link { position: relative; transition: opacity 0.2s ease; }
      .nav-link::after { content: ''; position: absolute; left: 0; bottom: -2px; width: 0; height: 1px; background: currentColor; transition: width 0.2s ease; }
      .nav-link:hover::after { width: 100%; }
      .footer-link { position: relative; color: rgba(255,255,255,0.55); transition: color 0.2s ease; }
      .footer-link::after { content: ''; position: absolute; left: 0; bottom: -2px; width: 0; height: 1px; background: rgba(255,255,255,0.7); transition: width 0.2s ease; }
      .footer-link:hover { color: white; }
      .footer-link:hover::after { width: 100%; }
      details[open] > summary .faq-plus { transform: rotate(45deg); }
      .faq-plus { transition: transform .2s ease; }
      .editorial-chip {
        display: inline-flex; align-items: center; justify-content: center; border-radius: 999px;
        background: var(--color-primary); color: white; font-size: 10px; letter-spacing: 0.12em;
        text-transform: uppercase; padding: 0.5rem 0.75rem; font-weight: 400;
      }
      @media (prefers-reduced-motion: reduce) { * { scroll-behavior: auto !important; } }
    `}</style>
  );
}
