import { type IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { type FC, type MouseEventHandler, type ReactNode, type HTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import { Loader } from './Loader.tsx';
import { Button as ButtonUI, buttonVariants } from '../ui/button';
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
  isLoading = false,
  children,
  ...rest
}) => {
  const variant = danger
    ? 'destructive'
    : !styled
      ? 'ghost'
      : primary
        ? 'default'
        : 'outline';

  const classes = cn(
    buttonVariants({ variant }),
    disabled && 'pointer-events-none opacity-40',
    className,
  );
  const buttonType = submit ? 'submit' : type;
  const isLink = Boolean(route) && route !== '#' && buttonType !== 'submit' && buttonType !== 'reset';

  const content = isLoading ? (
    <Loader className={primary || danger ? 'text-(--lens-blue-ink)' : 'text-(--ink)'} />
  ) : (
    <>
      {icon && <FontAwesomeIcon icon={icon} />}
      {children || value}
    </>
  );

  if (isLink) {
    return (
      <Link
        to={route as string}
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
        aria-disabled={disabled || undefined}
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
      onClick={onClick as MouseEventHandler<HTMLButtonElement> | undefined}
      className={className}
      disabled={disabled}
      {...rest}
    >
      {content}
    </ButtonUI>
  );
};

export default Button;
