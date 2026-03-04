// ============================================
// NewBondTradeWindow/schema.ts - Zod Validation Schema
// ============================================

import { z } from 'zod';

// ISIN check digit validation
function validateISINCheckDigit(isin: string): boolean {
  if (isin.length !== 12) return false;

  // Convert letters to numbers (A=10, B=11, etc.)
  let digits = '';
  for (let i = 0; i < isin.length; i++) {
    const char = isin[i];
    if (char === undefined) continue;
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      // A-Z
      digits += (code - 55).toString();
    } else {
      digits += char;
    }
  }

  // Luhn algorithm
  let sum = 0;
  for (let i = digits.length - 1; i >= 0; i--) {
    const char = digits[i];
    if (char === undefined) continue;
    let digit = parseInt(char, 10);
    if ((digits.length - i) % 2 === 0) {
      digit *= 2;
      if (digit > 9) {
        digit = Math.floor(digit / 10) + (digit % 10);
      }
    }
    sum += digit;
  }

  return sum % 10 === 0;
}

// CUSIP validation (basic format check)
function validateCUSIP(cusip: string): boolean {
  if (cusip.length !== 9) return false;
  // CUSIP format: 6 alphanumeric + 2 alphanumeric + 1 check digit
  const pattern = /^[A-Z0-9]{9}$/;
  return pattern.test(cusip.toUpperCase());
}

// Validate bond identifier (ISIN or CUSIP)
function validateBondIdentifier(value: string): boolean {
  const cleanValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (cleanValue.length === 12) {
    return validateISINCheckDigit(cleanValue);
  } else if (cleanValue.length === 9) {
    return validateCUSIP(cleanValue);
  }
  return false;
}

// Schema definition
export const newBondTradeSchema = z.object({
  // Tab 1: Bond Identification
  tradeReference: z.string().optional(),
  bondIdentifier: z
    .string()
    .min(9, 'Bond identifier must be ISIN (12 chars) or CUSIP (9 chars)')
    .max(12, 'Bond identifier must be ISIN (12 chars) or CUSIP (9 chars)')
    .refine(validateBondIdentifier, {
      message: 'Invalid ISIN/CUSIP format or check digit',
    }),
  bondName: z.string().min(1, 'Bond name is required').max(255),
  currency: z.string().min(3, 'Currency is required').max(3),

  // Tab 2: Transaction Details
  direction: z.enum(['BUY', 'SELL']),
  faceValue: z
    .number()
    .nullable()
    .refine((val) => val === null || val >= 1000, {
      message: 'Face value must be at least $1,000',
    })
    .refine((val) => val === null || val % 1000 === 0, {
      message: 'Face value must be in increments of $1,000',
    }),
  executionVenue: z.string().min(1, 'Execution venue is required'),
  capacity: z.enum(['PRINCIPAL', 'AGENCY']),
  specialConditions: z.array(z.enum(['PORTFOLIO_TRADE', 'WHEN_ISSUED', 'ODD_LOT', 'BLOCK'])),

  // Tab 3: Pricing & Yield
  cleanPrice: z
    .number()
    .nullable()
    .refine((val) => val === null || (val > 0 && val < 200), {
      message: 'Clean price must be between 0.01 and 200 (% of par)',
    }),
  accruedInterest: z.number().min(0, 'Accrued interest cannot be negative'),
  dirtyPrice: z.number(),
  ytm: z
    .number()
    .nullable()
    .refine((val) => val === null || (val >= -5 && val <= 50), {
      message: 'YTM must be within reasonable range (-5% to 50%)',
    }),
  yieldToWorst: z.number().optional(),
  currentMarketYield: z.number().optional(),

  // Tab 4: Parties & Accounts
  fundAccountId: z.string().min(1, 'Fund is required'),
  counterparty: z.string().min(1, 'Counterparty is required'),
  traderId: z.string().min(1, 'Trader is required'),

  // Tab 5: Settlement & Costs
  tradeDate: z.date(),
  tradeTime: z.string().optional(),
  settlementDate: z.date(),
  settlementConvention: z.enum(['T+0', 'T+1', 'T+2', 'T+3']),
  valueDate: z.date().optional(),
  commissionFees: z.number().nullable().refine((val) => val === null || val >= 0, {
    message: 'Commission must be non-negative',
  }),
  taxesWithholding: z.number().nullable().refine((val) => val === null || val >= 0, {
    message: 'Taxes must be non-negative',
  }),
  netSettlementAmount: z.number(),
  fxRate: z.number().positive().optional(),
  tradeStatus: z.enum(['pending', 'confirmed', 'settled', 'cancelled']),
  notes: z.string().max(1000, 'Notes must be under 1000 characters').optional(),
}).refine(
  (data) => {
    // Settlement date must be on or after trade date
    return data.settlementDate >= data.tradeDate;
  },
  {
    message: 'Settlement date must be on or after trade date',
    path: ['settlementDate'],
  }
);

export type NewBondTradeInput = z.infer<typeof newBondTradeSchema>;
