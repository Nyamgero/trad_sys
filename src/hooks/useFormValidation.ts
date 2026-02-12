// ============================================
// hooks/useFormValidation.ts - Form Validation Hook
// ============================================

import { useState, useCallback, useMemo } from 'react';
import type { z } from 'zod';

export interface FieldError {
  message: string;
}

export type FormErrors<T> = Partial<Record<keyof T, FieldError>>;

interface UseFormValidationOptions<T> {
  schema: z.ZodType<T>;
  initialValues: Partial<T>;
}

interface UseFormValidationReturn<T> {
  values: Partial<T>;
  errors: FormErrors<T>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isDirty: boolean;
  setValue: <K extends keyof T>(field: K, value: T[K]) => void;
  setValues: (values: Partial<T>) => void;
  setTouched: (field: keyof T) => void;
  validate: () => boolean;
  validateField: (field: keyof T) => void;
  reset: () => void;
  getFieldProps: (field: keyof T) => {
    value: T[keyof T] | undefined;
    onChange: (value: T[keyof T]) => void;
    onBlur: () => void;
    error: string | undefined;
  };
}

export function useFormValidation<T extends Record<string, unknown>>({
  schema,
  initialValues,
}: UseFormValidationOptions<T>): UseFormValidationReturn<T> {
  const [values, setValuesState] = useState<Partial<T>>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [touched, setTouchedState] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isDirty, setIsDirty] = useState(false);

  const parseZodErrors = useCallback((zodError: z.ZodError): FormErrors<T> => {
    const fieldErrors: FormErrors<T> = {};
    const issues = zodError.issues || [];
    for (const issue of issues) {
      const path = issue.path[0] as keyof T;
      if (path && !fieldErrors[path]) {
        fieldErrors[path] = { message: issue.message };
      }
    }
    return fieldErrors;
  }, []);

  const validate = useCallback((): boolean => {
    const result = schema.safeParse(values);
    if (!result.success) {
      setErrors(parseZodErrors(result.error as z.ZodError));
      return false;
    }
    setErrors({});
    return true;
  }, [schema, values, parseZodErrors]);

  const validateField = useCallback(
    (field: keyof T): void => {
      const result = schema.safeParse(values);
      if (!result.success) {
        const zodError = result.error as z.ZodError;
        const issues = zodError.issues || [];
        const fieldError = issues.find(
          (issue) => issue.path[0] === field
        );
        if (fieldError) {
          setErrors((prev) => ({
            ...prev,
            [field]: { message: fieldError.message },
          }));
        } else {
          setErrors((prev) => {
            const next = { ...prev };
            delete next[field];
            return next;
          });
        }
      } else {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
    },
    [schema, values]
  );

  const setValue = useCallback(
    <K extends keyof T>(field: K, value: T[K]): void => {
      setValuesState((prev) => ({ ...prev, [field]: value }));
      setIsDirty(true);
    },
    []
  );

  const setValues = useCallback((newValues: Partial<T>): void => {
    setValuesState((prev) => ({ ...prev, ...newValues }));
    setIsDirty(true);
  }, []);

  const setTouched = useCallback((field: keyof T): void => {
    setTouchedState((prev) => ({ ...prev, [field]: true }));
  }, []);

  const reset = useCallback((): void => {
    setValuesState(initialValues);
    setErrors({});
    setTouchedState({});
    setIsDirty(false);
  }, [initialValues]);

  const getFieldProps = useCallback(
    (field: keyof T) => ({
      value: values[field] as T[keyof T] | undefined,
      onChange: (value: T[keyof T]) => setValue(field, value),
      onBlur: () => {
        setTouched(field);
        validateField(field);
      },
      error: touched[field] ? errors[field]?.message : undefined,
    }),
    [values, errors, touched, setValue, setTouched, validateField]
  );

  const isValid = useMemo(() => {
    const result = schema.safeParse(values);
    return result.success;
  }, [schema, values]);

  return {
    values,
    errors,
    touched,
    isValid,
    isDirty,
    setValue,
    setValues,
    setTouched,
    validate,
    validateField,
    reset,
    getFieldProps,
  };
}
