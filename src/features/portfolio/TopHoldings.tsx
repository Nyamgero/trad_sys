// ============================================
// features/portfolio/TopHoldings.tsx
// ============================================

import React from 'react';
import { PnLIndicator } from '@/components/ui/PnLIndicator';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import type { TopHolding } from './types';

interface TopHoldingsProps {
  holdings: TopHolding[];
  className?: string;
}

export const TopHoldings: React.FC<TopHoldingsProps> = ({
  holdings,
  className = '',
}) => {
  const getTypeClass = (type: TopHolding['type']) => {
    switch (type) {
      case 'equity':
        return 'holding-type--equity';
      case 'etf':
        return 'holding-type--etf';
      case 'fx':
        return 'holding-type--fx';
      case 'bond':
        return 'holding-type--bond';
    }
  };

  return (
    <div className={`top-holdings ${className}`}>
      <section className="portfolio-section">
        <h2 className="portfolio-section__title">Top 10 Positions by Market Value</h2>
        <div className="holdings-table">
          <div className="holdings-header">
            <span>Rank</span>
            <span>Asset</span>
            <span>Type</span>
            <span>Market Value</span>
            <span>Weight</span>
            <span>P&L (YTD)</span>
            <span>P&L %</span>
          </div>
          {holdings.map((holding) => (
            <div key={holding.rank} className="holdings-row">
              <span className="holdings-row__rank">{holding.rank}</span>
              <span className="holdings-row__asset">{holding.asset}</span>
              <span className={`holdings-row__type ${getTypeClass(holding.type)}`}>
                {holding.type.toUpperCase()}
              </span>
              <span className="holdings-row__value">
                {formatCurrency(holding.marketValue, 'USD')}
              </span>
              <span className="holdings-row__weight">{formatPercent(holding.weight)}</span>
              <span className="holdings-row__pnl">
                <PnLIndicator
                  value={holding.pnlYtd}
                  format="currency"
                  currency="USD"
                  size="small"
                />
              </span>
              <span className="holdings-row__pnl-percent">
                <PnLIndicator
                  value={holding.pnlYtdPercent}
                  format="percent"
                  size="small"
                  colorMode="text"
                />
              </span>
            </div>
          ))}
        </div>

        {/* Weight Distribution */}
        <div className="holdings-distribution">
          <h3 className="holdings-distribution__title">Concentration</h3>
          <div className="holdings-distribution__bar">
            {holdings.slice(0, 10).map((holding) => (
              <div
                key={holding.rank}
                className={`holdings-distribution__segment ${getTypeClass(holding.type)}`}
                style={{ width: `${holding.weight}%` }}
                title={`${holding.asset}: ${formatPercent(holding.weight)}`}
              />
            ))}
          </div>
          <div className="holdings-distribution__legend">
            <span>Top 10 Holdings: {formatPercent(holdings.reduce((sum, h) => sum + h.weight, 0))}</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TopHoldings;
