import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, MouseEvent, MouseEventHandler, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button as ShadcnButton } from '@/components/ui/button';
import Loader from './Loader';

interface ButtonProps {
  route?: string;
  value?: ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement & HTMLButtonElement>;
  type?: 'submit' | 'button' | 'reset' | null;
  disabled?: boolean;
  primary?: boolean;
  styled?: boolean;
  className?: string;
  submit?: boolean;
  danger?: boolean;
  icon?: IconProp;
  isLoading?: boolean;
  children?: ReactNode;
}

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
  icon,
  isLoading = false,
  children,
}) => {
  const content = isLoading ? (
    <Loader className={primary || danger ? 'text-white' : 'text-primary'} />
  ) : (
    <>
      {icon && <FontAwesomeIcon icon={icon} className="text-[12px]" />}
      {children || value}
    </>
  );

  const classes = cn(
    'inline-flex items-center cursor-pointer justify-center gap-2 rounded-md text-[12px] tracking-[0.02em] font-normal transition-all duration-150 select-none',
    !styled && 'border-0 bg-transparent shadow-none hover:bg-transparent px-0 py-0 h-auto text-primary justify-start active:scale-95',
    styled && 'min-h-9 px-4 py-2',
    styled && !primary && !danger && 'border border-primary bg-white text-primary hover:bg-[color:var(--lens-sand)] hover:shadow-sm active:scale-[0.97] active:shadow-none',
    primary && 'border border-primary bg-primary text-white hover:brightness-110 hover:shadow-md active:scale-[0.97] active:brightness-95 active:shadow-none',
    danger && 'border border-red-700 bg-red-700 text-white hover:brightness-110 hover:shadow-md active:scale-[0.97] active:brightness-95 active:shadow-none',
    disabled && 'pointer-events-none opacity-50',
    className
  );

  if (submit || type === 'submit' || type === 'button' || type === 'reset') {
    return (
      <ShadcnButton
        type={(type || (submit ? 'submit' : 'button')) as 'submit' | 'button' | 'reset'}
        onClick={onClick as MouseEventHandler<HTMLButtonElement> | undefined}
        disabled={disabled}
        variant="ghost"
        className={classes}
      >
        {content}
      </ShadcnButton>
    );
  }

  return (
    <ShadcnButton
      asChild
      variant="ghost"
      disabled={disabled}
      className={classes}
    >
      <Link
        to={route}
        onClick={(e) => {
          if (disabled) {
            e.preventDefault();
            return;
          }
          onClick?.(e as unknown as MouseEvent<HTMLAnchorElement> & MouseEvent<HTMLButtonElement>);
        }}
      >
        {content}
      </Link>
    </ShadcnButton>
  );
};

export default Button;
