// ============================================
// components/ui/Button/Button.tsx
// ============================================

import React from 'react';
import clsx from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled,
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={clsx(
        'form-btn',
        `form-btn--${variant}`,
        `form-btn--${size}`,
        fullWidth && 'form-btn--full-width',
        loading && 'form-btn--loading',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="form-btn__spinner" />}
      <span className={clsx('form-btn__content', loading && 'form-btn__content--hidden')}>
        {children}
      </span>
    </button>
  );
};

export default Button;
