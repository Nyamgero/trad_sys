// ============================================
// pages/PnLPage.tsx
// ============================================

import React from 'react';
import { EquityPnLView } from '@/features/trading/pnl';
import { ETFPnLView } from '@/features/trading/pnl';
import { FXPnLView } from '@/features/trading/pnl';
import { BondPnLView } from '@/features/trading/pnl';

type AssetClass = 'equity' | 'etf' | 'fx' | 'bond';

interface PnLPageProps {
  assetClass: AssetClass;
}

// Placeholder data - in production, this would come from API hooks
const usePnLData = (assetClass: AssetClass) => {
  // This would use the appropriate query hook based on asset class
  return {
    positions: [],
    summary: null,
    isLoading: false,
  };
};

export const PnLPage: React.FC<PnLPageProps> = ({ assetClass }) => {
  const { positions, summary, isLoading } = usePnLData(assetClass);

  switch (assetClass) {
    case 'equity':
      return (
        <EquityPnLView
          positions={positions}
          summary={summary}
          isLoading={isLoading}
        />
      );
    case 'etf':
      return (
        <ETFPnLView
          positions={positions}
          summary={summary}
          isLoading={isLoading}
        />
      );
    case 'fx':
      return (
        <FXPnLView
          positions={positions}
          summary={summary}
          isLoading={isLoading}
        />
      );
    case 'bond':
      return (
        <BondPnLView
          positions={positions}
          summary={summary}
          isLoading={isLoading}
        />
      );
    default:
      return <div>Unknown asset class</div>;
  }
};

export default PnLPage;
