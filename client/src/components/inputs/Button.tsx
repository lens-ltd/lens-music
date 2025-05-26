import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, MouseEventHandler, ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
  route?: string;
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  type?: 'submit' | 'button' | 'reset';
  disabled?: boolean;
  primary?: boolean;
  styled?: boolean;
  className?: string;
  submit?: boolean;
  danger?: boolean;
  icon?: IconProp;
}

const Button: FC<ButtonProps> = ({
  route = '#',
  children,
  onClick,
  type = null,
  disabled = false,
  primary = false,
  styled = true,
  className,
  submit = false,
  danger = false,
  icon = undefined,
}) => {
  if (submit || type === 'submit') {
    return (
      <button
        type={type || 'submit'}
        onClick={onClick as MouseEventHandler<HTMLButtonElement> | undefined}
        className={`py-[6px] flex items-center justify-center text-center border-[1px] border-primary px-4 rounded-md text-[14px] text-primary bg-white hover:bg-primary hover:text-white cursor-pointer ease-in-out duration-400 hover:scale-[1.005] max-[800px]:!text-lg max-md:!py-2 ${
          !styled &&
          '!bg-transparent !shadow-none !text-primary hover:!scale-[1.005] !py-0 !px-0 !border-none hover:!bg-transparent hover:!text-primary'
        } ${className} ${
          primary &&
          '!bg-primary !text-white hover:!bg-primary hover:!text-white !shadow-sm'
        }
        ${
          danger &&
          '!bg-red-600 !border-none !text-white hover:!bg-red-600 hover:!text-white !shadow-sm'
        } ${
          disabled &&
          '!bg-secondary !shadow-none hover:!scale-[1] !cursor-default hover:!bg-secondary hover:text-opacity-80 !duration-0 text-white text-opacity-80 !border-none text-center transition-all'
        }`}
        disabled={disabled}
      >
        {children}
      </button>
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
        onClick && onClick(e);
      }}
      className={`py-[6px] text-center border-[1px] border-primary px-4 rounded-md text-[14px] text-primary bg-white hover:bg-primary hover:text-white cursor-pointer ease-in-out duration-400 hover:scale-[1.005] max-[800px]:!text-lg max-md:!py-2 ${
        !styled &&
        '!bg-transparent !shadow-none !text-primary hover:!scale-[1.005] !py-0 !px-0 !border-none hover:!bg-transparent hover:!text-primary'
      } ${className} ${
        primary &&
        '!bg-primary !text-white hover:!bg-primary hover:!text-white !shadow-sm'
      }
      ${
        danger &&
        '!bg-red-600 !border-none !text-white hover:!bg-red-600 hover:!text-white !shadow-sm'
      } ${
        disabled &&
        '!bg-secondary !shadow-none hover:!scale-[1] !cursor-default hover:!bg-secondary hover:text-opacity-80 !duration-0 text-white text-opacity-80 !border-none text-center transition-all'
      }`}
    >
      {icon ? (
        <menu className="flex items-center gap-2">
          <FontAwesomeIcon icon={icon} />
          <p className="text-[14px]">{children}</p>
        </menu>
      ) : (
        children
      )}
    </Link>
  );
};

export default Button;
