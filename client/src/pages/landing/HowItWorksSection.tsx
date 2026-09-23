import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { LuCheck } from 'react-icons/lu';
import { landingSectionClassName, reveal, sampleChartData, stores } from './landingShared';

const glide = [0.22, 1, 0.36, 1] as const;

/** What the release form asks for, ticked off one by one. */
function UploadDetail() {
  const parts = ['Audio', 'Cover art', 'Credits', 'Release details'];
  return (
    <ul className="flex list-none flex-wrap gap-2 p-0" role="list">
      {parts.map((part, i) => (
        <motion.li
          key={part}
          className="inline-flex h-9 items-center gap-2 rounded-(--radius-pill) bg-(--canvas) px-3.5 text-sm"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + i * 0.12, duration: 0.4, ease: glide }}
        >
          <motion.span
            className="grid size-4 place-items-center rounded-full bg-(--signal) text-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.35 + i * 0.12, type: 'spring', stiffness: 500, damping: 20 }}
          >
            <LuCheck className="size-3" aria-hidden="true" />
          </motion.span>
          {part}
        </motion.li>
      ))}
    </ul>
  );
}

/** The stores one delivery reaches, arriving in turn. */
function DeliverDetail() {
  return (
    <ul className="flex list-none flex-wrap items-center gap-x-5 gap-y-4 p-0 sm:gap-x-6" role="list">
      {stores.map(({ name, icon: StoreMark }, i) => (
        <motion.li
          key={name}
          className="text-(--ink)"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 + i * 0.09, type: 'spring', stiffness: 420, damping: 22 }}
        >
          <StoreMark className="size-6 sm:size-7" aria-label={name} />
        </motion.li>
      ))}
    </ul>
  );
}

/** Monthly earnings rising, from the same sample as the statement below. */
function TrackDetail() {
  const max = Math.max(...sampleChartData.map((d) => d.value));
  return (
    <div className="flex h-32 max-w-sm gap-2" aria-hidden="true">
      {sampleChartData.map(({ month, value }, i) => (
        <div key={month} className="flex h-full flex-1 flex-col gap-1.5">
          <div className="flex flex-1 items-end">
            <motion.div
              className="w-full origin-bottom rounded-t-[3px] bg-(--signal)"
              style={{ height: `${(value / max) * 100}%` }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.1 + i * 0.07, duration: 0.6, ease: glide }}
            />
          </div>
          <span className="text-center text-xs text-(--muted)">{month}</span>
        </div>
      ))}
    </div>
  );
}

