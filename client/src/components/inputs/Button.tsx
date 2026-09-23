import { type FC, type MouseEventHandler, type ReactNode, type HTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import { Loader } from './Loader.tsx';
import { Button as ButtonUI, buttonVariants } from '../ui/button';
import { cn } from '@/lib/utils';

import type { IconType } from 'react-icons';
import { Icon } from '@/components/ui/icon';

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
  icon?: IconType;
  size?: 'lg' | 'md' | 'sm';
  isLoading?: boolean;
  children?: ReactNode;
}

const Button: FC<ButtonProps> = ({
  route,
  value,
  onClick,
  type = 'button',
  disabled = false,
  primary = false,
  styled = true,
  className,
  submit = false,
  danger = false,
  icon = undefined,
  size = 'md',
  isLoading = false,
  children,
  ...rest
}) => {
  const variant = danger
    ? 'destructive'
    : !styled
      ? 'ghost'
      : primary
        ? 'primary'
        : 'secondary';

  // A loading button can't be pressed again, so a slow request isn't sent twice.
  const isDisabled = disabled || isLoading;
  const classes = cn(
    buttonVariants({ variant, size }),
    isDisabled && 'pointer-events-none opacity-40',
    className,
  );
  const buttonType = submit ? 'submit' : type;
  const isLink = Boolean(route) && route !== '#' && buttonType !== 'submit' && buttonType !== 'reset';

  const content = isLoading ? (
    <Loader className={primary || danger ? 'text-white' : 'text-(--ink)'} />
  ) : (
    <>
      {icon && <Icon icon={icon} />}
      {children || value}
    </>
  );

  if (isLink) {
    return (
      <Link
        to={route as string}
        onClick={(e) => {
          if (isDisabled) {
            e.preventDefault();
            return;
          }
          if (onClick) {
            onClick(e);
          }
        }}
        className={classes}
        aria-disabled={isDisabled || undefined}
        aria-busy={isLoading || undefined}
        {...rest}
      >
        {content}
      </Link>
    );
  }

  return (
    <ButtonUI
      type={buttonType}
      variant={variant}
      size={size}
      onClick={onClick as MouseEventHandler<HTMLButtonElement> | undefined}
      className={className}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      {...rest}
    >
      {content}
    </ButtonUI>
  );
};

export default Button;
