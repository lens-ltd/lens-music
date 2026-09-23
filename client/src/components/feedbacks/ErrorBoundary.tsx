import { Component, type ErrorInfo, type ReactNode } from 'react';
import { LuTriangleAlert } from 'react-icons/lu';
import Button from '@/components/inputs/Button';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';

interface ErrorBoundaryProps {
  children: ReactNode;
  /** When this value changes (for example the route path), the boundary clears its error. */
  resetKey?: unknown;
  /** `page` fills the viewport for the root boundary; `section` sits inside a layout. */
  variant?: 'page' | 'section';
}

interface ErrorBoundaryState {
  error?: Error;
}

/**
 * Catches render errors so one broken view shows a recoverable message
 * instead of a blank screen. Reporting to an error service comes with OPS-6.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {};

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled render error', error, info.componentStack);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: undefined });
    }
  }

  private handleRetry = () => {
    this.setState({ error: undefined });
  };

  render() {
    if (!this.state.error) return this.props.children;

    const { variant = 'section' } = this.props;

    return (
      <div
        className={cn(
          'flex w-full items-center justify-center px-4',
          variant === 'page' ? 'min-h-screen bg-(--canvas)' : 'py-10',
        )}
      >
        <section
          role="alert"
          className="card-framed flex w-full max-w-lg flex-col items-start gap-4 p-6 sm:p-8"
        >
          <LuTriangleAlert className="size-6 text-(--danger)" aria-hidden="true" />
          <div className="flex flex-col gap-2">
            <h1 className="type-card-title text-(--ink)">Something went wrong</h1>
            <p className="type-body-sm text-(--muted)">
              This page hit an unexpected problem. Your saved work is safe. Try
              again, or go back to your dashboard.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button primary onClick={this.handleRetry}>
              Try again
            </Button>
            <Button route="/dashboard">Go to dashboard</Button>
          </div>
        </section>
      </div>
    );
  }
}

/**
 * A boundary that clears itself on navigation. Route elements share a tree
 * position, so without the reset an error would follow the user to the next page.
 */
export const RouteErrorBoundary = ({
  children,
  variant,
}: Pick<ErrorBoundaryProps, 'children' | 'variant'>) => {
  const { pathname } = useLocation();
  return (
    <ErrorBoundary resetKey={pathname} variant={variant}>
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundary;
