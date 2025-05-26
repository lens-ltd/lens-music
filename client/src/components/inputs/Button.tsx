import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, MouseEventHandler, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Loader from './Loader';

interface ButtonProps {
  route?: string;
  value?: ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  type?: 'submit' | 'button' | 'reset';
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
  icon = undefined,
  isLoading = false,
  children,
}) => {
  if (submit || type === 'submit') {
    return (
      <button
        type={type || 'submit'}
        onClick={onClick as MouseEventHandler<HTMLButtonElement> | undefined}
        className={`py-[6px] flex items-center gap-2 justify-center text-center border-[1px] border-primary px-4 rounded-md text-[13px] text-primary bg-white hover:bg-primary hover:text-white cursor-pointer ease-in-out duration-400 hover:scale-[1.005] max-[800px]:!text-lg max-md:!py-2 ${
          !styled &&
          '!bg-transparent !shadow-none !text-primary hover:!scale-[1.005] !py-0 !px-0 !border-none hover:!bg-transparent hover:!text-primary'
        } ${className} ${
          primary &&
          '!bg-primary !text-white hover:!bg-primary hover:!text-white !shadow-sm'
        }
        ${
          danger &&
          '!bg-red-700 !border-none !text-white hover:!bg-red-700 hover:!text-white !shadow-sm'
        } ${
          disabled &&
          '!bg-secondary !shadow-none hover:!scale-[1] !cursor-default hover:!bg-secondary hover:text-opacity-80 !duration-0 text-white text-opacity-80 !border-none text-center transition-all'
        }`}
        disabled={disabled}
      >
        {isLoading ? (
          <Loader className={primary ? 'text-white' : 'text-primary'} />
        ) : (
          <>
            {icon && <FontAwesomeIcon icon={icon} />}
            {children || value}
          </>
        )}
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
        if (onClick) {
          onClick(e);
        }
      }}
      className={`py-[6px] text-center flex items-center gap-2 justify-center border-[1px] border-primary px-4 rounded-md text-[13px] text-primary bg-white hover:bg-primary hover:text-white cursor-pointer ease-in-out duration-400 hover:scale-[1.005] max-[800px]:!text-lg max-md:!py-2 ${
        !styled &&
        '!bg-transparent !shadow-none !text-primary hover:!scale-[1.005] !py-0 !px-0 !border-none hover:!bg-transparent hover:!text-primary'
      } ${className} ${
        primary &&
        '!bg-primary !text-white hover:!bg-primary hover:!text-white !shadow-sm'
      }
      ${
        danger &&
        '!bg-red-700 !border-none !text-white hover:!bg-red-700 hover:!text-white !shadow-sm'
      } ${
        disabled &&
        '!bg-secondary !shadow-none hover:!scale-[1] !cursor-default hover:!bg-secondary hover:text-opacity-80 !duration-0 text-white text-opacity-80 !border-none text-center transition-all'
      }`}
    >
      {isLoading ? (
        <Loader className={primary ? 'text-white' : 'text-primary'} />
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
