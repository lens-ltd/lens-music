/**
 * Modal × Combobox interaction contract (CreateRelease reference case).
 *
 * Guards the regression where interacting with a combobox dropdown inside a
 * modal either dismissed the modal or left search unusable:
 * typing filters, selecting keeps the modal open, Escape closes only the
 * dropdown.
 */
import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Modal from './Modal';
import Combobox from '../inputs/Combobox';

const OPTIONS = [
  { label: 'Single', value: 'single' },
  { label: 'Album', value: 'album' },
  { label: 'EP', value: 'ep' },
];

function Harness({ onChange }: { onChange: (value: string) => void }) {
  return (
    <Modal isOpen onClose={() => {}} heading="Add new Release">
      <Combobox
        label="Type"
        options={OPTIONS}
        value=""
        onChange={onChange}
        placeholder="Please select the type"
      />
    </Modal>
  );
}

beforeEach(() => {
  const portal = document.createElement('div');
  portal.id = 'modal';
  document.body.appendChild(portal);
  if (!window.matchMedia) {
    window.matchMedia = () => ({
      matches: false,
      addEventListener: () => {},
      removeEventListener: () => {},
    });
  }
  if (!window.ResizeObserver) {
    window.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => {};
  }
});

afterEach(() => {
  cleanup();
  document.body.innerHTML = '';
});

describe('Combobox inside Modal', () => {
  it('filters by typing, selects without closing the modal', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);

    expect(screen.getByText('Add new Release')).toBeInTheDocument();

    await user.click(screen.getByRole('combobox'));
    const menu = await screen.findByRole('listbox');
    expect(within(menu).getByRole('option', { name: 'Single' })).toBeInTheDocument();

    await user.click(screen.getByPlaceholderText('Search option...'));
    await user.keyboard('sin');
    await waitFor(() => {
      expect(within(menu).queryByRole('option', { name: 'Album' })).not.toBeInTheDocument();
    });
    expect(within(menu).getByRole('option', { name: 'Single' })).toBeInTheDocument();

    await user.click(within(menu).getByRole('option', { name: 'Single' }));
    expect(onChange).toHaveBeenCalledWith('single');
    // The modal itself must survive the selection.
    expect(screen.getByText('Add new Release')).toBeInTheDocument();
  });

  it('selects with ArrowDown + Enter and keeps the modal open', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);

    await user.click(screen.getByRole('combobox'));
    await screen.findByRole('listbox');
    await user.click(screen.getByPlaceholderText('Search option...'));
    await user.keyboard('{ArrowDown}{Enter}');

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith('single');
    });
    expect(screen.getByText('Add new Release')).toBeInTheDocument();
  });

  it('Escape closes the dropdown but not the modal', async () => {
    const user = userEvent.setup();
    render(<Harness onChange={() => {}} />);

    await user.click(screen.getByRole('combobox'));
    await screen.findByRole('listbox');
    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Add new Release')).toBeInTheDocument();
  });
});
