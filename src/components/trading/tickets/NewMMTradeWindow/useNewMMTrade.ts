// ============================================
// NewMMTradeWindow/useNewMMTrade.ts - Form State & Calculations Hook
// ============================================

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useFormValidation } from '@/hooks/useFormValidation';
import { newMMTradeSchema } from './schema';
import type {
  MMTradeFormState,
  MMDirection,
  DepositType,
  RateType,
  TenorPreset,
  MMTabId,
  ValidationError,
  ValidationWarning,
  InitialMMStateOptions,
  MMDayCountConvention,
} from './types';
import { referenceRateOptions } from '@/mocks/mmReferenceData';


// Calculate days between dates
function daysBetween(start: Date, end: Date): number {
  const diff = end.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// Get tenor days
function getTenorDays(tenor: TenorPreset): number {
  const days: Record<TenorPreset, number> = {
    'O/N': 1,
    '1W': 7,
    '2W': 14,
    '1M': 30,
    '2M': 60,
    '3M': 91,
    '6M': 182,
    '9M': 273,
    '12M': 365,
    'CUSTOM': 0,
  };
  return days[tenor] || 0;
}

// Calculate maturity date from tenor
function calculateMaturityDate(valueDate: Date, tenor: TenorPreset): Date {
  const days = getTenorDays(tenor);
  if (days === 0) return valueDate;

  const result = new Date(valueDate);
  result.setDate(result.getDate() + days);
  return result;
}

// Calculate simple interest
function calculateSimpleInterest(
  principal: number,
  rate: number,
  days: number,
  dayCount: number = 365
): number {
  return principal * (rate / 100) * (days / dayCount);
}

// Calculate day count divisor
function getDayCountDivisor(convention: MMDayCountConvention): number {
  switch (convention) {
    case 'ACT/360':
      return 360;
    case '30/360':
      return 360;
    case 'ACT/365':
    default:
      return 365;
  }
}

// Create initial state
export function createInitialMMTradeState(options: InitialMMStateOptions = {}): MMTradeFormState {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tenor: TenorPreset = '3M';
  const maturityDate = calculateMaturityDate(today, tenor);

  return {
    // Tab 1: Deposit Details
    tradeReference: undefined,
    direction: 'PLACEMENT',
    depositType: 'FIXED',
    principalAmount: null,
    currency: 'ZAR',
    tradeDate: today,
    valueDate: today,
    tenor,
    maturityDate,
    days: getTenorDays(tenor),
    noticePeriod: undefined,

    // Tab 2: Pricing & Interest
    rateType: 'FIXED',
    interestRate: null,
    dayCountConvention: 'ACT/365',
    referenceRate: undefined,
    currentReference: undefined,
    spreadBps: undefined,
    allInRate: undefined,
    interestFrequency: 'AT_MATURITY',
    compounding: 'SIMPLE',
    interestAmount: 0,
    maturityProceeds: 0,
    autoRollover: false,
    rolloverTenor: undefined,
    capitalizeInterest: false,

    // Tab 3: Counterparty & Account
    fundId: options.defaultFund || '',
    counterpartyBank: '',
    dealerBroker: 'DIRECT',
    traderId: options.currentUserId || 'trader-001',
    confirmationMethod: 'SWIFT_MT320',
    bankContact: undefined,

    // Tab 4: Settlement
    settlementType: 'SAME_DAY',
    fundingAccount: '',
    bankSwift: undefined,
    bankAccountNumber: undefined,
    paymentReference: '',
    specialInstructions: undefined,

    // Tab 5: Status & Notes
    tradeStatus: 'DRAFT',
    approvalWorkflow: undefined,
    complianceChecks: undefined,
    notes: undefined,
    internalReference: undefined,
    externalReference: undefined,
  };
}

export interface UseNewMMTradeReturn {
  // Form state
  values: Partial<MMTradeFormState>;
  errors: Partial<Record<keyof MMTradeFormState, { message: string }>>;
  touched: Partial<Record<keyof MMTradeFormState, boolean>>;
  isValid: boolean;
  isDirty: boolean;

  // Tab state
  activeTab: MMTabId;
  setActiveTab: (tab: MMTabId) => void;
  tabErrors: Record<MMTabId, number>;

  // Field handlers
  setValue: <K extends keyof MMTradeFormState>(field: K, value: MMTradeFormState[K]) => void;
  setValues: (values: Partial<MMTradeFormState>) => void;
  setTouched: (field: keyof MMTradeFormState) => void;
  validateField: (field: keyof MMTradeFormState) => void;

  // Calculations
  interestAmount: number;
  maturityProceeds: number;
  annualizedReturn: number;

  // Actions
  validate: () => boolean;
  reset: () => void;
  handleDirectionChange: (direction: MMDirection) => void;
  handleDepositTypeChange: (type: DepositType) => void;
  handleRateTypeChange: (type: RateType) => void;
  handleTenorChange: (tenor: TenorPreset) => void;
  handleSubmit: () => Promise<boolean>;

  // Validation state
  validationErrors: ValidationError[];
  validationWarnings: ValidationWarning[];
}

export function useNewMMTrade(
  options: InitialMMStateOptions = {}
): UseNewMMTradeReturn {
  const initialValues = useMemo(() => createInitialMMTradeState(options), [options]);

  const {
    values,
    errors,
    touched,
    isValid,
    isDirty,
    setValue: setFormValue,
    setValues: setFormValues,
    setTouched,
    validate,
    validateField,
    reset: resetForm,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useFormValidation<any>({
    schema: newMMTradeSchema,
    initialValues,
  });

  const [activeTab, setActiveTab] = useState<MMTabId>('deposit-details');

  // Calculate interest amount
  const interestAmount = useMemo(() => {
    const principal = values.principalAmount ?? 0;
    const days = values.days ?? 0;
    const dayCount = getDayCountDivisor(values.dayCountConvention ?? 'ACT/365');

    let rate = values.interestRate ?? 0;
    if (values.rateType === 'FLOATING' && values.allInRate !== undefined) {
      rate = values.allInRate;
    }

    if (values.compounding === 'SIMPLE') {
      return calculateSimpleInterest(principal, rate, days, dayCount);
    } else {
      // Compound interest (simplified - at maturity only)
      const periodRate = rate / 100;
      const yearFraction = days / dayCount;
      return principal * (Math.pow(1 + periodRate, yearFraction) - 1);
    }
  }, [values.principalAmount, values.interestRate, values.days, values.dayCountConvention, values.compounding, values.rateType, values.allInRate]);

  // Calculate maturity proceeds
  const maturityProceeds = useMemo(() => {
    const principal = values.principalAmount ?? 0;
    return principal + interestAmount;
  }, [values.principalAmount, interestAmount]);

  // Calculate annualized return
  const annualizedReturn = useMemo(() => {
    const principal = values.principalAmount ?? 0;
    const days = values.days ?? 0;
    if (principal <= 0 || days <= 0) return 0;

    const dayCount = getDayCountDivisor(values.dayCountConvention ?? 'ACT/365');
    return (interestAmount / principal) * (dayCount / days) * 100;
  }, [interestAmount, values.principalAmount, values.days, values.dayCountConvention]);

  // Update calculated values in form state
  useEffect(() => {
    setFormValues({
      interestAmount,
      maturityProceeds,
    });
  }, [interestAmount, maturityProceeds, setFormValues]);

  // Update all-in rate when reference rate or spread changes
  useEffect(() => {
    if (values.rateType === 'FLOATING' && values.currentReference !== undefined) {
      const spread = (values.spreadBps ?? 0) / 100; // Convert bps to percentage
      setFormValue('allInRate', values.currentReference + spread);
    }
  }, [values.rateType, values.currentReference, values.spreadBps, setFormValue]);

  // Update days when value date or maturity date changes
  useEffect(() => {
    if (values.valueDate && values.maturityDate) {
      const days = daysBetween(values.valueDate, values.maturityDate);
      setFormValue('days', Math.max(0, days));
    }
  }, [values.valueDate, values.maturityDate, setFormValue]);

  // Handle direction change
  const handleDirectionChange = useCallback((direction: MMDirection) => {
    setFormValue('direction', direction);
  }, [setFormValue]);

  // Handle deposit type change
  const handleDepositTypeChange = useCallback((type: DepositType) => {
    setFormValues({
      depositType: type,
      dayCountConvention: 'ACT/365',
      // Clear maturity for CALL and NOTICE types
      maturityDate: ['CALL', 'NOTICE'].includes(type) ? null : values.maturityDate,
      noticePeriod: type === 'NOTICE' ? 32 : undefined,
    });
  }, [setFormValues, values.maturityDate]);

  // Handle rate type change
  const handleRateTypeChange = useCallback((type: RateType) => {
    setFormValues({
      rateType: type,
      // Clear floating rate fields when switching to fixed
      referenceRate: type === 'FIXED' ? undefined : values.referenceRate,
      currentReference: type === 'FIXED' ? undefined : values.currentReference,
      spreadBps: type === 'FIXED' ? undefined : values.spreadBps,
      allInRate: type === 'FIXED' ? undefined : values.allInRate,
    });
  }, [setFormValues, values.referenceRate, values.currentReference, values.spreadBps, values.allInRate]);

  // Handle tenor change
  const handleTenorChange = useCallback((tenor: TenorPreset) => {
    const valueDate = values.valueDate ?? new Date();
    const maturityDate = tenor === 'CUSTOM' ? values.maturityDate : calculateMaturityDate(valueDate, tenor);
    const days = maturityDate ? daysBetween(valueDate, maturityDate) : getTenorDays(tenor);

    setFormValues({
      tenor,
      maturityDate,
      days,
    });
  }, [setFormValues, values.valueDate, values.maturityDate]);

  // Count errors per tab
  const tabErrors = useMemo(() => {
    const counts: Record<MMTabId, number> = {
      'deposit-details': 0,
      'pricing': 0,
      'counterparty': 0,
      'settlement': 0,
      'status': 0,
    };

    const depositFields = ['direction', 'depositType', 'principalAmount', 'currency', 'tradeDate', 'valueDate', 'tenor', 'maturityDate'];
    const pricingFields = ['rateType', 'interestRate', 'dayCountConvention', 'referenceRate', 'interestFrequency'];
    const counterpartyFields = ['fundId', 'counterpartyBank', 'traderId'];
    const settlementFields = ['settlementType', 'fundingAccount'];
    const statusFields = ['tradeStatus', 'notes'];

    Object.keys(errors).forEach((field) => {
      if (depositFields.includes(field)) counts['deposit-details']++;
      else if (pricingFields.includes(field)) counts['pricing']++;
      else if (counterpartyFields.includes(field)) counts['counterparty']++;
      else if (settlementFields.includes(field)) counts['settlement']++;
      else if (statusFields.includes(field)) counts['status']++;
    });

    return counts;
  }, [errors]);

  // Generate validation errors list
  const validationErrors = useMemo(() => {
    return Object.entries(errors).map(([field, error]) => ({
      field,
      message: error?.message || 'Invalid value',
    }));
  }, [errors]);

  // Generate warnings (non-blocking)
  const validationWarnings = useMemo(() => {
    const warnings: ValidationWarning[] = [];

    // Large deposit warning
    if (values.principalAmount && values.principalAmount > 100000000) {
      warnings.push({
        field: 'principalAmount',
        message: 'Large deposit: may require additional approval',
      });
    }

    // Rate comparison warning
    if (values.rateType === 'FIXED' && values.interestRate) {
      const jibar3m = referenceRateOptions.find(r => r.id === 'JIBAR_3M')?.value ?? 8.25;
      const diff = jibar3m - values.interestRate;
      if (diff > 2) {
        warnings.push({
          field: 'interestRate',
          message: `Rate is ${diff.toFixed(0)} bps below JIBAR 3M`,
        });
      }
    }

    return warnings;
  }, [values.principalAmount, values.rateType, values.interestRate]);

  // Submit handler
  const handleSubmit = useCallback(async (): Promise<boolean> => {
    const isFormValid = validate();
    if (!isFormValid) {
      return false;
    }

    // Here you would typically make an API call
    console.log('Submitting MM trade:', values);

    return true;
  }, [validate, values]);

  // Reset handler
  const reset = useCallback(() => {
    resetForm();
    setActiveTab('deposit-details');
  }, [resetForm]);

  // Custom setValue that handles type conversion
  const setValue = useCallback(<K extends keyof MMTradeFormState>(
    field: K,
    value: MMTradeFormState[K]
  ) => {
    setFormValue(field, value as unknown);
  }, [setFormValue]);

  return {
    // Form state
    values,
    errors,
    touched,
    isValid,
    isDirty,

    // Tab state
    activeTab,
    setActiveTab,
    tabErrors,

    // Field handlers
    setValue,
    setValues: setFormValues,
    setTouched,
    validateField,

    // Calculations
    interestAmount,
    maturityProceeds,
    annualizedReturn,

    // Actions
    validate,
    reset,
    handleDirectionChange,
    handleDepositTypeChange,
    handleRateTypeChange,
    handleTenorChange,
    handleSubmit,

    // Validation state
    validationErrors,
    validationWarnings,
  };
}
