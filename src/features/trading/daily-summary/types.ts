// ============================================
// features/trading/daily-summary/types.ts
// ============================================

import { MoneyValue, PnLDirection } from '@/types/common';

export type AssetClass = 'equity' | 'etf' | 'fx' | 'bond';

export interface AssetClassSummary {
  assetClass: AssetClass;
  positionCount: number;
  marketValue: MoneyValue;
  dayPnL: MoneyValue;
  dayPnLPercent: number;
  dayPnLDirection: PnLDirection;
  mtdPnL: MoneyValue;
  mtdPnLPercent: number;
  ytdPnL: MoneyValue;
  ytdPnLPercent: number;
}

export interface DailySummary {
  date: string;
  asOfTime: string;
  totalMarketValue: MoneyValue;
  totalDayPnL: MoneyValue;
  totalDayPnLPercent: number;
  totalDayPnLDirection: PnLDirection;
  totalMtdPnL: MoneyValue;
  totalMtdPnLPercent: number;
  totalYtdPnL: MoneyValue;
  totalYtdPnLPercent: number;
  assetClasses: AssetClassSummary[];
  topGainers: TopMover[];
  topLosers: TopMover[];
  alerts: Alert[];
}

export interface TopMover {
  id: string;
  symbol: string;
  name: string;
  assetClass: AssetClass;
  dayPnL: MoneyValue;
  dayPnLPercent: number;
  direction: PnLDirection;
}

export interface Alert {
  id: string;
  severity: 'info' | 'warning' | 'error';
  message: string;
  timestamp: string;
  positionId?: string;
  assetClass?: AssetClass;
}
