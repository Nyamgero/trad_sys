// ============================================
// components/ui/Input/Input.tsx
// ============================================

import React, { forwardRef } from 'react';
import clsx from 'clsx';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  error?: string;
  onChange?: (value: string) => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className, onChange, type = 'text', ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value);
    };

    return (
      <input
        ref={ref}
        type={type}
        className={clsx(
          'form-input',
          error && 'form-input--error',
          className
        )}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;
