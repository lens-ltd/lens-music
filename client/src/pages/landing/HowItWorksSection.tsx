import { useRef, useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { landingSectionClassName, reveal } from './landingShared';

const steps = [
  {
    title: 'Upload your release',
    text: 'Add audio, cover art, credits and release details in one guided form.',
  },
  {
    title: 'Lens delivers it',
    text: 'Your release goes out to 150+ streaming and download stores at once.',
  },
  {
    title: 'Track what it earns',
    text: 'See earnings by store, country and month, and follow every payout.',
  },
];

/** Where step `i` sits along the rail, from 0 to 1. */
const stepAt = (i: number) => i / (steps.length - 1);

/** The line from one step's marker to the next, filling with scroll. */
function RailSegment({
  progress,
  from,
  to,
  filled,
}: {
  progress: MotionValue<number>;
  from: number;
  to: number;
  filled: boolean;
}) {
  const scaleY = useTransform(progress, [from, to], [0, 1]);
  return (
    <span
      className="absolute top-12 left-[23.5px] h-[calc(100%-8px)] w-px bg-(--line)"
      aria-hidden="true"
    >
      <motion.span
        className="block size-full origin-top bg-(--signal)"
        style={{ scaleY: filled ? 1 : scaleY }}
      />
    </span>
  );
}

export default function HowItWorksSection() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);

  // The rail fills as the steps pass the middle of the screen.
  const { scrollYProgress: railProgress } = useScroll({
    target: listRef,
    offset: ['start 65%', 'end 75%'],
  });
  const [reached, setReached] = useState(reduced ? steps.length : 0);
  useMotionValueEvent(railProgress, 'change', (p) => {
    if (reduced) return;
    setReached(p <= 0 ? 0 : steps.filter((_, i) => p >= stepAt(i) - 0.02).length);
  });

  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const photoY = useTransform(sectionProgress, [0, 1], ['-6%', '6%']);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className={landingSectionClassName}
      aria-labelledby="how-it-works-heading"
    >
      <div className="app-container grid items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
        <div className="aspect-[4/5] w-full overflow-hidden rounded-(--radius-card) max-lg:aspect-[16/9]">
          {/* Photo: Miguel Á. Padriñán, Pexels (pexels.com/photo/3391930) */}
          <motion.img
            src="/images/vinyl-black.jpg"
            alt=""
            loading="lazy"
            className="size-full scale-[1.14] object-cover object-[70%_center]"
            style={reduced ? undefined : { y: photoY }}
          />
        </div>

        <div>
          <h2 id="how-it-works-heading" className="type-h2 max-w-[20ch]" {...reveal(0)}>
            From upload to payout in three steps.
          </h2>

          <ol ref={listRef} className="relative mt-12 flex list-none flex-col gap-10 p-0" role="list">
            {steps.map(({ title, text }, index) => {
              const isReached = index < reached;
              return (
                <li key={title} className="relative grid grid-cols-[48px_1fr] gap-5">
                  {index < steps.length - 1 && (
                    <RailSegment
                      progress={railProgress}
                      from={stepAt(index)}
                      to={stepAt(index + 1)}
                      filled={Boolean(reduced)}
                    />
                  )}
                  <span
                    className={`grid size-12 place-items-center rounded-full text-lg font-medium tabular transition-colors duration-300 ${
                      isReached
                        ? 'bg-(--signal) text-white'
                        : 'bg-(--surface) text-(--muted)'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <div className="pt-2.5">
                    <h3 className="type-h3">{title}</h3>
                    <p className="mt-2 max-w-[40ch] type-body-lg text-(--muted)">{text}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
