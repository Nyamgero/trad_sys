// ============================================
// features/portfolio/PortfolioOverview.tsx
// ============================================

import React from 'react';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import type { PortfolioOverview as PortfolioOverviewType, AssetAllocation } from './types';

interface PortfolioOverviewProps {
  data: PortfolioOverviewType;
  className?: string;
}

export const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({
  data,
  className = '',
}) => {
  const getStatusIcon = (status: AssetAllocation['status']) => {
    switch (status) {
      case 'overweight':
        return '⚠️';
      case 'underweight':
        return '⚠️';
      default:
        return '✅';
    }
  };

  const getStatusClass = (status: AssetAllocation['status']) => {
    switch (status) {
      case 'overweight':
        return 'allocation-status--overweight';
      case 'underweight':
        return 'allocation-status--underweight';
      default:
        return 'allocation-status--ok';
    }
  };

  return (
    <div className={`portfolio-overview ${className}`}>
      {/* AUM Summary */}
      <section className="portfolio-section">
        <h2 className="portfolio-section__title">AUM Summary</h2>
        <div className="aum-summary">
          <div className="aum-metric aum-metric--primary">
            <span className="aum-metric__label">Total AUM</span>
            <span className="aum-metric__value">
              {formatCurrency(data.totalAum, 'USD')}
            </span>
          </div>
          <div className="aum-breakdown">
            <div className="aum-metric">
              <span className="aum-metric__label">Cash & Equivalents</span>
              <span className="aum-metric__value">
                {formatCurrency(data.cashEquivalents, 'USD')}
                <span className="aum-metric__percent">({formatPercent(data.cashPercent)})</span>
              </span>
            </div>
            <div className="aum-metric">
              <span className="aum-metric__label">Invested Capital</span>
              <span className="aum-metric__value">
                {formatCurrency(data.investedCapital, 'USD')}
                <span className="aum-metric__percent">({formatPercent(data.investedPercent)})</span>
              </span>
            </div>
            <div className="aum-metric">
              <span className="aum-metric__label">Accrued Fees</span>
              <span className="aum-metric__value aum-metric__value--negative">
                {formatCurrency(data.accruedFees, 'USD')}
              </span>
            </div>
            <div className="aum-metric aum-metric--highlight">
              <span className="aum-metric__label">NAV</span>
              <span className="aum-metric__value">
                {formatCurrency(data.nav, 'USD')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Asset Allocation */}
      <section className="portfolio-section">
        <h2 className="portfolio-section__title">Asset Allocation</h2>
        <div className="allocation-table">
          <div className="allocation-header">
            <span>Asset Class</span>
            <span>Market Value</span>
            <span>Weight</span>
            <span>Target</span>
            <span>Deviation</span>
            <span>Status</span>
          </div>
          {data.assetAllocation.map((alloc) => (
            <div key={alloc.assetClass} className="allocation-row">
              <span className="allocation-row__name">{alloc.assetClass}</span>
              <span className="allocation-row__value">
                {formatCurrency(alloc.marketValue, 'USD')}
              </span>
              <span className="allocation-row__value">{formatPercent(alloc.weight)}</span>
              <span className="allocation-row__value">{formatPercent(alloc.targetWeight)}</span>
              <span className={`allocation-row__deviation ${alloc.deviation >= 0 ? 'positive' : 'negative'}`}>
                {alloc.deviation >= 0 ? '+' : ''}{formatPercent(alloc.deviation)}
              </span>
              <span className={`allocation-row__status ${getStatusClass(alloc.status)}`}>
                {getStatusIcon(alloc.status)} {alloc.status.replace('_', ' ')}
              </span>
            </div>
          ))}
          <div className="allocation-row allocation-row--total">
            <span className="allocation-row__name">TOTAL</span>
            <span className="allocation-row__value">
              {formatCurrency(data.totalAum, 'USD')}
            </span>
            <span className="allocation-row__value">100%</span>
            <span className="allocation-row__value">100%</span>
            <span></span>
            <span></span>
          </div>
        </div>

        {/* Allocation Chart */}
        <div className="allocation-chart">
          {data.assetAllocation.map((alloc) => (
            <div
              key={alloc.assetClass}
              className="allocation-bar"
              style={{ width: `${alloc.weight}%` }}
              title={`${alloc.assetClass}: ${formatPercent(alloc.weight)}`}
            >
              <span className="allocation-bar__label">{alloc.assetClass}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PortfolioOverview;
