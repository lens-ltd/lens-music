import { useEffect, useId, useRef, useState } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  type MotionValue,
} from 'framer-motion';
import { LuRotateCcw } from 'react-icons/lu';
import Button from '@/components/inputs/Button';
import { stores, reveal, prefersReducedMotion } from './landingShared';

type DeliveryState = 'queued' | 'sending' | 'live';

const deliveryStores = stores.slice(0, 5);

/**
 * Featured release: "The Greatest" by Skid, a Lens artist
 * (https://open.spotify.com/album/5YiyXQl0htFHCDNL0EAuLw). Cover is self-hosted.
 */
const featuredRelease = {
  title: 'The Greatest',
  artist: 'Skid',
  details: 'Album, 15 tracks',
  coverUrl: '/images/releases/skid-the-greatest.jpg',
};
const START_DELAY_MS = 900;
const STEP_MS = 620;
/** 33⅓ rpm, in degrees per second. */
const RECORD_SPEED = 200;
const glide = [0.22, 1, 0.36, 1] as const;

/**
 * Plays once on load: the record leaves its sleeve, then each store moves from
 * queued to sending to live, one after another. With reduced motion, every
 * store starts live. `liveCount` is -1 until the delivery starts.
 */
function useDeliverySequence(count: number) {
  const [reduced] = useState(prefersReducedMotion);
  const [liveCount, setLiveCount] = useState(() => (reduced ? count : -1));

  useEffect(() => {
    if (liveCount >= count) return;
    const timer = window.setTimeout(
      () => setLiveCount((n) => n + 1),
      liveCount < 0 ? START_DELAY_MS : STEP_MS,
    );
    return () => window.clearTimeout(timer);
  }, [count, liveCount]);

  return {
    reduced,
    liveCount: Math.max(liveCount, 0),
    started: liveCount >= 0,
    done: liveCount >= count,
    replay: () => setLiveCount(-1),
    stateFor: (index: number): DeliveryState =>
      index < liveCount ? 'live' : index === liveCount ? 'sending' : 'queued',
  };
}

/** Spins up and down like a turntable platter instead of snapping on and off. */
function useTurntable(playing: boolean): MotionValue<number> {
  const rotate = useMotionValue(0);
  const speed = useRef(0);

  useAnimationFrame((_, delta) => {
    const target = playing ? RECORD_SPEED : 0;
    speed.current += (target - speed.current) * Math.min(1, delta / 700);
    if (!playing && speed.current < 1) {
      speed.current = 0;
      return;
    }
    rotate.set((rotate.get() + (speed.current * delta) / 1000) % 360);
  });

  return rotate;
}

const grooves = [47, 43, 39, 35, 31, 27, 23];

function Record({ rotate }: { rotate: MotionValue<number> }) {
  const clipId = useId();
  return (
    <motion.svg viewBox="0 0 100 100" className="size-full" style={{ rotate }} aria-hidden="true">
      <circle cx="50" cy="50" r="50" fill="var(--ink)" />
      {grooves.map((r) => (
        <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="var(--paper)" strokeOpacity="0.09" strokeWidth="0.6" />
      ))}
      <clipPath id={clipId}>
        <circle cx="50" cy="50" r="17" />
      </clipPath>
      <image
        href={featuredRelease.coverUrl}
        x="33"
        y="33"
        width="34"
        height="34"
        preserveAspectRatio="xMidYMid slice"
        clipPath={`url(#${clipId})`}
      />
      <circle cx="50" cy="50" r="1.8" fill="var(--paper)" />
    </motion.svg>
  );
}

const stateLabel: Record<DeliveryState, string> = {
  queued: 'Queued',
  sending: 'Sending',
  live: 'Live',
};

