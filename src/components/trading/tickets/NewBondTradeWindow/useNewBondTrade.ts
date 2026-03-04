// ============================================
// NewBondTradeWindow/useNewBondTrade.ts - Form State & Calculations Hook
// ============================================

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useFormValidation } from '@/hooks/useFormValidation';
import { newBondTradeSchema } from './schema';
import type {
  BondTradeFormState,
  BondDirection,
  BondTabId,
  ValidationError,
  ValidationWarning,
  BondInstrument,
  BondQuoteData,
  BondInstrumentDetails,
  DayCountConvention,
  InitialBondStateOptions,
  AccruedInterestCalc,
} from './types';

// Add business days helper
function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    const dayOfWeek = result.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      added++;
    }
  }
  return result;
}

// Get settlement days from convention
function getSettlementDays(convention: string): number {
  switch (convention) {
    case 'T+0': return 0;
    case 'T+1': return 1;
    case 'T+2': return 2;
    case 'T+3': return 3;
    default: return 2;
  }
}

// Calculate days between dates based on day count convention
function calculateDaysAccrued(
  lastCoupon: Date,
  settlement: Date,
  convention: DayCountConvention
): number {
  switch (convention) {
    case 'ACT/ACT':
    case 'ACT/360':
    case 'ACT/365':
      return Math.floor((settlement.getTime() - lastCoupon.getTime()) / (1000 * 60 * 60 * 24));
    case '30/360':
    case '30E/360': {
      // 30/360 day count
      let d1 = lastCoupon.getDate();
      let d2 = settlement.getDate();
      const m1 = lastCoupon.getMonth();
      const m2 = settlement.getMonth();
      const y1 = lastCoupon.getFullYear();
      const y2 = settlement.getFullYear();

      if (d1 === 31) d1 = 30;
      if (convention === '30/360' && d1 === 30 && d2 === 31) d2 = 30;
      if (convention === '30E/360' && d2 === 31) d2 = 30;

      return (y2 - y1) * 360 + (m2 - m1) * 30 + (d2 - d1);
    }
    default:
      return Math.floor((settlement.getTime() - lastCoupon.getTime()) / (1000 * 60 * 60 * 24));
  }
}

// Calculate days in coupon period
function getDaysInPeriod(convention: DayCountConvention, couponFrequency: number): number {
  switch (convention) {
    case 'ACT/360':
      return 360 / couponFrequency;
    case 'ACT/365':
      return 365 / couponFrequency;
    case '30/360':
    case '30E/360':
      return 360 / couponFrequency;
    case 'ACT/ACT':
    default:
      // For ACT/ACT, this is an approximation; actual calculation would need the specific period dates
      return 365 / couponFrequency;
  }
}

// Calculate accrued interest
function calculateAccruedInterest(
  bondDetails: BondInstrumentDetails | undefined,
  settlementDate: Date,
  faceValue: number
): AccruedInterestCalc | null {
  if (!bondDetails || faceValue <= 0) return null;

  const { couponRate, couponFrequency, dayCountConvention, maturityDate } = bondDetails;

  // Simplified: find the last coupon date before settlement
  // In reality, this would use the actual coupon schedule
  const periodsPerYear = couponFrequency;
  const monthsPerPeriod = 12 / periodsPerYear;

  // Find the most recent coupon date
  let lastCouponDate = new Date(maturityDate);
  while (lastCouponDate > settlementDate) {
    lastCouponDate.setMonth(lastCouponDate.getMonth() - monthsPerPeriod);
  }

  // Calculate next coupon date
  const nextCouponDate = new Date(lastCouponDate);
  nextCouponDate.setMonth(nextCouponDate.getMonth() + monthsPerPeriod);

  const daysAccrued = calculateDaysAccrued(lastCouponDate, settlementDate, dayCountConvention);
  const daysInPeriod = dayCountConvention === 'ACT/ACT'
    ? calculateDaysAccrued(lastCouponDate, nextCouponDate, 'ACT/ACT')
    : getDaysInPeriod(dayCountConvention, couponFrequency);

  const couponPerPeriod = couponRate / couponFrequency;
  const accruedFraction = daysAccrued / daysInPeriod;
  const accruedPercent = couponPerPeriod * accruedFraction;
  const accruedAmount = (accruedPercent / 100) * faceValue;

  return {
    lastCouponDate,
    settlementDate,
    daysAccrued,
    daysInPeriod,
    accruedPercent,
    accruedAmount,
  };
}

