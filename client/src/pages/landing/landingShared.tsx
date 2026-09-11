import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faApple,
  faAudible,
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
  transform: inView ? 'translateY(0)' : 'translateY(8px)',
  transition: `opacity 200ms var(--ease-flat) ${delay}s, transform 200ms var(--ease-flat) ${delay}s`,
});

export function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="type-eyebrow">{children}</p>;
}

export function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="shrink-0 mt-0.5">
      <circle cx="7" cy="7" r="6.5" stroke="currentColor" className="text-(--line-strong)" />
      <path d="M4 7.1 6.1 9.1 10 5" stroke="currentColor" className="text-(--ink)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const storeIcons: Record<string, IconDefinition> = {
  Spotify: faSpotify,
  'Apple Music': faApple,
  Deezer: faDeezer,
  Tidal: faApple,
  'YouTube Music': faYoutube,
  Audiomack: faAudible,
};

export function StoreIcon({ name }: { name: string }) {
  return (
    <figure className="flex flex-col items-center gap-2 text-(--muted) hover:text-(--ink) transition-colors duration-200" aria-label={name}>
      <span className="text-[15px]">
        <FontAwesomeIcon icon={storeIcons[name]} />
      </span>
      <figcaption className="type-meta">{name}</figcaption>
    </figure>
  );
}

export function LandingPageStyles() {
  return null;
}
