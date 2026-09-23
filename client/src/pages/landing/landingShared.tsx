import type { CSSProperties } from 'react';
import type { IconType } from 'react-icons';
import {
  SiApplemusic,
  SiAudiomack,
  SiDeezer,
  SiSpotify,
  SiTidal,
  SiYoutubemusic,
} from 'react-icons/si';

export const sampleChartData = [
  { month: 'Aug', value: 780 },
  { month: 'Sep', value: 940 },
  { month: 'Oct', value: 1210 },
  { month: 'Nov', value: 1335 },
  { month: 'Dec', value: 1580 },
  { month: 'Jan', value: 1840 },
  { month: 'Feb', value: 2055 },
];

export interface Store {
  name: string;
  icon: IconType;
}

/** Official brand marks, rendered in ink to stay inside the palette. */
export const stores: Store[] = [
  { name: 'Spotify', icon: SiSpotify },
  { name: 'Apple Music', icon: SiApplemusic },
  { name: 'YouTube Music', icon: SiYoutubemusic },
  { name: 'Tidal', icon: SiTidal },
  { name: 'Deezer', icon: SiDeezer },
  { name: 'Audiomack', icon: SiAudiomack },
];

/** Vertical rhythm shared by every landing section. */
export const landingSectionClassName = 'py-20 md:py-28';

/**
 * Spread onto a wrapper to fade it up on scroll (see RouteEffects).
 * `index` staggers siblings by 90ms each. Keep it off elements with their own transitions.
 */
export const reveal = (index = 0) => ({
  'data-reveal': '',
  style: { '--reveal-i': index } as CSSProperties,
});

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
