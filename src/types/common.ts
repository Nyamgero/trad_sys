// ============================================
// types/common.ts - Shared types
// ============================================

export type Currency = 'USD' | 'ZAR' | 'GBP' | 'EUR' | 'KES' | string;

export type Exchange = 'NYSE' | 'NASDAQ' | 'JSE' | 'LSE' | 'EPA' | string;

export type PnLDirection = 'positive' | 'negative' | 'neutral';

export interface MoneyValue {
  amount: number;
  currency: Currency;
}

export interface PriceChange {
  absolute: number;
  percent: number;
  direction: PnLDirection;
}

export interface Timestamp {
  iso: string;        // ISO 8601 format
  unix: number;       // Unix timestamp ms
  display: string;    // Formatted for display "14:32:15"
}
