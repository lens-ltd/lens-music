import { ReactNode } from 'react';
import { useInView } from './landingShared';

type FadeSectionProps = {
  id: string;
  className?: string;
  labelledBy?: string;
  children: (ctx: { inView: boolean }) => ReactNode;
};

export default function FadeSection({
  id,
  className,
  labelledBy,
  children,
}: FadeSectionProps) {
  const section = useInView<HTMLElement>();

  return (
    <section
      id={id}
      ref={section.ref}
      className={className}
      aria-labelledby={labelledBy}
    >
      {children({ inView: section.inView })}
    </section>
  );
}
