import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ErrorBoundary from './ErrorBoundary';

let shouldThrow = true;

const Flaky = () => {
  if (shouldThrow) throw new Error('boom');
  return <p>Page content</p>;
};

const renderBoundary = (resetKey: string) => (
  <MemoryRouter>
    <ErrorBoundary resetKey={resetKey}>
      <Flaky />
    </ErrorBoundary>
  </MemoryRouter>
);

beforeEach(() => {
  shouldThrow = true;
  // React logs caught render errors; keep the test output readable.
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('ErrorBoundary', () => {
  it('shows a recoverable message instead of a blank screen', () => {
    render(renderBoundary('/a'));
    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
    expect(screen.getByRole('link', { name: 'Go to dashboard' })).toHaveAttribute(
      'href',
      '/dashboard',
    );
  });

  it('renders the page again after "Try again" once the problem is gone', async () => {
    render(renderBoundary('/a'));
    shouldThrow = false;
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(screen.getByText('Page content')).toBeInTheDocument();
  });

  it('clears the error when the reset key changes', () => {
    const { rerender } = render(renderBoundary('/a'));
    shouldThrow = false;
    rerender(renderBoundary('/b'));
    expect(screen.getByText('Page content')).toBeInTheDocument();
  });
});
