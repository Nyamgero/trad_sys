// ============================================
// pages/DailySummaryPage.tsx
// ============================================

import React from 'react';
import { DailySummaryView } from '@/features/trading/daily-summary';
import type { DailySummary } from '@/features/trading/daily-summary';

// Placeholder data - in production, this would come from API
const useDailySummary = () => {
  const placeholderData: DailySummary = {
    date: new Date().toISOString().split('T')[0],
    asOfTime: new Date().toISOString(),
    totalMarketValue: { amount: 20637453, currency: 'USD' },
    totalDayPnL: { amount: 846470, currency: 'USD' },
    totalDayPnLPercent: 0.89,
    totalDayPnLDirection: 'up',
    totalMtdPnL: { amount: 2377900, currency: 'USD' },
    totalMtdPnLPercent: 2.45,
    totalYtdPnL: { amount: 7459600, currency: 'USD' },
    totalYtdPnLPercent: 8.25,
    assetClasses: [
      {
        assetClass: 'equity',
        positionCount: 4,
        marketValue: { amount: 6083722, currency: 'USD' },
        dayPnL: { amount: 664100, currency: 'USD' },
        dayPnLPercent: 1.36,
        dayPnLDirection: 'up',
        mtdPnL: { amount: 1245800, currency: 'USD' },
        mtdPnLPercent: 2.58,
        ytdPnL: { amount: 3456200, currency: 'USD' },
        ytdPnLPercent: 7.53,
      },
      {
        assetClass: 'etf',
        positionCount: 4,
        marketValue: { amount: 4118254, currency: 'USD' },
        dayPnL: { amount: 83020, currency: 'USD' },
        dayPnLPercent: 0.91,
        dayPnLDirection: 'up',
        mtdPnL: { amount: 156400, currency: 'USD' },
        mtdPnLPercent: 1.72,
        ytdPnL: { amount: 512800, currency: 'USD' },
        ytdPnLPercent: 5.82,
      },
      {
        assetClass: 'fx',
        positionCount: 4,
        marketValue: { amount: 0, currency: 'USD' },
        dayPnL: { amount: -26500, currency: 'USD' },
        dayPnLPercent: -0.24,
        dayPnLDirection: 'down',
        mtdPnL: { amount: 85200, currency: 'USD' },
        mtdPnLPercent: 0.78,
        ytdPnL: { amount: 245600, currency: 'USD' },
        ytdPnLPercent: 2.25,
      },
      {
        assetClass: 'bond',
        positionCount: 4,
        marketValue: { amount: 10435477, currency: 'USD' },
        dayPnL: { amount: 125850, currency: 'USD' },
        dayPnLPercent: 0.15,
        dayPnLDirection: 'up',
        mtdPnL: { amount: 890500, currency: 'USD' },
        mtdPnLPercent: 0.86,
        ytdPnL: { amount: 3245000, currency: 'USD' },
        ytdPnLPercent: 3.21,
      },
    ],
    topGainers: [
      {
        id: '1',
        symbol: 'SAB.JO',
        name: 'SABMiller',
        assetClass: 'equity',
        dayPnL: { amount: 625000, currency: 'ZAR' },
        dayPnLPercent: 1.39,
        direction: 'up',
      },
      {
        id: '2',
        symbol: 'SFEN.PA',
        name: 'Safran SA',
        assetClass: 'equity',
        dayPnL: { amount: 25600, currency: 'EUR' },
        dayPnLPercent: 2.05,
        direction: 'up',
      },
    ],
    topLosers: [
      {
        id: '3',
        symbol: 'USD/ZAR',
        name: 'USD/ZAR',
        assetClass: 'fx',
        dayPnL: { amount: -18750, currency: 'USD' },
        dayPnLPercent: -0.20,
        direction: 'down',
      },
      {
        id: '4',
        symbol: 'SHEL.L',
        name: 'Shell PLC',
        assetClass: 'equity',
        dayPnL: { amount: -8000, currency: 'GBP' },
        dayPnLPercent: -1.24,
        direction: 'down',
      },
    ],
    alerts: [],
  };

  return {
    data: placeholderData,
    isLoading: false,
  };
};

export const DailySummaryPage: React.FC = () => {
  const { data, isLoading } = useDailySummary();

  if (isLoading) {
    return <div className="page-loading">Loading...</div>;
  }

  return (
    <DailySummaryView
      data={data}
      onAssetClassClick={(assetClass) => {
        console.log('Navigate to:', assetClass);
      }}
      onPositionClick={(positionId, assetClass) => {
        console.log('Open position:', positionId, assetClass);
      }}
    />
  );
};

export default DailySummaryPage;
