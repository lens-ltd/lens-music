import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Controller, useForm } from 'react-hook-form';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PhoneField from './PhoneField';
import { PHONE_INVALID_MESSAGE, phoneRules } from '@/utils/phone.helper';

type Values = { phoneNumber: string };

function PhoneForm({
  onSubmit,
  defaultValue = '',
}: {
  onSubmit: (values: Values) => void;
  defaultValue?: string;
}) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ defaultValues: { phoneNumber: defaultValue } });
  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values))}>
      <Controller
        name="phoneNumber"
        control={control}
        rules={phoneRules}
        render={({ field }) => (
          <PhoneField
            label="Phone number"
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            errorMessage={errors.phoneNumber?.message}
          />
        )}
      />
      <button type="submit">Save</button>
    </form>
  );
}

beforeEach(() => {
  if (!window.matchMedia) {
    window.matchMedia = () =>
      ({
        matches: false,
        addEventListener: () => {},
        removeEventListener: () => {},
      }) as unknown as MediaQueryList;
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
});

describe('PhoneField', () => {
  it('preselects Rwanda and submits the number in E.164', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<PhoneForm onSubmit={onSubmit} />);

    expect(
      screen.getByRole('combobox', { name: 'Country calling code' }),
    ).toHaveTextContent('RW +250');

    await user.type(screen.getByLabelText('Phone number'), '0788123456');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onSubmit).toHaveBeenCalledWith({ phoneNumber: '+250788123456' });
  });

  it('blocks a number that cannot be dialed and shows why', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<PhoneForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Phone number'), '078');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByText(PHONE_INVALID_MESSAGE)).toBeInTheDocument();
    expect(screen.getByLabelText('Phone number')).toHaveAttribute('aria-invalid', 'true');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('allows leaving the number empty', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<PhoneForm onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onSubmit).toHaveBeenCalledWith({ phoneNumber: '' });
  });

  it('finds a country by its calling code', async () => {
    const user = userEvent.setup();
    render(<PhoneForm onSubmit={vi.fn()} />);

    await user.click(screen.getByRole('combobox', { name: 'Country calling code' }));
    await user.type(screen.getByRole('textbox', { name: 'Search countries' }), '+44');
    const menu = await screen.findByRole('listbox');
    await user.click(within(menu).getByRole('option', { name: /United Kingdom/ }));

    expect(
      screen.getByRole('combobox', { name: 'Country calling code' }),
    ).toHaveTextContent('GB +44');
  });

  it('shows a stored number in national format', () => {
    render(<PhoneForm onSubmit={vi.fn()} defaultValue="+250788123456" />);

    expect(screen.getByLabelText('Phone number')).toHaveValue('0788 123 456');
  });
});
