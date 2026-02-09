// ============================================
// features/trading/positions/bond/types.ts
// ============================================

import { Currency, MoneyValue, Timestamp } from '@/types/common';

export type BondType = 'government' | 'corporate' | 'municipal' | 'agency';

export interface BondPosition {
  id: string;
  isin: string;
  name: string;
  issuer: string;
  currency: Currency;
  faceValue: number;
  quantity: number;
  avgPrice: number;
  cleanPrice: number;
  dirtyPrice: number;
  accruedInterest: number;
  ytm: number;
  duration: number;
  marketValue: MoneyValue;
  marketValueBase: MoneyValue;
  dayChangeBps: number;
  updatedAt: Timestamp;
}

export interface BondPositionExpanded extends BondPosition {
  // Bond details
  bondType: BondType;
  coupon: number;
  couponFrequency: 'annual' | 'semi-annual' | 'quarterly' | 'monthly';
  maturityDate: string;
  issueDate: string;

  // Credit
  rating: string;
  ratingAgency: string;
  sector: string;

  // Risk metrics
  modifiedDuration: number;
  dv01: number;
  convexity: number;
  zSpread: number;
  spreadToBenchmark: number;

  // Key rate durations
  keyRateDV01: {
    tenor: string;
    value: number;
  }[];

  // P&L breakdown
  pricePnL: MoneyValue;
  couponReceived: MoneyValue;
  accruedPnL: MoneyValue;
  rollPnL: MoneyValue;
  unrealizedPnL: MoneyValue;
  realizedPnL: MoneyValue;
  totalPnL: MoneyValue;

  // Liquidity
  estDailyVolume: number;
  positionPctVolume: number;
  bidAskSpreadBps: number;
  spreadCost: number;
  dealerCount: number;
  lastTradeDate: string;

  // Cash flows
  nextCouponDate: string;
  nextCouponAmount: number;
  remainingCoupons: number;
}

export interface BondPnLAttribution {
  component: string;
  amount: number;
  percentage: number;
}

export interface BondPortfolioSummary {
  totalPositions: number;
  totalMarketValue: number;
  totalFaceValue: number;
  portfolioDuration: number;
  portfolioYtm: number;
  totalDv01: number;
  // P&L components
  pricePnL: number;
  couponIncome: number;
  accruedPnL: number;
  rollCarryPnL: number;
  // Period P&L
  dayPnL: number;
  dayPnLBps: number;
  mtdPnL: number;
  mtdPnLPercent: number;
  ytdPnL: number;
  ytdPnLPercent: number;
}
