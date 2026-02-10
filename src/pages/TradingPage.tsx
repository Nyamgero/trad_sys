// ============================================
// pages/TradingPage.tsx
// ============================================

import React from 'react';
import { EquityPositionsView } from '@/features/trading/positions/equity';
import { ETFPositionsView } from '@/features/trading/positions/etf';
import { FXPositionsView } from '@/features/trading/positions/fx';
import { BondPositionsView } from '@/features/trading/positions/bond';

type AssetClass = 'equity' | 'etf' | 'fx' | 'bond';

interface TradingPageProps {
  assetClass: AssetClass;
}

export const TradingPage: React.FC<TradingPageProps> = ({ assetClass }) => {
  switch (assetClass) {
    case 'equity':
      return <EquityPositionsView />;
    case 'etf':
      return <ETFPositionsView />;
    case 'fx':
      return <FXPositionsView />;
    case 'bond':
      return <BondPositionsView />;
    default:
      return <div>Unknown asset class</div>;
  }
};

export default TradingPage;
