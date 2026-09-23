import { useEffect, useId, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, useSpring } from 'framer-motion';
import { landingSectionClassName, reveal } from './landingShared';

const ARTIST_SHARE = 0.85;
const glide = [0.22, 1, 0.36, 1] as const;

const formatUsd = (value: number) =>
  value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: value < 10 ? 2 : 0,
    maximumFractionDigits: value < 10 ? 2 : 0,
  });

/** A dollar amount that eases to its new value when the slider moves. */
function Amount({ value }: { value: number }) {
  const reduced = useReducedMotion();
  const spring = useSpring(value, { stiffness: 260, damping: 32 });
  const [shown, setShown] = useState(value);

  useEffect(() => {
    if (reduced) {
      setShown(value);
      return;
    }
    spring.set(value);
  }, [reduced, spring, value]);

  useEffect(() => spring.on('change', setShown), [spring]);

  return <>{formatUsd(reduced ? value : shown)}</>;
}

export default function PricingSection() {
  const [earned, setEarned] = useState(100);
  const sliderId = useId();
  const barRef = useRef<HTMLDivElement>(null);
  const inView = useInView(barRef, { once: true, margin: '0px 0px -15% 0px' });
  const reduced = useReducedMotion();
  const drawn = inView || Boolean(reduced);

  const yours = earned * ARTIST_SHARE;
  const lens = earned - yours;

  return (
    <section
      id="pricing"
      className={landingSectionClassName}
      aria-labelledby="pricing-heading"
    >
      <div className="app-container">
        <h2 id="pricing-heading" className="type-h2" {...reveal(0)}>
          Free to release. You keep 85%.
        </h2>
        <p className="mt-4 max-w-[52ch] type-body-lg text-(--muted)">
          No upload fee and no yearly fee. Lens takes a 15% share of what your
          music earns through the platform, and nothing before that.
        </p>

        <figure className="mt-14" aria-label="How a release's earnings are split">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            <label htmlFor={sliderId} className="type-body-lg">
              When a release earns{' '}
              <span className="font-medium tabular">{formatUsd(earned)}</span>
            </label>
            <input
              id={sliderId}
              type="range"
              min={10}
              max={5000}
              step={10}
              value={earned}
              onChange={(event) => setEarned(Number(event.target.value))}
              aria-valuetext={`${formatUsd(earned)} earned`}
              className="h-10 w-full cursor-pointer accent-(--signal) sm:max-w-80"
            />
          </div>

          <div
            ref={barRef}
            className="mt-4 flex h-16 overflow-hidden rounded-(--radius-card) bg-(--surface)"
            role="img"
            aria-label={`${formatUsd(yours)} goes to you, ${formatUsd(lens)} goes to Lens`}
          >
            <motion.div
              className="flex items-center overflow-hidden bg-(--ink) text-white"
              initial={false}
              animate={{ width: drawn ? `${ARTIST_SHARE * 100}%` : '0%' }}
              transition={{ duration: 1.1, ease: glide }}
            >
              <span className="pl-5 text-lg font-medium whitespace-nowrap tabular">
                <Amount value={yours} />
              </span>
            </motion.div>
            <motion.div
              className="flex flex-1 items-center justify-center overflow-hidden bg-(--signal) text-white"
              initial={false}
              animate={{ opacity: drawn ? 1 : 0 }}
              transition={{ delay: drawn && !reduced ? 0.9 : 0, duration: 0.4 }}
            >
              <span className="text-lg font-medium whitespace-nowrap tabular max-sm:text-sm">
                <Amount value={lens} />
              </span>
            </motion.div>
          </div>
          <figcaption className="mt-3 flex justify-between gap-4 text-sm">
            <span>Paid to you</span>
            <span className="text-(--signal)">Lens</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