// Calculate Yield to Maturity using Newton-Raphson
function calculateYTM(
  cleanPrice: number,
  couponRate: number,
  yearsToMaturity: number,
  couponFrequency: number,
  faceValue: number = 100
): number {
  const periodsRemaining = Math.ceil(yearsToMaturity * couponFrequency);
  const couponPayment = (couponRate / couponFrequency) * faceValue / 100;

  let ytm = couponRate / 100; // Initial guess
  const tolerance = 0.000001;
  const maxIterations = 100;

  for (let i = 0; i < maxIterations; i++) {
    const r = ytm / couponFrequency;
    let price = 0;
    let derivative = 0;

    for (let t = 1; t <= periodsRemaining; t++) {
      const discountFactor = Math.pow(1 + r, -t);
      price += couponPayment * discountFactor;
      derivative -= t * couponPayment * discountFactor / (1 + r);
    }

    price += faceValue * Math.pow(1 + r, -periodsRemaining);
    derivative -= periodsRemaining * faceValue * Math.pow(1 + r, -(periodsRemaining + 1));

    const diff = price - cleanPrice;
    if (Math.abs(diff) < tolerance) break;

    ytm = ytm + diff / (-derivative / couponFrequency);
  }

  return ytm * 100; // Return as percentage
}

// Create initial state
export function createInitialBondTradeState(options: InitialBondStateOptions = {}): BondTradeFormState {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return {
    // Tab 1: Bond Identification
    tradeReference: undefined,
    bondIdentifier: '',
    bondName: '',
    currency: 'USD',
    bondDetails: undefined,

    // Tab 2: Transaction Details
    direction: 'BUY',
    faceValue: null,
    executionVenue: 'TRACE',
    capacity: 'PRINCIPAL',
    specialConditions: [],

    // Tab 3: Pricing & Yield
    cleanPrice: null,
    accruedInterest: 0,
    dirtyPrice: 0,
    ytm: null,
    yieldToWorst: undefined,
    currentMarketYield: undefined,
    yieldMetrics: undefined,

    // Tab 4: Parties & Accounts
    fundAccountId: options.defaultFund || '',
    counterparty: '',
    traderId: options.currentUserId || 'trader-001',

    // Tab 5: Settlement & Costs
    tradeDate: today,
    tradeTime: undefined,
    settlementDate: addBusinessDays(today, 2),
    settlementConvention: 'T+2',
    valueDate: undefined,
    commissionFees: null,
    taxesWithholding: null,
    netSettlementAmount: 0,
    fxRate: undefined,
    tradeStatus: 'pending',
    notes: undefined,
  };
}

export interface UseNewBondTradeReturn {
  // Form state
  values: Partial<BondTradeFormState>;
  errors: Partial<Record<keyof BondTradeFormState, { message: string }>>;
  touched: Partial<Record<keyof BondTradeFormState, boolean>>;
  isValid: boolean;
  isDirty: boolean;

  // Tab state
  activeTab: BondTabId;
  setActiveTab: (tab: BondTabId) => void;
  tabErrors: Record<BondTabId, number>;

  // Field handlers
  setValue: <K extends keyof BondTradeFormState>(field: K, value: BondTradeFormState[K]) => void;
  setValues: (values: Partial<BondTradeFormState>) => void;
  setTouched: (field: keyof BondTradeFormState) => void;
  validateField: (field: keyof BondTradeFormState) => void;

  // Calculations
  principalValue: number;
  accruedInterest: number;
  dirtyValue: number;
  netSettlement: number;
  accruedCalc: AccruedInterestCalc | null;

