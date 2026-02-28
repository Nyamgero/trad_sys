// ============================================
// NewEquityTradeWindow/schema.ts - Zod Validation Schema
// ============================================

import { z } from 'zod';

// ISIN check digit validation (Luhn algorithm mod 10)
function validateISINCheckDigit(isin: string): boolean {
  if (isin.length !== 12) return false;

  // Convert letters to numbers (A=10, B=11, ..., Z=35)
  const digits = isin.split('').map(char => {
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      return (code - 55).toString();
    }
    return char;
  }).join('');

  // Luhn algorithm
  let sum = 0;
  let alternate = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    const char = digits[i];
    if (char === undefined) continue;
    let n = parseInt(char, 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }

  return sum % 10 === 0;
}

// Business day check (simple version - excludes weekends)
function isBusinessDay(date: Date): boolean {
  const day = date.getDay();
  return day !== 0 && day !== 6;
}

// Trade sides
const sideSchema = z.enum(['BUY', 'SELL', 'SHORT_SELL', 'BUY_TO_COVER']);

// Order types
const orderTypeSchema = z.enum(['MARKET', 'LIMIT', 'VWAP', 'BLOCK', 'STOP']);

// Capacity types
const capacitySchema = z.enum(['AGENCY', 'PRINCIPAL', 'RISKLESS_PRINCIPAL']);

// Settlement cycles
const settlementCycleSchema = z.enum(['T+0', 'T+1', 'T+2', 'T+3']);

// Status types
const settlementStatusSchema = z.enum(['PENDING', 'SETTLED', 'FAILED', 'CANCELLED']);
const tradeStatusSchema = z.enum(['NEW', 'EXECUTED', 'ALLOCATED', 'CONFIRMED', 'REJECTED', 'AMENDED']);

// Main trade form schema
export const newEquityTradeSchema = z.object({
  // Tab 1: Instrument Identification
  tickerSymbol: z.string()
    .min(1, 'Ticker symbol is required')
    .max(10, 'Ticker too long')
    .regex(/^[A-Z0-9.]+$/i, 'Invalid ticker format')
    .transform(val => val.toUpperCase()),

  isin: z.string()
    .min(1, 'ISIN is required')
    .length(12, 'ISIN must be 12 characters')
    .regex(/^[A-Z]{2}[A-Z0-9]{9}[0-9]$/, 'Invalid ISIN format')
    .refine(validateISINCheckDigit, 'Invalid ISIN check digit'),

  micCode: z.string()
    .min(1, 'Exchange is required')
    .length(4, 'MIC code must be 4 characters')
    .regex(/^[A-Z]{4}$/, 'Invalid MIC code format'),

  currency: z.string()
    .min(1, 'Currency is required')
    .length(3, 'Currency must be 3 characters')
    .regex(/^[A-Z]{3}$/, 'Invalid currency code'),

  securityName: z.string().optional(),

  // Tab 2: Trade Details
  tradeId: z.string().optional(),
  orderId: z.string().optional(),

  side: sideSchema,

  quantity: z.number()
    .positive('Quantity must be greater than 0')
    .int('Quantity must be a whole number')
    .nullable()
    .refine(val => val !== null, 'Quantity is required'),

  executionPrice: z.number()
    .positive('Price must be greater than 0')
    .nullable()
    .refine(val => val !== null, 'Execution price is required'),

  grossConsideration: z.number().min(0),

  tradeDate: z.date()
    .refine(date => {
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return date <= today;
    }, 'Trade date cannot be in the future')
    .refine(isBusinessDay, 'Trade date must be a business day'),

  transactTimestamp: z.date().optional(),

  orderType: orderTypeSchema,

  shortSellFlag: z.boolean(),

  capacity: capacitySchema,

  // Tab 3: Costs & Financials
  commission: z.number().min(0, 'Commission cannot be negative').nullable(),
  sttTax: z.number().min(0),
  otherFees: z.number().min(0, 'Fees cannot be negative').nullable(),
  netConsideration: z.number().min(0),
  fxRate: z.number().positive('FX rate must be positive').optional(),

  // Tab 4: Booking
  portfolioId: z.string().min(1, 'Portfolio is required'),
  traderId: z.string().min(1, 'Trader is required'),
  brokerId: z.string().min(1, 'Broker is required'),
  clientId: z.string().optional(),
  bookImmediately: z.boolean(),
  routeToCompliance: z.boolean(),

  // Tab 5: Settlement
  settlementDate: z.date()
    .refine(isBusinessDay, 'Settlement date must be a business day'),

  settlementCycle: settlementCycleSchema,
  custodian: z.string().optional(),
  settlementStatus: settlementStatusSchema,
  tradeStatus: tradeStatusSchema,
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
}).refine(
  (data) => {
    // Short sell flag must be true when side is SHORT_SELL
    if (data.side === 'SHORT_SELL') {
      return data.shortSellFlag === true;
    }
    return true;
  },
  { message: 'Short sell flag must be checked for short sell orders', path: ['shortSellFlag'] }
).refine(
  (data) => {
    // Settlement date must be on or after trade date
    return data.settlementDate >= data.tradeDate;
  },
  { message: 'Settlement date must be on or after trade date', path: ['settlementDate'] }
);

// Type inference
export type NewEquityTradeFormData = z.infer<typeof newEquityTradeSchema>;

// Partial schema for tab-by-tab validation
export const instrumentTabSchema = z.object({
  tickerSymbol: z.string().min(1, 'Ticker symbol is required'),
  isin: z.string().min(1, 'ISIN is required'),
  micCode: z.string().min(1, 'Exchange is required'),
  currency: z.string().min(1, 'Currency is required'),
});

export const tradeDetailsTabSchema = z.object({
  side: sideSchema,
  quantity: z.number().positive().int().nullable().refine(val => val !== null, 'Quantity is required'),
  executionPrice: z.number().positive().nullable().refine(val => val !== null, 'Price is required'),
  tradeDate: z.date(),
  capacity: capacitySchema,
});

export const costsTabSchema = z.object({
  commission: z.number().min(0).nullable(),
  otherFees: z.number().min(0).nullable(),
});

export const bookingTabSchema = z.object({
  portfolioId: z.string().min(1, 'Portfolio is required'),
  traderId: z.string().min(1, 'Trader is required'),
  brokerId: z.string().min(1, 'Broker is required'),
});

export const settlementTabSchema = z.object({
  settlementDate: z.date(),
  settlementCycle: settlementCycleSchema,
});
