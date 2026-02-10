// ============================================
// features/portfolio/RiskAnalytics.tsx
// ============================================

import React from 'react';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import type { RiskMetrics, DurationRisk, CurrencyExposure } from './types';

interface RiskAnalyticsProps {
  riskMetrics: RiskMetrics;
  durationRisk: DurationRisk;
  currencyExposure: CurrencyExposure[];
  className?: string;
}

export const RiskAnalytics: React.FC<RiskAnalyticsProps> = ({
  riskMetrics,
  durationRisk,
  currencyExposure,
  className = '',
}) => {
  const getComparisonClass = (value: number, benchmark: number, higherIsBetter: boolean) => {
    if (higherIsBetter) {
      return value > benchmark ? 'comparison--better' : value < benchmark ? 'comparison--worse' : '';
    }
    return value < benchmark ? 'comparison--better' : value > benchmark ? 'comparison--worse' : '';
  };

  return (
    <div className={`risk-analytics ${className}`}>
      {/* Portfolio Risk Metrics */}
      <section className="portfolio-section">
        <h2 className="portfolio-section__title">Portfolio Risk Metrics</h2>
        <div className="risk-metrics-grid">
          <div className="risk-metric-card">
            <div className="risk-metric-card__header">
              <span className="risk-metric-card__label">Portfolio Beta</span>
              <span className="risk-metric-card__benchmark">
                Benchmark: {riskMetrics.benchmarkBeta.toFixed(2)}
              </span>
            </div>
            <span className={`risk-metric-card__value ${getComparisonClass(riskMetrics.portfolioBeta, 1, false)}`}>
              {riskMetrics.portfolioBeta.toFixed(2)}
            </span>
            <span className="risk-metric-card__status">
              {riskMetrics.portfolioBeta > 1 ? 'Aggressive' : 'Defensive'}
            </span>
          </div>

          <div className="risk-metric-card">
            <div className="risk-metric-card__header">
              <span className="risk-metric-card__label">Volatility (Ann.)</span>
              <span className="risk-metric-card__benchmark">
                Benchmark: {formatPercent(riskMetrics.benchmarkVolatility)}
              </span>
            </div>
            <span className={`risk-metric-card__value ${getComparisonClass(riskMetrics.volatilityAnnualized, riskMetrics.benchmarkVolatility, false)}`}>
              {formatPercent(riskMetrics.volatilityAnnualized)}
            </span>
            <span className="risk-metric-card__status">
              {riskMetrics.volatilityAnnualized > riskMetrics.benchmarkVolatility ? 'Above Benchmark' : 'Below Benchmark'}
            </span>
          </div>

          <div className="risk-metric-card">
            <div className="risk-metric-card__header">
              <span className="risk-metric-card__label">Sharpe Ratio</span>
              <span className="risk-metric-card__benchmark">
                Benchmark: {riskMetrics.benchmarkSharpe.toFixed(2)}
              </span>
            </div>
            <span className={`risk-metric-card__value ${getComparisonClass(riskMetrics.sharpeRatio, riskMetrics.benchmarkSharpe, true)}`}>
              {riskMetrics.sharpeRatio.toFixed(2)}
            </span>
            <span className="risk-metric-card__status">
              {riskMetrics.sharpeRatio > riskMetrics.benchmarkSharpe ? 'Outperforming' : 'Underperforming'}
            </span>
          </div>

          <div className="risk-metric-card">
            <div className="risk-metric-card__header">
              <span className="risk-metric-card__label">Sortino Ratio</span>
              <span className="risk-metric-card__benchmark">
                Benchmark: {riskMetrics.benchmarkSortino.toFixed(2)}
              </span>
            </div>
            <span className={`risk-metric-card__value ${getComparisonClass(riskMetrics.sortinoRatio, riskMetrics.benchmarkSortino, true)}`}>
              {riskMetrics.sortinoRatio.toFixed(2)}
            </span>
            <span className="risk-metric-card__status">Strong Downside Protection</span>
          </div>

          <div className="risk-metric-card">
            <div className="risk-metric-card__header">
              <span className="risk-metric-card__label">Max Drawdown (YTD)</span>
              <span className="risk-metric-card__benchmark">
                Benchmark: {formatPercent(riskMetrics.benchmarkMaxDrawdown)}
              </span>
            </div>
            <span className={`risk-metric-card__value ${getComparisonClass(Math.abs(riskMetrics.maxDrawdownYtd), Math.abs(riskMetrics.benchmarkMaxDrawdown), false)}`}>
              {formatPercent(riskMetrics.maxDrawdownYtd)}
            </span>
            <span className="risk-metric-card__status">
              {Math.abs(riskMetrics.maxDrawdownYtd) < Math.abs(riskMetrics.benchmarkMaxDrawdown) ? 'Better than Benchmark' : 'Worse than Benchmark'}
            </span>
          </div>

          <div className="risk-metric-card">
            <div className="risk-metric-card__header">
              <span className="risk-metric-card__label">VaR (95%, 1-day)</span>
            </div>
            <span className="risk-metric-card__value">
              {formatCurrency(riskMetrics.var95_1day, 'USD')}
            </span>
            <span className="risk-metric-card__status">
              {formatPercent(riskMetrics.varPercent)} of AUM
            </span>
          </div>

          <div className="risk-metric-card">
            <div className="risk-metric-card__header">
              <span className="risk-metric-card__label">CVaR (95%, 1-day)</span>
            </div>
            <span className="risk-metric-card__value">
              {formatCurrency(riskMetrics.cvar95_1day, 'USD')}
            </span>
            <span className="risk-metric-card__status">
              {formatPercent(riskMetrics.cvarPercent)} of AUM
            </span>
          </div>
        </div>
      </section>

      {/* Duration & Interest Rate Risk */}
      <section className="portfolio-section">
        <h2 className="portfolio-section__title">Duration & Interest Rate Risk (Bonds)</h2>
        <div className="duration-grid">
          <div className="duration-metric">
            <span className="duration-metric__label">Portfolio Duration</span>
            <span className="duration-metric__value">{durationRisk.portfolioDuration.toFixed(1)} years</span>
          </div>
          <div className="duration-metric">
            <span className="duration-metric__label">Modified Duration</span>
            <span className="duration-metric__value">{durationRisk.modifiedDuration.toFixed(1)}</span>
          </div>
          <div className="duration-metric">
            <span className="duration-metric__label">DV01 (Total)</span>
            <span className="duration-metric__value">{formatCurrency(durationRisk.dv01Total, 'USD')}</span>
          </div>
          <div className="duration-metric">
            <span className="duration-metric__label">Convexity</span>
            <span className="duration-metric__value">{durationRisk.convexity.toFixed(1)}</span>
          </div>
        </div>

        {/* Key Rate DV01 */}
        <div className="key-rate-dv01">
          <h3 className="key-rate-dv01__title">Key Rate DV01</h3>
          <div className="key-rate-grid">
            {durationRisk.keyRateDv01.map((krd) => (
              <div key={krd.tenor} className="key-rate-item">
                <span className="key-rate-item__tenor">{krd.tenor}</span>
                <span className="key-rate-item__value">{formatCurrency(krd.value, 'USD')}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Currency Exposure */}
      <section className="portfolio-section">
        <h2 className="portfolio-section__title">Currency Exposure</h2>
        <div className="currency-table">
          <div className="currency-header">
            <span>Currency</span>
            <span>Gross Exposure</span>
            <span>Net Exposure</span>
            <span>Hedge Ratio</span>
            <span>Unhedged Risk</span>
          </div>
          {currencyExposure.map((exp) => (
            <div key={exp.currency} className="currency-row">
              <span className="currency-row__name">{exp.currency}</span>
              <span className="currency-row__value">{formatCurrency(exp.grossExposure, 'USD')}</span>
              <span className="currency-row__value">{formatCurrency(exp.netExposure, 'USD')}</span>
              <span className="currency-row__value">{formatPercent(exp.hedgeRatio)}</span>
              <span className="currency-row__value">{formatCurrency(exp.unhedgedRisk, 'USD')}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default RiskAnalytics;
