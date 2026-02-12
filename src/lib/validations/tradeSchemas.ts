// ============================================
// lib/validations/tradeSchemas.ts - Zod Validation Schemas
// ============================================

import { z } from 'zod';

// Common schemas
const sideSchema = z.enum(['buy', 'sell']);

const orderTypeSchema = z.enum(['market', 'limit', 'stop', 'stop-limit']);

const timeInForceSchema = z.enum(['day', 'gtc', 'ioc', 'fok']);

const positiveNumber = z.number().positive('Must be greater than 0');

const optionalPositiveNumber = z.number().positive('Must be greater than 0').optional();

const accountSchema = z.string().min(1, 'Account is required');

const dateSchema = z.string().min(1, 'Date is required').regex(
  /^\d{4}-\d{2}-\d{2}$/,
  'Invalid date format (YYYY-MM-DD)'
);

// Equity Trade Schema
export const equityTradeSchema = z.object({
  symbol: z.string()
    .min(1, 'Symbol is required')
    .max(10, 'Symbol too long')
    .regex(/^[A-Z0-9.]+$/i, 'Invalid symbol format'),
  side: sideSchema,
  quantity: positiveNumber.int('Quantity must be a whole number'),
  orderType: orderTypeSchema,
  price: optionalPositiveNumber,
  stopPrice: optionalPositiveNumber,
  timeInForce: timeInForceSchema,
  account: accountSchema,
}).refine(
  (data) => {
    if (data.orderType === 'limit' || data.orderType === 'stop-limit') {
      return data.price !== undefined && data.price > 0;
    }
    return true;
  },
  { message: 'Price is required for limit orders', path: ['price'] }
).refine(
  (data) => {
    if (data.orderType === 'stop' || data.orderType === 'stop-limit') {
      return data.stopPrice !== undefined && data.stopPrice > 0;
    }
    return true;
  },
  { message: 'Stop price is required for stop orders', path: ['stopPrice'] }
);

// FX Spot Trade Schema
export const fxSpotTradeSchema = z.object({
  currencyPair: z.string()
    .min(6, 'Currency pair is required')
    .max(7, 'Invalid currency pair')
    .regex(/^[A-Z]{6,7}$/i, 'Invalid currency pair format (e.g., EURUSD)'),
  side: sideSchema,
  quantity: positiveNumber,
  orderType: orderTypeSchema,
  rate: optionalPositiveNumber,
  timeInForce: timeInForceSchema,
  settlementDate: dateSchema,
  account: accountSchema,
}).refine(
  (data) => {
    if (data.orderType === 'limit') {
      return data.rate !== undefined && data.rate > 0;
    }
    return true;
  },
  { message: 'Rate is required for limit orders', path: ['rate'] }
);

// FX Forward Trade Schema
export const fxForwardTradeSchema = z.object({
  currencyPair: z.string()
    .min(6, 'Currency pair is required')
    .max(7, 'Invalid currency pair')
    .regex(/^[A-Z]{6,7}$/i, 'Invalid currency pair format'),
  side: sideSchema,
  quantity: positiveNumber,
  orderType: orderTypeSchema,
  forwardRate: optionalPositiveNumber,
  spotRate: optionalPositiveNumber,
  forwardPoints: z.number().optional(),
  timeInForce: timeInForceSchema,
  valueDate: dateSchema,
  account: accountSchema,
}).refine(
  (data) => {
    if (data.orderType === 'limit') {
      return data.forwardRate !== undefined && data.forwardRate > 0;
    }
    return true;
  },
  { message: 'Forward rate is required for limit orders', path: ['forwardRate'] }
);

// Bond Trade Schema
export const bondTradeSchema = z.object({
  isin: z.string()
    .min(12, 'ISIN must be 12 characters')
    .max(12, 'ISIN must be 12 characters')
    .regex(/^[A-Z]{2}[A-Z0-9]{10}$/, 'Invalid ISIN format'),
  cusip: z.string()
    .length(9, 'CUSIP must be 9 characters')
    .optional()
    .or(z.literal('')),
  side: sideSchema,
  quantity: positiveNumber,
  orderType: orderTypeSchema,
  price: optionalPositiveNumber,
  yield: z.number().min(0, 'Yield must be non-negative').max(100, 'Yield too high').optional(),
  timeInForce: timeInForceSchema,
  settlementDate: dateSchema,
  account: accountSchema,
});

// ETF Trade Schema
export const etfTradeSchema = z.object({
  symbol: z.string()
    .min(1, 'Symbol is required')
    .max(10, 'Symbol too long')
    .regex(/^[A-Z0-9.]+$/i, 'Invalid symbol format'),
  side: sideSchema,
  quantity: positiveNumber.int('Quantity must be a whole number'),
  orderType: orderTypeSchema,
  price: optionalPositiveNumber,
  nav: optionalPositiveNumber,
  timeInForce: timeInForceSchema,
  account: accountSchema,
}).refine(
  (data) => {
    if (data.orderType === 'limit' || data.orderType === 'stop-limit') {
      return data.price !== undefined && data.price > 0;
    }
    return true;
  },
  { message: 'Price is required for limit orders', path: ['price'] }
);

// Money Market Trade Schema
export const mmTradeSchema = z.object({
  instrument: z.enum(['repo', 'reverse-repo', 'cd', 'cp', 'tbill', 'ba']),
  principal: positiveNumber,
  rate: z.number()
    .min(0, 'Rate must be non-negative')
    .max(100, 'Rate cannot exceed 100%'),
  startDate: dateSchema,
  maturityDate: dateSchema,
  dayCount: z.enum(['act/360', 'act/365', '30/360']),
  account: accountSchema,
}).refine(
  (data) => {
    const start = new Date(data.startDate);
    const maturity = new Date(data.maturityDate);
    return maturity > start;
  },
  { message: 'Maturity date must be after start date', path: ['maturityDate'] }
);

// Type exports
export type EquityTradeFormData = z.infer<typeof equityTradeSchema>;
export type FXSpotTradeFormData = z.infer<typeof fxSpotTradeSchema>;
export type FXForwardTradeFormData = z.infer<typeof fxForwardTradeSchema>;
export type BondTradeFormData = z.infer<typeof bondTradeSchema>;
export type ETFTradeFormData = z.infer<typeof etfTradeSchema>;
export type MMTradeFormData = z.infer<typeof mmTradeSchema>;
