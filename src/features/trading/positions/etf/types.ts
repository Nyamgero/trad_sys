// ============================================
// features/trading/positions/etf/types.ts
// ============================================

import { Currency, Exchange, MoneyValue, PriceChange, Timestamp } from '@/types/common';

export interface ETFPosition {
  id: string;
  ticker: string;
  name: string;
  exchange: Exchange;
  currency: Currency;
  units: number;
  avgCost: number;
  lastPrice: number;
  nav: number;
  premiumDiscount: number;
  bid: number;
  ask: number;
  spreadPercent: number;
  marketValue: MoneyValue;
  marketValueBase: MoneyValue;
  costBasis: MoneyValue;
  dayChange: PriceChange;
  updatedAt: Timestamp;
}

export interface ETFPositionExpanded extends ETFPosition {
  // Fund info
  issuer: string;
  inceptionDate: string;
  benchmark: string;
  category: string;

  // Fund metrics
  aum: number;
  expenseRatio: number;
  trackingError: number;
  trackingDifference: number;

  // Holdings
  holdingsCount: number;
  topHoldings: ETFHolding[];
  sectorBreakdown: SectorAllocation[];

  // Liquidity
  volume: number;
  avgVolume20d: number;

  // P&L
  unrealizedPnL: MoneyValue;
  unrealizedPnLPercent: number;
  realizedPnLYtd: MoneyValue;
  totalPnL: MoneyValue;
  dayPnL: MoneyValue;

  // Distribution
  distributionYield: number;
  lastDistribution: number;
  distributionFrequency: string;
}

export interface ETFHolding {
  ticker: string;
  name: string;
  weight: number;
  sector?: string;
}

export interface SectorAllocation {
  sector: string;
  weight: number;
}

export interface ETFPortfolioSummary {
  totalPositions: number;
  totalMarketValue: number;
  totalNav: number;
  weightedPremiumDiscount: number;
  weightedExpenseRatio: number;
  dayPnL: number;
  dayPnLPercent: number;
  mtdPnL: number;
  mtdPnLPercent: number;
  ytdPnL: number;
  ytdPnLPercent: number;
}

export type ETFAlertType = 'premium' | 'spread' | 'aum' | 'tracking';

export interface ETFAlert {
  type: ETFAlertType;
  severity: 'warning' | 'critical';
  message: string;
}