  // Actions
  validate: () => boolean;
  reset: () => void;
  handleBondSelect: (bond: BondInstrument) => void;
  handleQuoteUpdate: (quote: BondQuoteData) => void;
  handleDirectionChange: (direction: BondDirection) => void;
  handleSubmit: () => Promise<boolean>;

  // Validation state
  validationErrors: ValidationError[];
  validationWarnings: ValidationWarning[];
}

export function useNewBondTrade(
  options: InitialBondStateOptions = {}
): UseNewBondTradeReturn {
  const initialValues = useMemo(() => createInitialBondTradeState(options), [options]);

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
    schema: newBondTradeSchema,
    initialValues,
  });

  const [activeTab, setActiveTab] = useState<BondTabId>('bond-id');
  const [quote, setQuote] = useState<BondQuoteData | null>(null);

  // Calculate principal value (face value * clean price / 100)
  const principalValue = useMemo(() => {
    const faceVal = values.faceValue ?? 0;
    const price = values.cleanPrice ?? 0;
    return (price / 100) * faceVal;
  }, [values.faceValue, values.cleanPrice]);

  // Calculate accrued interest
  const accruedCalc = useMemo(() => {
    return calculateAccruedInterest(
      values.bondDetails,
      values.settlementDate ?? new Date(),
      values.faceValue ?? 0
    );
  }, [values.bondDetails, values.settlementDate, values.faceValue]);

  const accruedInterest = accruedCalc?.accruedAmount ?? 0;

  // Calculate dirty value
  const dirtyValue = useMemo(() => {
    return principalValue + accruedInterest;
  }, [principalValue, accruedInterest]);

  // Calculate dirty price (as % of par)
  const dirtyPrice = useMemo(() => {
    const faceVal = values.faceValue ?? 0;
    if (faceVal <= 0) return 0;
    return (dirtyValue / faceVal) * 100;
  }, [dirtyValue, values.faceValue]);

  // Calculate net settlement
  const netSettlement = useMemo(() => {
    const direction = values.direction;
    const commission = values.commissionFees ?? 0;
    const taxes = values.taxesWithholding ?? 0;

    if (direction === 'BUY') {
      return dirtyValue + commission + taxes;
    } else {
      return dirtyValue - commission - taxes;
    }
  }, [dirtyValue, values.direction, values.commissionFees, values.taxesWithholding]);

  // Calculate YTM when price changes
  const calculatedYTM = useMemo(() => {
    if (!values.cleanPrice || !values.bondDetails) return null;

    const maturityDate = values.bondDetails.maturityDate;
    const settlementDate = values.settlementDate ?? new Date();
    const yearsToMaturity = (maturityDate.getTime() - settlementDate.getTime()) / (1000 * 60 * 60 * 24 * 365);

    if (yearsToMaturity <= 0) return null;

    return calculateYTM(
      values.cleanPrice,
      values.bondDetails.couponRate,
      yearsToMaturity,
      values.bondDetails.couponFrequency
    );
  }, [values.cleanPrice, values.bondDetails, values.settlementDate]);

  // Update calculated values in form state
  useEffect(() => {
    setFormValues({
      accruedInterest,
      dirtyPrice,
      netSettlementAmount: netSettlement,
      ytm: calculatedYTM,
    });
  }, [accruedInterest, dirtyPrice, netSettlement, calculatedYTM, setFormValues]);

  // Update settlement date when trade date or convention changes
  useEffect(() => {
    if (values.tradeDate && values.settlementConvention) {
      const days = getSettlementDays(values.settlementConvention);
      const newSettlementDate = addBusinessDays(values.tradeDate, days);
      setFormValue('settlementDate', newSettlementDate);
    }
  }, [values.tradeDate, values.settlementConvention, setFormValue]);

  // Handle bond selection from autocomplete
  const handleBondSelect = useCallback((bond: BondInstrument) => {
    const bondDetails: BondInstrumentDetails = {
      issuer: bond.issuer,
      couponRate: bond.couponRate,
      couponFrequency: bond.couponFrequency,
      maturityDate: new Date(bond.maturityDate),
      dayCountConvention: bond.dayCountConvention,
      issueDate: new Date(bond.issueDate),
      firstCouponDate: bond.firstCouponDate ? new Date(bond.firstCouponDate) : undefined,
      creditRating: bond.creditRating,
      outstandingAmount: bond.outstandingAmount,
      callable: bond.callable,
      minimumLotSize: bond.minimumLotSize,
    };

    // Set settlement convention based on bond type
    const convention = bond.bondType === 'TREASURY' ? 'T+1' : 'T+2';

    setFormValues({
      bondIdentifier: bond.isin,
      bondName: bond.description,
      currency: bond.currency,
      bondDetails,
      settlementConvention: convention,
    });
  }, [setFormValues]);

  // Handle quote update
  const handleQuoteUpdate = useCallback((quoteData: BondQuoteData) => {
    setQuote(quoteData);
    // Auto-fill clean price with last price if not set
    if (values.cleanPrice === null) {
      setFormValue('cleanPrice', quoteData.lastPrice);
    }
  }, [values.cleanPrice, setFormValue]);

  // Handle direction change
  const handleDirectionChange = useCallback((direction: BondDirection) => {
    setFormValue('direction', direction);
  }, [setFormValue]);

  // Count errors per tab
  const tabErrors = useMemo(() => {
    const counts: Record<BondTabId, number> = {
      'bond-id': 0,
      'transaction': 0,
      'pricing': 0,
      'parties': 0,
      'settlement': 0,
    };

    const bondIdFields = ['bondIdentifier', 'bondName', 'currency'];
    const transactionFields = ['direction', 'faceValue', 'executionVenue', 'capacity'];
    const pricingFields = ['cleanPrice', 'accruedInterest', 'ytm'];
    const partiesFields = ['fundAccountId', 'counterparty', 'traderId'];
    const settlementFields = ['tradeDate', 'settlementDate', 'settlementConvention', 'commissionFees', 'notes'];

    Object.keys(errors).forEach((field) => {
      if (bondIdFields.includes(field)) counts['bond-id']++;
      else if (transactionFields.includes(field)) counts['transaction']++;
      else if (pricingFields.includes(field)) counts['pricing']++;
      else if (partiesFields.includes(field)) counts['parties']++;
      else if (settlementFields.includes(field)) counts['settlement']++;
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

    // Price deviation warning
    if (quote && values.cleanPrice) {
      const midPrice = (quote.bid + quote.ask) / 2;
      const deviation = Math.abs(values.cleanPrice - midPrice) / midPrice;
      if (deviation > 0.02) {
        warnings.push({
          field: 'cleanPrice',
          message: `Price is ${(deviation * 100).toFixed(2)}% away from mid-market`,
        });
      }
    }

    // Large trade warning
    if (values.faceValue && values.faceValue > 5000000) {
      warnings.push({
        field: 'faceValue',
        message: 'Large order: consider splitting or checking market depth',
      });
    }

    return warnings;
  }, [quote, values.cleanPrice, values.faceValue]);

  // Submit handler
  const handleSubmit = useCallback(async (): Promise<boolean> => {
    const isFormValid = validate();
    if (!isFormValid) {
      return false;
    }

    // Here you would typically make an API call
    console.log('Submitting bond trade:', values);

    return true;
  }, [validate, values]);

  // Reset handler
  const reset = useCallback(() => {
    resetForm();
    setQuote(null);
    setActiveTab('bond-id');
  }, [resetForm]);

  // Custom setValue that handles type conversion
  const setValue = useCallback(<K extends keyof BondTradeFormState>(
    field: K,
    value: BondTradeFormState[K]
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
    principalValue,
    accruedInterest,
    dirtyValue,
    netSettlement,
    accruedCalc,

    // Actions
    validate,
    reset,
    handleBondSelect,
    handleQuoteUpdate,
    handleDirectionChange,
    handleSubmit,

    // Validation state
    validationErrors,
    validationWarnings,
  };
}
