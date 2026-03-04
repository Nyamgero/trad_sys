// ============================================
// NewMMTradeWindow/schema.ts - Zod Validation Schema
// ============================================

import { z } from 'zod';

// Schema definition
export const newMMTradeSchema = z.object({
  // Tab 1: Deposit Details
  tradeReference: z.string().optional(),
  direction: z.enum(['PLACEMENT', 'BORROWING']),
  depositType: z.enum(['CALL', 'NOTICE', 'FIXED', 'TERM']),
  principalAmount: z
    .number()
    .nullable()
    .refine((val) => val === null || val >= 1000000, {
      message: 'Principal must be at least 1,000,000',
    }),
  currency: z.string().min(3, 'Currency is required').max(3),
  tradeDate: z.date(),
  valueDate: z.date(),
  tenor: z.enum(['O/N', '1W', '2W', '1M', '2M', '3M', '6M', '9M', '12M', 'CUSTOM']),
  maturityDate: z.date().nullable(),
  days: z.number().min(0),
  noticePeriod: z.number().optional(),

  // Tab 2: Pricing & Interest
  rateType: z.enum(['FIXED', 'FLOATING']),
  interestRate: z
    .number()
    .nullable()
    .refine((val) => val === null || (val >= 0 && val <= 25), {
      message: 'Interest rate must be between 0% and 25%',
    }),
  dayCountConvention: z.enum(['ACT/365', 'ACT/360', '30/360']),
  referenceRate: z.string().optional(),
  currentReference: z.number().optional(),
  spreadBps: z.number().optional(),
  allInRate: z.number().optional(),
  interestFrequency: z.enum(['MONTHLY', 'QUARTERLY', 'SEMI_ANNUAL', 'AT_MATURITY']),
  compounding: z.enum(['SIMPLE', 'COMPOUND']),
  interestAmount: z.number(),
  maturityProceeds: z.number(),
  autoRollover: z.boolean(),
  rolloverTenor: z.string().optional(),
  capitalizeInterest: z.boolean(),

  // Tab 3: Counterparty & Account
  fundId: z.string().min(1, 'Fund is required'),
  counterpartyBank: z.string().min(1, 'Bank counterparty is required'),
  dealerBroker: z.string(),
  traderId: z.string().min(1, 'Trader is required'),
  confirmationMethod: z.enum(['SWIFT_MT320', 'EMAIL', 'FAX']),
  bankContact: z.string().optional(),

  // Tab 4: Settlement
  settlementType: z.enum(['SAME_DAY', 'NEXT_DAY']),
  fundingAccount: z.string().min(1, 'Funding account is required'),
  bankSwift: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  paymentReference: z.string(),
  specialInstructions: z.string().max(500, 'Instructions must be under 500 characters').optional(),

  // Tab 5: Status & Notes
  tradeStatus: z.enum(['DRAFT', 'PENDING', 'CONFIRMED', 'ACTIVE', 'MATURED', 'CANCELLED']),
  notes: z.string().max(1000, 'Notes must be under 1000 characters').optional(),
  internalReference: z.string().optional(),
  externalReference: z.string().optional(),
}).refine(
  (data) => {
    // Value date must be on or after trade date
    return data.valueDate >= data.tradeDate;
  },
  {
    message: 'Value date must be on or after trade date',
    path: ['valueDate'],
  }
).refine(
  (data) => {
    // Maturity date must be after value date for FIXED and TERM types
    if (['FIXED', 'TERM'].includes(data.depositType) && data.maturityDate) {
      return data.maturityDate > data.valueDate;
    }
    return true;
  },
  {
    message: 'Maturity date must be after value date',
    path: ['maturityDate'],
  }
).refine(
  (data) => {
    // Interest rate required for fixed rate type
    if (data.rateType === 'FIXED') {
      return data.interestRate !== null && data.interestRate > 0;
    }
    return true;
  },
  {
    message: 'Interest rate is required for fixed rate deposits',
    path: ['interestRate'],
  }
).refine(
  (data) => {
    // Reference rate required for floating rate type
    if (data.rateType === 'FLOATING') {
      return data.referenceRate !== undefined && data.referenceRate.length > 0;
    }
    return true;
  },
  {
    message: 'Reference rate is required for floating rate deposits',
    path: ['referenceRate'],
  }
);

export type NewMMTradeInput = z.infer<typeof newMMTradeSchema>;
