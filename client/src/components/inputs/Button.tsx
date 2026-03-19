import { type IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { type FC, type MouseEventHandler, type ReactNode, type HTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import { Loader } from './Loader.tsx';
import { Button as ButtonUI } from '../ui/button';
import { cn } from '@/lib/utils';

interface ButtonProps extends Omit<HTMLAttributes<HTMLButtonElement | HTMLAnchorElement>, 'onClick'> {
  route?: string;
  value?: ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  type?: 'submit' | 'button' | 'reset';
  disabled?: boolean;
  primary?: boolean;
  styled?: boolean;
  submit?: boolean;
  danger?: boolean;
  icon?: IconProp;
  isLoading?: boolean;
  children?: ReactNode;
}

const baseStyles =
  'inline-flex items-center gap-2 justify-center text-center text-[12px] font-normal! h-10 min-h-10 py-2.5! px-5! rounded-sm border transition-colors duration-200 cursor-pointer';

const variantStyles = {
  default:
    'border-[color:var(--lens-blue)] text-[color:var(--lens-blue)] bg-transparent hover:bg-[color:var(--lens-blue)] hover:text-white',
  primary:
    'bg-[color:var(--lens-blue)] text-white border-[color:var(--lens-blue)] hover:bg-[color:var(--color-primary)]/90',
  danger: 'bg-red-600 text-white border-red-600 hover:bg-red-700',
  unstyled:
    'bg-transparent border-transparent text-[color:var(--lens-blue)] hover:opacity-70',
  disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
};

const Button: FC<ButtonProps> = ({
  route = '#',
  value,
  onClick,
  type = null,
  disabled = false,
  primary = false,
  styled = true,
  className,
  submit = false,
  danger = false,
  icon = undefined,
  isLoading = false,
  children,
  ...rest
}) => {
  const variant = disabled
    ? 'disabled'
    : danger
      ? 'danger'
      : !styled
        ? 'unstyled'
        : primary
          ? 'primary'
          : 'default';

  const classes = cn(baseStyles, variantStyles[variant], className);

  if (submit || type === 'submit' || type === 'reset') {
    return (
      <ButtonUI
        type={type || 'submit'}
        onClick={onClick as MouseEventHandler<HTMLButtonElement> | undefined}
        className={classes}
        disabled={disabled}
        {...rest}
      >
        {isLoading ? (
          <Loader
            className={primary ? 'text-white' : 'text-[color:var(--lens-blue)]'}
          />
        ) : (
          <>
            {icon && <FontAwesomeIcon icon={icon} />}
            {children || value}
          </>
        )}
      </ButtonUI>
    );
  }

  return (
    <Link
      to={route}
      onClick={(e) => {
        if (disabled) {
          e.preventDefault();
          return;
        }
        if (onClick) {
          onClick(e);
        }
      }}
      className={classes}
      {...rest}
    >
      {isLoading ? (
        <Loader
          className={primary ? 'text-white' : 'text-[color:var(--lens-blue)]'}
        />
      ) : (
        <>
          {icon && <FontAwesomeIcon icon={icon} />}
          {children || value}
        </>
      )}
    </Link>
  );
};

export default Button;
