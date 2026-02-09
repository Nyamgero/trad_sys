// ============================================
// features/trading/positions/equity/types.ts
// ============================================

import { Currency, Exchange, MoneyValue, PriceChange, Timestamp } from '@/types/common';

export interface EquityPosition {
  id: string;
  ticker: string;
  name: string;
  exchange: Exchange;
  currency: Currency;
  quantity: number;
  avgCost: number;
  lastPrice: number;
  bid: number;
  ask: number;
  spreadPercent: number;
  marketValue: MoneyValue;
  marketValueBase: MoneyValue;
  costBasis: MoneyValue;
  dayChange: PriceChange;
  updatedAt: Timestamp;
}

export interface EquityPositionExpanded extends EquityPosition {
  // Company info
  sector: string;
  industry: string;
  marketCap: number;

  // Fundamentals
  peRatio: number | null;
  dividendYield: number | null;
  beta: number;

  // Volume & liquidity
  volume: number;
  avgVolume20d: number;
  volumePercent: number;

  // Extended P&L
  unrealizedPnL: MoneyValue;
  unrealizedPnLPercent: number;
  realizedPnLYtd: MoneyValue;
  totalPnL: MoneyValue;
  dayPnL: MoneyValue;

  // Optional analytics
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  movingAvg50?: number;
  movingAvg200?: number;
}

export interface EquityPortfolioSummary {
  totalPositions: number;
  totalMarketValue: MoneyValue;
  totalCostBasis: MoneyValue;
  totalUnrealizedPnL: MoneyValue;
  totalUnrealizedPnLPercent: number;
  totalRealizedPnLYtd: MoneyValue;
  dayPnL: MoneyValue;
  dayPnLPercent: number;
  mtdPnL: MoneyValue;
  mtdPnLPercent: number;
  ytdPnL: MoneyValue;
  ytdPnLPercent: number;
}

export interface EquityTransaction {
  id: string;
  ticker: string;
  date: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  commission: number;
  total: number;
  notes?: string;
}
