// ============================================
// features/portfolio/PerformanceAttribution.tsx
// ============================================

import React from 'react';
import { PnLIndicator } from '@/components/ui/PnLIndicator';
import { formatPercent } from '@/lib/formatters';
import type { PerformanceAttribution as PerformanceAttributionType, AssetClassPerformance } from './types';

interface PerformanceAttributionProps {
  attribution: PerformanceAttributionType;
  assetClassPerformance: AssetClassPerformance[];
  className?: string;
}

export const PerformanceAttribution: React.FC<PerformanceAttributionProps> = ({
  attribution,
  assetClassPerformance,
  className = '',
}) => {
  return (
    <div className={`performance-attribution ${className}`}>
      {/* Return Attribution */}
      <section className="portfolio-section">
        <h2 className="portfolio-section__title">Return Attribution (YTD)</h2>
        <div className="attribution-breakdown">
          <div className="attribution-total">
            <span className="attribution-total__label">Total Return</span>
            <PnLIndicator
              value={attribution.totalReturn}
              format="percent"
              size="large"
            />
          </div>

          <div className="attribution-components">
            <div className="attribution-component">
              <div className="attribution-component__bar-container">
                <div
                  className="attribution-component__bar"
                  style={{
                    width: `${Math.abs(attribution.assetAllocationReturn / attribution.totalReturn) * 100}%`,
                    backgroundColor: 'var(--color-primary)',
                  }}
                />
              </div>
              <div className="attribution-component__info">
                <span className="attribution-component__label">Asset Allocation</span>
                <PnLIndicator
                  value={attribution.assetAllocationReturn}
                  format="percent"
                  size="small"
                />
              </div>
            </div>

            <div className="attribution-component">
              <div className="attribution-component__bar-container">
                <div
                  className="attribution-component__bar"
                  style={{
                    width: `${Math.abs(attribution.securitySelectionReturn / attribution.totalReturn) * 100}%`,
                    backgroundColor: 'var(--color-secondary)',
                  }}
                />
              </div>
              <div className="attribution-component__info">
                <span className="attribution-component__label">Security Selection</span>
                <PnLIndicator
                  value={attribution.securitySelectionReturn}
                  format="percent"
                  size="small"
                />
              </div>
            </div>

            <div className="attribution-component">
              <div className="attribution-component__bar-container">
                <div
                  className="attribution-component__bar"
                  style={{
                    width: `${Math.abs(attribution.currencyEffect / attribution.totalReturn) * 100}%`,
                    backgroundColor: 'var(--color-info)',
                  }}
                />
              </div>
              <div className="attribution-component__info">
                <span className="attribution-component__label">Currency Effect</span>
                <PnLIndicator
                  value={attribution.currencyEffect}
                  format="percent"
                  size="small"
                />
              </div>
            </div>

            <div className="attribution-component">
              <div className="attribution-component__bar-container">
                <div
                  className="attribution-component__bar"
                  style={{
                    width: `${Math.abs(attribution.interactionEffect / attribution.totalReturn) * 100}%`,
                    backgroundColor: 'var(--color-warning)',
                  }}
                />
              </div>
              <div className="attribution-component__info">
                <span className="attribution-component__label">Interaction Effect</span>
                <PnLIndicator
                  value={attribution.interactionEffect}
                  format="percent"
                  size="small"
                />
              </div>
            </div>

            <div className="attribution-component">
              <div className="attribution-component__bar-container">
                <div
                  className="attribution-component__bar"
                  style={{
                    width: `${Math.abs(attribution.residual / attribution.totalReturn) * 100}%`,
                    backgroundColor: 'var(--text-tertiary)',
                  }}
                />
              </div>
              <div className="attribution-component__info">
                <span className="attribution-component__label">Residual</span>
                <PnLIndicator
                  value={attribution.residual}
                  format="percent"
                  size="small"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Attribution by Asset Class */}
      <section className="portfolio-section">
        <h2 className="portfolio-section__title">Attribution by Asset Class</h2>
        <div className="asset-class-attribution">
          <div className="asset-class-header">
            <span>Asset Class</span>
            <span>Weight</span>
            <span>Return</span>
            <span>Contribution</span>
            <span>vs Benchmark</span>
          </div>
          {assetClassPerformance.map((ac) => (
            <div key={ac.assetClass} className="asset-class-row">
              <span className="asset-class-row__name">{ac.assetClass}</span>
              <span className="asset-class-row__value">{formatPercent(ac.weight)}</span>
              <span className="asset-class-row__value">
                <PnLIndicator value={ac.return} format="percent" size="small" colorMode="text" />
              </span>
              <span className="asset-class-row__value">
                <PnLIndicator value={ac.contribution} format="percent" size="small" colorMode="text" />
              </span>
              <span className="asset-class-row__value">
                <PnLIndicator value={ac.vsBenchmark} format="percent" size="small" colorMode="text" />
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PerformanceAttribution;
