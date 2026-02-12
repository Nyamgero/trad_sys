// ============================================
// components/ui/FormField/FormField.tsx
// ============================================

import React from 'react';
import clsx from 'clsx';
import { Label } from '../Label';

export interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  required,
  error,
  hint,
  className,
  children,
}) => {
  return (
    <div className={clsx('form-field', error && 'form-field--error', className)}>
      <Label htmlFor={htmlFor} required={required}>
        {label}
      </Label>
      {children}
      {error && <span className="form-field__error">{error}</span>}
      {hint && !error && <span className="form-field__hint">{hint}</span>}
    </div>
  );
};

export default FormField;
