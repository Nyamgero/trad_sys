// ============================================
// features/trading/pnl/types.ts
// ============================================

import { Currency, MoneyValue, PnLDirection } from '@/types/common';

export interface PnLPeriod {
  value: number;
  percent: number;
  direction: PnLDirection;
}

export interface BasePnLPosition {
  id: string;
  dayPnL: MoneyValue;
  dayPnLPercent: number;
  mtdPnL: MoneyValue;
  mtdPnLPercent: number;
  ytdPnL: MoneyValue;
  ytdPnLPercent: number;
  unrealizedPnL: MoneyValue;
  realizedPnL: MoneyValue;
  totalPnL: MoneyValue;
}

// Equity P&L
export interface EquityPnLPosition extends BasePnLPosition {
  symbol: string;
  name: string;
  quantity: number;
  avgCost: number;
  lastPrice: number;
  costBasis: MoneyValue;
  marketValue: MoneyValue;
  unrealizedPercent: number;
}

export interface EquityPnLSummary {
  totalCostBasis: number;
  totalMarketValue: number;
  totalUnrealizedPnL: number;
  totalUnrealizedPercent: number;
  totalRealizedPnL: number;
  dayPnL: number;
  dayPnLPercent: number;
  mtdPnL: number;
  mtdPnLPercent: number;
  ytdPnL: number;
  ytdPnLPercent: number;
}

// ETF P&L
export interface ETFPnLPosition extends BasePnLPosition {
  symbol: string;
  name: string;
  units: number;
  avgCost: number;
  lastPrice: number;
  costBasis: MoneyValue;
  marketValue: MoneyValue;
  unrealizedPercent: number;
  trackingError?: number;
}

export interface ETFPnLSummary {
  totalCostBasis: number;
  totalMarketValue: number;
  totalUnrealizedPnL: number;
  totalUnrealizedPercent: number;
  totalRealizedPnL: number;
  dayPnL: number;
  dayPnLPercent: number;
  mtdPnL: number;
  mtdPnLPercent: number;
  ytdPnL: number;
  ytdPnLPercent: number;
}

// FX P&L
export interface FXPnLPosition extends BasePnLPosition {
  ccyPair: string;
  direction: 'long' | 'short';
  notional: number;
  avgRate: number;
  spotRate: number;
  ratePnLPips: number;
  spotPnL: MoneyValue;
  forwardPointsPnL: MoneyValue;
}

export interface FXPnLAttribution {
  spotPnL: number;
  forwardPointsPnL: number;
  totalPnL: number;
  spotPercent: number;
  forwardPercent: number;
}

export interface FXPnLSummary {
  totalSpotPnL: number;
  totalForwardPointsPnL: number;
  totalPnL: number;
  dayPnL: number;
  dayPnLPercent: number;
  mtdPnL: number;
  mtdPnLPercent: number;
  ytdPnL: number;
  ytdPnLPercent: number;
  attribution: FXPnLAttribution;
}

// Bond P&L
export interface BondPnLPosition extends BasePnLPosition {
  isin: string;
  name: string;
  faceValue: number;
  avgPrice: number;
  cleanPrice: number;
  pricePnL: MoneyValue;
  couponReceived: MoneyValue;
  accruedPnL: MoneyValue;
  rollPnL: MoneyValue;
  dayChangeBps: number;
}

export interface BondPnLAttribution {
  pricePnL: number;
  couponIncome: number;
  accruedPnL: number;
  rollCarryPnL: number;
  totalPnL: number;
  pricePercent: number;
  couponPercent: number;
  accruedPercent: number;
  rollPercent: number;
}

export interface BondPnLSummary {
  totalPricePnL: number;
  totalCouponIncome: number;
  totalAccruedPnL: number;
  totalRollCarryPnL: number;
  totalPnL: number;
  dayPnL: number;
  dayPnLBps: number;
  mtdPnL: number;
  mtdPnLPercent: number;
  ytdPnL: number;
  ytdPnLPercent: number;
  attribution: BondPnLAttribution;
}
