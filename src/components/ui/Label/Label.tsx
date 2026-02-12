// ============================================
// components/ui/Label/Label.tsx
// ============================================

import React from 'react';
import clsx from 'clsx';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  children: React.ReactNode;
}

export const Label: React.FC<LabelProps> = ({
  required,
  className,
  children,
  ...props
}) => {
  return (
    <label className={clsx('form-label', className)} {...props}>
      {children}
      {required && <span className="form-label__required">*</span>}
    </label>
  );
};

export default Label;
