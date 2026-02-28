// ============================================
// NewEquityTradeWindow/useNewEquityTrade.ts - Form State & Calculations Hook
// ============================================

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useFormValidation } from '@/hooks/useFormValidation';
import { newEquityTradeSchema } from './schema';
import type {
  TradeFormState,
  TradeSide,
  TabId,
  ValidationError,
  ValidationWarning,
  Security,
  QuoteData,
  InitialStateOptions,
} from './types';

// STT tax rate for buys (0.25%)
const STT_RATE = 0.0025;

// Default commission rate (0.03%)
const DEFAULT_COMMISSION_RATE = 0.0003;

// Default other fees rate (0.01%)
const DEFAULT_OTHER_FEES_RATE = 0.0001;

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

// Get settlement days from cycle
function getSettlementDays(cycle: string): number {
  switch (cycle) {
    case 'T+0': return 0;
    case 'T+1': return 1;
    case 'T+2': return 2;
    case 'T+3': return 3;
    default: return 2;
  }
}

// Create initial state
export function createInitialTradeState(options: InitialStateOptions = {}): TradeFormState {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return {
    // Tab 1: Instrument
    tickerSymbol: '',
    isin: '',
    micCode: 'XJSE',
    currency: 'ZAR',
    securityName: undefined,

    // Tab 2: Trade Details
    tradeId: undefined,
    orderId: undefined,
    side: 'BUY',
    quantity: null,
    executionPrice: null,
    grossConsideration: 0,
    tradeDate: today,
    transactTimestamp: undefined,
    orderType: 'LIMIT',
    shortSellFlag: false,
    capacity: 'AGENCY',

    // Tab 3: Costs
    commission: null,
    sttTax: 0,
    otherFees: null,
    netConsideration: 0,
    fxRate: undefined,

    // Tab 4: Booking
    portfolioId: options.defaultPortfolio || '',
    traderId: options.currentUserId || 'trader-001',
    brokerId: '',
    clientId: undefined,
    bookImmediately: true,
    routeToCompliance: false,

    // Tab 5: Settlement
    settlementDate: addBusinessDays(today, 2),
    settlementCycle: 'T+2',
    custodian: undefined,
    settlementStatus: 'PENDING',
    tradeStatus: 'NEW',
    notes: undefined,
  };
}

export interface UseNewEquityTradeReturn {
  // Form state
  values: Partial<TradeFormState>;
  errors: Partial<Record<keyof TradeFormState, { message: string }>>;
  touched: Partial<Record<keyof TradeFormState, boolean>>;
  isValid: boolean;
  isDirty: boolean;

  // Tab state
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  tabErrors: Record<TabId, number>;

  // Field handlers
  setValue: <K extends keyof TradeFormState>(field: K, value: TradeFormState[K]) => void;
  setValues: (values: Partial<TradeFormState>) => void;
  setTouched: (field: keyof TradeFormState) => void;
  validateField: (field: keyof TradeFormState) => void;

  // Calculations
  grossConsideration: number;
  sttTax: number;
  netConsideration: number;
  totalCosts: number;
  costPercentage: number;

  // Actions
  validate: () => boolean;
  reset: () => void;
  handleSecuritySelect: (security: Security) => void;
  handleQuoteUpdate: (quote: QuoteData) => void;
  handleSideChange: (side: TradeSide) => void;
  handleSubmit: () => Promise<boolean>;

  // Validation state
  validationErrors: ValidationError[];
  validationWarnings: ValidationWarning[];
}

