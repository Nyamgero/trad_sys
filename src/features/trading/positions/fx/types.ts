// ============================================
// features/trading/positions/fx/types.ts
// ============================================

import { Currency, MoneyValue, Timestamp } from '@/types/common';

export type FXDirection = 'long' | 'short';

export interface FXPosition {
  id: string;
  ccyPair: string;
  baseCurrency: Currency;
  termCurrency: Currency;
  direction: FXDirection;
  notionalBase: number;
  notionalTerm: number;
  avgRate: number;
  spotRate: number;
  bid: number;
  ask: number;
  spreadPips: number;
  mtmValue: MoneyValue;
  dayChangePips: number;
  dayChangePercent: number;
  updatedAt: Timestamp;
}

export interface FXPositionExpanded extends FXPosition {
  // Forward points
  forwardPoints: number;
  forwardRate: number;
  forwardDays: number;
  valueDate: string;

  // P&L breakdown
  spotPnL: MoneyValue;
  forwardPointsPnL: MoneyValue;
  realizedPnL: MoneyValue;
  unrealizedPnL: MoneyValue;
  totalPnL: MoneyValue;
  dayPnL: MoneyValue;

  // Hedging
  hedgeRatio: number;
  underlyingExposure: MoneyValue;

  // Market data
  dailyVolume: number;
  positionPctVolume: number;
  timeToExecute: string;
  marketHours: 'active' | 'limited' | 'closed';

  // Risk metrics
  volatility: number;
  correlationToPortfolio: number;

  // Rate history
  rate24hHigh: number;
  rate24hLow: number;
  rateWtdChange: number;
  rateMtdChange: number;
}

export interface FXExposureSummary {
  currency: Currency;
  netExposure: number;
  mtmPnL: number;
  hedgedPercent: number;
}

export interface FXPortfolioSummary {
  totalPositions: number;
  grossExposure: number;
  netExposure: number;
  spotPnL: number;
  forwardPointsPnL: number;
  dayPnL: number;
  dayPnLPercent: number;
  mtdPnL: number;
  mtdPnLPercent: number;
  ytdPnL: number;
  ytdPnLPercent: number;
  currencyExposures: {
    currency: string;
    netExposure: number;
    pnl: number;
  }[];
}