const steps: { title: string; text: string; detail: ReactNode }[] = [
  {
    title: 'Upload your release',
    text: 'Add audio, cover art, credits and release details in one guided form.',
    detail: <UploadDetail />,
  },
  {
    title: 'Lens delivers it',
    text: 'Your release goes out to 150+ streaming and download stores at once.',
    detail: <DeliverDetail />,
  },
  {
    title: 'Track what it earns',
    text: 'See earnings by store, country and month, and follow every payout.',
    detail: <TrackDetail />,
  },
];

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && Boolean(window.matchMedia?.(query).matches),
  );

  useEffect(() => {
    const media = window.matchMedia?.(query);
    if (!media) return;
    const onChange = () => setMatches(media.matches);
    onChange();
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** The line from one step's marker to the next. Fills while that step is open. */
function RailSegment({ fill }: { fill: MotionValue<number> | number }) {
  return (
    <span
      className="absolute top-14 bottom-2 left-[27.5px] w-px bg-(--line)"
      aria-hidden="true"
    >
      <motion.span
        className="block size-full origin-top bg-(--signal)"
        initial={false}
        animate={typeof fill === 'number' ? { scaleY: fill } : undefined}
        style={typeof fill === 'number' ? undefined : { scaleY: fill }}
        transition={{ duration: 0.45, ease: glide }}
      />
    </span>
  );
}

function ScrollRailSegment({ progress, index }: { progress: MotionValue<number>; index: number }) {
  const fill = useTransform(progress, [index / steps.length, (index + 1) / steps.length], [0, 1]);
  return <RailSegment fill={fill} />;
}

export default function HowItWorksSection() {
  const reduced = useReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  // On desktop the section pins and scrolling walks through the steps one at a time.
  const pinned = isDesktop && !reduced;

  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  // +1 when moving forward, -1 when going back, so text enters from the matching side.
  const [direction, setDirection] = useState(1);

  const activeRef = useRef(0);
  const select = (index: number) => {
    if (index === activeRef.current) return;
    setDirection(index > activeRef.current ? 1 : -1);
    activeRef.current = index;
    setActive(index);
  };

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (!pinned) return;
    select(Math.min(steps.length - 1, Math.floor(p * steps.length)));
  });

  const goTo = (index: number) => {
    const section = sectionRef.current;
    if (!pinned || !section) {
      select(index);
      return;
    }
    const travel = section.offsetHeight - window.innerHeight;
    const top = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + travel * ((index + 0.5) / steps.length), behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className={pinned ? 'relative h-[340vh]' : landingSectionClassName}
      aria-labelledby="how-it-works-heading"
    >
      <div className={pinned ? 'sticky top-0 flex h-svh items-center pt-16' : undefined}>
        <div className="app-container grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
          {/* Photo: Miguel Á. Padriñán, Pexels (pexels.com/photo/3391930) */}
          <img
            src="/images/vinyl-black.jpg"
            alt=""
            loading="lazy"
            className="aspect-[4/5] w-full rounded-(--radius-card) object-cover object-[70%_center] max-lg:aspect-[16/9] lg:max-h-[76svh]"
          />

          {/* On desktop this column matches the photo's height; the open step takes the spare room. */}
          <div className="flex flex-col lg:py-2">
            <h2 id="how-it-works-heading" className="type-h2 max-w-[20ch]" {...reveal(0)}>
              From upload to payout in three steps.
            </h2>

            <ol className="mt-10 flex flex-1 list-none flex-col p-0" role="list">
              {steps.map(({ title, text, detail }, index) => {
                const isActive = index === active;
                const isLast = index === steps.length - 1;
                return (
                  <motion.li
                    key={title}
                    className={`relative grid min-h-0 grid-cols-[56px_1fr] content-start gap-x-6 ${
                      isLast ? '' : 'pb-6'
                    }`}
                    initial={false}
                    animate={{ flexGrow: isActive ? 1 : 0 }}
                    transition={{ duration: reduced ? 0 : 0.6, ease: glide }}
                    aria-current={isActive ? 'step' : undefined}
                  >
                    {!isLast &&
                      (pinned ? (
                        <ScrollRailSegment progress={scrollYProgress} index={index} />
                      ) : (
                        <RailSegment fill={index < active ? 1 : 0} />
                      ))}

                    <h3 className="col-span-2 grid grid-cols-subgrid">
                      <button
                        type="button"
                        onClick={() => goTo(index)}
                        aria-expanded={isActive}
                        className="col-span-2 grid cursor-pointer grid-cols-subgrid items-center rounded-(--radius-control) text-left"
                      >
                        <motion.span
                          className={`grid size-14 place-items-center rounded-full text-xl font-medium tabular transition-colors duration-300 ${
                            index <= active ? 'bg-(--signal) text-white' : 'bg-(--surface) text-(--muted)'
                          }`}
                          initial={false}
                          animate={{ scale: isActive ? 1 : 0.86 }}
                          transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                        >
                          {index + 1}
                        </motion.span>
                        <span
                          className={`font-medium leading-tight transition-[font-size,color] duration-500 ease-(--ease-glide) ${
                            isActive
                              ? 'text-[clamp(1.5rem,1.1rem+1.2vw,2.25rem)] text-(--ink)'
                              : 'text-xl text-(--muted)'
                          }`}
                        >
                          {title}
                        </span>
                      </button>
                    </h3>

                    <AnimatePresence initial={false} custom={direction}>
                      {isActive && (
                        <motion.div
                          key="body"
                          custom={direction}
                          className="col-start-2 overflow-hidden"
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          transition={{ duration: reduced ? 0 : 0.55, ease: glide }}
                        >
                          <motion.div
                            initial={{ opacity: 0, y: direction * 28 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: direction * -28 }}
                            transition={{ duration: reduced ? 0 : 0.5, ease: glide, delay: reduced ? 0 : 0.08 }}
                          >
                            <p className="max-w-[40ch] pt-3 type-lead text-(--muted)">{text}</p>
                            <div className="pt-6 pb-2">{detail}</div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