export function useNewEquityTrade(
  options: InitialStateOptions = {}
): UseNewEquityTradeReturn {
  const initialValues = useMemo(() => createInitialTradeState(options), [options]);

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
    schema: newEquityTradeSchema,
    initialValues,
  });

  const [activeTab, setActiveTab] = useState<TabId>('instrument');
  const [quote, setQuote] = useState<QuoteData | null>(null);

  // Calculate gross consideration
  const grossConsideration = useMemo(() => {
    const qty = values.quantity ?? 0;
    const price = values.executionPrice ?? 0;
    return qty * price;
  }, [values.quantity, values.executionPrice]);

  // Calculate STT tax (0.25% on buys only)
  const sttTax = useMemo(() => {
    const side = values.side;
    if (side === 'BUY' || side === 'BUY_TO_COVER') {
      return grossConsideration * STT_RATE;
    }
    return 0;
  }, [grossConsideration, values.side]);

  // Calculate commission (use entered value or default to 0.03%)
  const commission = useMemo(() => {
    if (values.commission !== null && values.commission !== undefined) {
      return values.commission;
    }
    return grossConsideration * DEFAULT_COMMISSION_RATE;
  }, [values.commission, grossConsideration]);

  // Calculate other fees (use entered value or default to 0.01%)
  const otherFees = useMemo(() => {
    if (values.otherFees !== null && values.otherFees !== undefined) {
      return values.otherFees;
    }
    return grossConsideration * DEFAULT_OTHER_FEES_RATE;
  }, [values.otherFees, grossConsideration]);

  // Calculate total costs
  const totalCosts = useMemo(() => {
    return commission + sttTax + otherFees;
  }, [commission, sttTax, otherFees]);

  // Calculate cost percentage
  const costPercentage = useMemo(() => {
    if (grossConsideration === 0) return 0;
    return (totalCosts / grossConsideration) * 100;
  }, [totalCosts, grossConsideration]);

  // Calculate net consideration
  const netConsideration = useMemo(() => {
    const side = values.side;
    if (side === 'BUY' || side === 'BUY_TO_COVER') {
      return grossConsideration + totalCosts;
    } else {
      return grossConsideration - totalCosts;
    }
  }, [grossConsideration, totalCosts, values.side]);

  // Update calculated values in form state
  useEffect(() => {
    setFormValues({
      grossConsideration,
      sttTax,
      netConsideration,
    });
  }, [grossConsideration, sttTax, netConsideration, setFormValues]);

  // Update settlement date when trade date or cycle changes
  useEffect(() => {
    if (values.tradeDate && values.settlementCycle) {
      const days = getSettlementDays(values.settlementCycle);
      const newSettlementDate = addBusinessDays(values.tradeDate, days);
      setFormValue('settlementDate', newSettlementDate);
    }
  }, [values.tradeDate, values.settlementCycle, setFormValue]);

  // Handle security selection from autocomplete
  const handleSecuritySelect = useCallback((security: Security) => {
    setFormValues({
      tickerSymbol: security.ticker,
      isin: security.isin,
      micCode: security.primaryExchange,
      currency: security.tradingCurrency,
      securityName: security.name,
    });
  }, [setFormValues]);

  // Handle quote update
  const handleQuoteUpdate = useCallback((quoteData: QuoteData) => {
    setQuote(quoteData);
    // Optionally auto-fill execution price with last price
    if (values.executionPrice === null) {
      setFormValue('executionPrice', quoteData.last);
    }
  }, [values.executionPrice, setFormValue]);

  // Handle side change with short sell flag sync
  const handleSideChange = useCallback((side: TradeSide) => {
    setFormValues({
      side,
      shortSellFlag: side === 'SHORT_SELL',
    });
  }, [setFormValues]);

  // Count errors per tab
  const tabErrors = useMemo(() => {
    const counts: Record<TabId, number> = {
      'instrument': 0,
      'trade-details': 0,
      'costs': 0,
      'booking': 0,
      'settlement': 0,
    };

    const instrumentFields = ['tickerSymbol', 'isin', 'micCode', 'currency'];
    const tradeFields = ['side', 'quantity', 'executionPrice', 'tradeDate', 'capacity', 'orderType'];
    const costsFields = ['commission', 'otherFees', 'fxRate'];
    const bookingFields = ['portfolioId', 'traderId', 'brokerId'];
    const settlementFields = ['settlementDate', 'settlementCycle', 'notes'];

    Object.keys(errors).forEach((field) => {
      if (instrumentFields.includes(field)) counts['instrument']++;
      else if (tradeFields.includes(field)) counts['trade-details']++;
      else if (costsFields.includes(field)) counts['costs']++;
      else if (bookingFields.includes(field)) counts['booking']++;
      else if (settlementFields.includes(field)) counts['settlement']++;
    });

    return counts;
  }, [errors]);

  // Generate validation errors/warnings list
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
    if (quote && values.executionPrice) {
      const deviation = Math.abs(values.executionPrice - quote.last) / quote.last;
      if (deviation > 0.05) {
        warnings.push({
          field: 'executionPrice',
          message: `Price is ${(deviation * 100).toFixed(1)}% away from last traded price`,
        });
      }
    }

    // Large order warning (placeholder - would need ADV data)
    if (values.quantity && values.quantity > 100000) {
      warnings.push({
        field: 'quantity',
        message: 'Large order: consider order splitting',
      });
    }

    return warnings;
  }, [quote, values.executionPrice, values.quantity]);

  // Submit handler
  const handleSubmit = useCallback(async (): Promise<boolean> => {
    const isFormValid = validate();
    if (!isFormValid) {
      return false;
    }

    // Here you would typically make an API call
    console.log('Submitting trade:', values);

    return true;
  }, [validate, values]);

  // Reset handler
  const reset = useCallback(() => {
    resetForm();
    setQuote(null);
    setActiveTab('instrument');
  }, [resetForm]);

  // Custom setValue that handles type conversion
  const setValue = useCallback(<K extends keyof TradeFormState>(
    field: K,
    value: TradeFormState[K]
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
    grossConsideration,
    sttTax,
    netConsideration,
    totalCosts,
    costPercentage,

    // Actions
    validate,
    reset,
    handleSecuritySelect,
    handleQuoteUpdate,
    handleSideChange,
    handleSubmit,

    // Validation state
    validationErrors,
    validationWarnings,
  };
}
