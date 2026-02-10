// ============================================
// features/trading/liquidity/types.ts
// ============================================

import { Currency, MoneyValue } from '@/types/common';

export type LiquidityScore = 1 | 2 | 3 | 4 | 5;

export type LiquidityAlertSeverity = 'high' | 'medium' | 'low';

export interface BaseLiquidityPosition {
  id: string;
  marketValue: MoneyValue;
  liquidityScore: LiquidityScore;
  positionPctVolume: number;
  daysToLiquidate: number;
  bidAskSpreadBps: number;
  spreadCost: number;
}

// Equity Liquidity
export interface EquityLiquidityPosition extends BaseLiquidityPosition {
  symbol: string;
  name: string;
  quantity: number;
  adv20d: number;
  advValue: number;
}

// ETF Liquidity
export interface ETFLiquidityPosition extends BaseLiquidityPosition {
  symbol: string;
  name: string;
  units: number;
  adv20d: number;
  advValue: number;
  premiumDiscount: number;
  aum: number;
}

// FX Liquidity
export interface FXLiquidityPosition extends BaseLiquidityPosition {
  ccyPair: string;
  notional: number;
  dailyVolumeEst: number;
  spreadPips: number;
  timeToExecute: string;
  marketHours: 'active' | 'limited' | 'closed';
}

// Bond Liquidity
export interface BondLiquidityPosition extends BaseLiquidityPosition {
  isin: string;
  name: string;
  faceValue: number;
  estDailyVolume: number;
  dealerCount: number;
  lastTradeDate: string;
  daysSinceLastTrade: number;
}

// Liquidity Alerts
export interface LiquidityAlert {
  id: string;
  severity: LiquidityAlertSeverity;
  type: 'position_size' | 'spread' | 'stale_price' | 'low_aum' | 'premium_discount';
  message: string;
  positionId: string;
  assetClass: 'equity' | 'etf' | 'fx' | 'bond';
  symbol: string;
  threshold: number;
  currentValue: number;
  timestamp: string;
}

// Summary
export interface LiquiditySummary {
  totalPositions: number;
  avgLiquidityScore: number;
  highRiskPositions: number;
  mediumRiskPositions: number;
  lowRiskPositions: number;
  totalSpreadCost: number;
  avgDaysToLiquidate: number;
  alerts: LiquidityAlert[];
}

export interface EquityLiquiditySummary extends LiquiditySummary {
  totalMarketValue: number;
  avgPositionPctAdv: number;
}

export interface ETFLiquiditySummary extends LiquiditySummary {
  totalMarketValue: number;
  avgPremiumDiscount: number;
  lowAumCount: number;
}

export interface FXLiquiditySummary extends LiquiditySummary {
  totalNotional: number;
  g10PairCount: number;
  emPairCount: number;
  exoticPairCount: number;
}

export interface BondLiquiditySummary extends LiquiditySummary {
  totalFaceValue: number;
  stalePriceCount: number;
  avgDealerCount: number;
}
