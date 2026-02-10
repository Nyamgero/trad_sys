// ============================================
// pages/LiquidityPage.tsx
// ============================================

import React from 'react';
import { LiquidityView } from '@/features/trading/liquidity';
import type { LiquiditySummary } from '@/features/trading/liquidity';

type AssetClass = 'equity' | 'etf' | 'fx' | 'bond';

interface LiquidityPageProps {
  assetClass: AssetClass;
}

// Placeholder data - in production, this would come from API hooks
const useLiquidityData = (assetClass: AssetClass) => {
  const baseSummary: LiquiditySummary = {
    totalPositions: 4,
    avgLiquidityScore: 4.2,
    highRiskPositions: 1,
    mediumRiskPositions: 1,
    lowRiskPositions: 2,
    totalSpreadCost: 5084,
    avgDaysToLiquidate: 0.025,
    alerts: [
      {
        id: '1',
        severity: 'medium',
        type: 'position_size',
        message: 'Position exceeds 5% of ADV',
        positionId: '2',
        assetClass,
        symbol: assetClass === 'equity' ? 'SAB.JO' : assetClass === 'etf' ? 'STXEMG' : 'USD/KES',
        threshold: 5,
        currentValue: 5.9,
        timestamp: new Date().toISOString(),
      },
    ],
  };

  return {
    positions: [],
    summary: baseSummary,
    isLoading: false,
  };
};

export const LiquidityPage: React.FC<LiquidityPageProps> = ({ assetClass }) => {
  const { positions, summary, isLoading } = useLiquidityData(assetClass);

  return (
    <LiquidityView
      assetClass={assetClass}
      positions={positions}
      summary={summary}
      isLoading={isLoading}
    />
  );
};

export default LiquidityPage;