export default function HeroSection() {
  const { reduced, started, done, replay, stateFor } =
    useDeliverySequence(deliveryStores.length);
  const rotate = useTurntable(started && !done && !reduced);

  return (
    <section
      id="hero"
      className="pt-32 pb-12 md:pt-40 md:pb-16"
      aria-labelledby="hero-heading"
    >
      <div className="app-container grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-20">
        <header>
          <h1
            id="hero-heading"
            className="type-hero max-w-[14ch] text-balance text-(--ink)"
            {...reveal(0)}
          >
            Your music on Spotify, Apple Music and 150+ stores.
          </h1>
          <p className="mt-6 max-w-[46ch] type-lead text-(--muted)" {...reveal(1)}>
            Distribution is free. Lens keeps 15% of what your music earns, and
            only once it earns. You keep the rest and see exactly where it came
            from.
          </p>

          <div className="mt-10" {...reveal(2)}>
            <Button route="/auth/signup" primary size="lg">
              Create free account
            </Button>
          </div>
        </header>

        <figure
          className="rounded-(--radius-card) bg-(--canvas) p-5 sm:p-6"
          {...reveal(3)}
          aria-label={`${featuredRelease.title} by ${featuredRelease.artist}, being delivered to stores`}
        >
          <div className="relative h-[152px] w-[224px]">
            <motion.div
              className="absolute top-1 left-1 size-[144px]"
              initial={false}
              animate={{ x: started ? 76 : 0 }}
              transition={{ duration: reduced ? 0 : 1.1, ease: glide }}
            >
              <Record rotate={rotate} />
            </motion.div>
            <img
              src={featuredRelease.coverUrl}
              alt={`${featuredRelease.title} album cover`}
              width={152}
              height={152}
              className="relative size-[152px] rounded-(--radius-control) object-cover"
            />
          </div>

          <div className="mt-5 flex items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="type-card-title truncate">{featuredRelease.title}</p>
              <p className="text-sm text-(--ink)">{featuredRelease.artist}</p>
              <p className="mt-1 type-meta">{featuredRelease.details}</p>
            </div>
          </div>

          <ul className="mt-5 flex list-none flex-col gap-1 p-0" role="list">
            {deliveryStores.map(({ name, icon: StoreMark }, index) => {
              const state = stateFor(index);
              return (
                <li
                  key={name}
                  className="relative flex h-11 items-center gap-3 overflow-hidden rounded-(--radius-control) bg-(--paper) px-3"
                >
                  <StoreMark className="size-[18px] shrink-0 text-(--ink)" aria-hidden="true" />
                  <span className="flex-1 text-sm text-(--ink)">{name}</span>
                  <span
                    className={
                      state === 'live'
                        ? 'inline-flex items-center gap-1.5 text-sm font-medium text-(--signal)'
                        : 'text-sm text-(--muted)'
                    }
                  >
                    {state === 'live' && (
                      <motion.span
                        className="size-1.5 rounded-full bg-(--signal)"
                        initial={reduced ? false : { scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 600, damping: 18 }}
                        aria-hidden="true"
                      />
                    )}
                    {stateLabel[state]}
                  </span>
                  {state === 'sending' && (
                    <motion.span
                      className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-(--signal)"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: STEP_MS / 1000, ease: 'linear' }}
                      aria-hidden="true"
                    />
                  )}
                </li>
              );
            })}
          </ul>

          <figcaption className="mt-4 flex items-start justify-between gap-4 px-1">
            <span className="type-meta">
              Released through Lens, with 145+ more stores in the same delivery.
            </span>
            {done && !reduced && (
              <motion.button
                type="button"
                onClick={replay}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-(--radius-control) text-xs font-medium text-(--signal) hover:text-(--signal-hover)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <LuRotateCcw className="size-3.5" aria-hidden="true" />
                Replay delivery
              </motion.button>
            )}
          </figcaption>
        </figure>
      </div>

      <div className="app-container mt-16 md:mt-24">
        <h2 className="sr-only">Stores Lens delivers to</h2>
        <ul className="flex list-none flex-wrap items-center gap-x-10 gap-y-6 p-0" role="list">
          {stores.map(({ name, icon: StoreMark }) => (
            <li key={name} className="flex items-center gap-2 text-(--ink)">
              <StoreMark className="size-5" aria-hidden="true" />
              <span className="text-sm font-medium">{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
