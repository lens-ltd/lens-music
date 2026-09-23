import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LuMusic } from 'react-icons/lu';
import Button from '@/components/inputs/Button';
import { stores } from './landingShared';

type DeliveryState = 'queued' | 'sending' | 'live';

const deliveryStores = stores.slice(0, 5);
const STEP_MS = 520;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Plays once on load: each store moves from queued to sending to live, one
 * after another. With reduced motion, every store starts live.
 */
function useDeliverySequence(count: number) {
  const [liveCount, setLiveCount] = useState(() =>
    prefersReducedMotion() ? count : 0,
  );

  useEffect(() => {
    if (liveCount >= count) return;
    const timer = window.setTimeout(
      () => setLiveCount((n) => n + 1),
      liveCount === 0 ? 900 : STEP_MS,
    );
    return () => window.clearTimeout(timer);
  }, [count, liveCount]);

  return (index: number): DeliveryState =>
    index < liveCount ? 'live' : index === liveCount ? 'sending' : 'queued';
}

const stateLabel: Record<DeliveryState, string> = {
  queued: 'Queued',
  sending: 'Sending',
  live: 'Live',
};

export default function HeroSection() {
  const stateFor = useDeliverySequence(deliveryStores.length);

  return (
    <section
      id="hero"
      className="pt-32 pb-12 md:pt-40 md:pb-16"
      aria-labelledby="hero-heading"
    >
      <div className="app-container grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-20">
        <header>
          <h1 id="hero-heading" className="type-hero max-w-[14ch] text-(--ink)">
            Your music on Spotify, Apple Music and 150+ stores.
          </h1>
          <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-(--muted)">
            Distribution is free. Lens keeps 15% of what your music earns, and
            only once it earns. You keep the rest and see exactly where it came
            from.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Button route="/auth/signup" primary className="h-12 px-6 text-base">
              Create free account
            </Button>
            <Link
              to="/auth/login"
              className="link-sweep text-sm font-medium text-(--ink)"
            >
              Sign in
            </Link>
          </div>
        </header>

        <figure
          className="rounded-(--radius-card) bg-(--surface) p-6 sm:p-8"
          aria-label="Example: a single being delivered to stores"
        >
          <div className="flex items-center gap-4">
            <span
              className="grid size-16 shrink-0 place-items-center rounded-(--radius-control) bg-(--signal) text-white"
              aria-hidden="true"
            >
              <LuMusic className="size-6" />
            </span>
            <div className="min-w-0">
              <p className="type-card-title truncate">Night Drive</p>
              <p className="type-meta">Single</p>
            </div>
          </div>

          <ul className="mt-8 flex list-none flex-col gap-1 p-0" role="list">
            {deliveryStores.map(({ name, icon: StoreMark }, index) => {
              const state = stateFor(index);
              return (
                <li
                  key={name}
                  className="flex h-11 items-center gap-3 rounded-(--radius-control) bg-(--paper) px-3"
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
                      <span className="size-1.5 rounded-full bg-(--signal)" aria-hidden="true" />
                    )}
                    {stateLabel[state]}
                  </span>
                </li>
              );
            })}
          </ul>

          <figcaption className="mt-4 px-1 type-meta">
            And 145+ more stores in the same delivery.
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
