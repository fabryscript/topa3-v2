/* eslint-disable react/require-default-props */
import classNames from 'classnames';
import { PropsWithChildren } from 'react';

interface IButtonProps {
  variant: 'primary' | 'secondary' | 'ghost';
  label?: string;
  onClick?: () => void;
  className?: string;
  isDisabled?: boolean;
}

export default function Button({
  onClick,
  variant,
  label,
  className,
  children,
  isDisabled,
}: PropsWithChildren<IButtonProps>) {
  return (
    <button
      type="button"
      className={classNames(
        'inline-flex items-center py-2 px-4 rounded-2xl',
        {
          'bg-blue-200 hover:bg-blue-300 text-neutral-800':
            variant === 'primary',
          'border-blue-200 border border-opacity-0 transition-all hover:border-opacity-100':
            variant === 'secondary',
          'hover:bg-neutral-700 transition-colors text-neutral-200':
            variant === 'ghost',
          'opacity-70 hover:cursor-not-allowed': isDisabled,
        },
        className,
      )}
      disabled={isDisabled}
      onClick={onClick}
    >
      {label || children}
    </button>
  );
}
