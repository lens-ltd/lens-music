import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import PublicNavbar from './PublicNavbar';
import PublicFooter from './PublicFooter';

interface AuthLayoutProps {
  children: ReactNode;
  /** Max width of the form card, e.g. `max-w-[440px]`. */
  widthClassName?: string;
}

/**
 * Shell for every auth page: the navbar and the form card fill exactly one
 * viewport, so the footer starts right below the fold.
 */
const AuthLayout = ({ children, widthClassName = 'max-w-[440px]' }: AuthLayoutProps) => (
  <main className="flex flex-col bg-(--canvas) text-(--ink)">
    <PublicNavbar scrolled variant="auth" />

    <section className="flex min-h-svh items-center justify-center px-4 pb-12 pt-[calc(64px+2.5rem)] sm:px-6">
      <article
        className={cn(
          'auth-card w-full rounded-(--radius-card) bg-(--paper) p-6 shadow-(--shadow-card) sm:p-8',
          widthClassName,
        )}
        data-reveal
      >
        {children}
      </article>
    </section>

    <PublicFooter />
  </main>
);

export default AuthLayout;
