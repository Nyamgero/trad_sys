// ============================================
// features/trading/liquidity/LiquidityView.tsx
// ============================================

import React, { useMemo } from 'react';
import { DataGrid } from '@/components/ui/DataGrid';
import { LiquidityScore } from '@/components/ui/LiquidityScore';
import { PnLIndicator } from '@/components/ui/PnLIndicator';
import {
  EQUITY_LIQUIDITY_COLUMNS,
  ETF_LIQUIDITY_COLUMNS,
  FX_LIQUIDITY_COLUMNS,
  BOND_LIQUIDITY_COLUMNS,
} from './columns';
import type {
  EquityLiquidityPosition,
  ETFLiquidityPosition,
  FXLiquidityPosition,
  BondLiquidityPosition,
  LiquiditySummary,
  LiquidityAlert,
} from './types';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/formatters';

type AssetClass = 'equity' | 'etf' | 'fx' | 'bond';
type LiquidityPosition =
  | EquityLiquidityPosition
  | ETFLiquidityPosition
  | FXLiquidityPosition
  | BondLiquidityPosition;

interface LiquidityViewProps {
  assetClass: AssetClass;
  positions: LiquidityPosition[];
  summary: LiquiditySummary | null;
  isLoading?: boolean;
  className?: string;
}

export const LiquidityView: React.FC<LiquidityViewProps> = ({
  assetClass,
  positions,
  summary,
  isLoading = false,
  className = '',
}) => {
  const columns = useMemo(() => {
    switch (assetClass) {
      case 'equity':
        return EQUITY_LIQUIDITY_COLUMNS;
      case 'etf':
        return ETF_LIQUIDITY_COLUMNS;
      case 'fx':
        return FX_LIQUIDITY_COLUMNS;
      case 'bond':
        return BOND_LIQUIDITY_COLUMNS;
    }
  }, [assetClass]);

  const getAlertSeverityClass = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'liquidity-alert--high';
      case 'medium':
        return 'liquidity-alert--medium';
      default:
        return 'liquidity-alert--low';
    }
  };

  return (
    <div className={`liquidity-view liquidity-view--${assetClass} ${className}`}>
      {/* Summary Section */}
      {summary && (
        <div className="liquidity-view__summary">
          {/* Score Distribution */}
          <div className="liquidity-summary-card">
            <h3 className="liquidity-summary-card__title">Liquidity Overview</h3>
            <div className="liquidity-summary-card__content">
              <div className="liquidity-score-display">
                <LiquidityScore
                  score={Math.round(summary.avgLiquidityScore) as 1 | 2 | 3 | 4 | 5}
                  showLabel
                  size="large"
                />
                <span className="liquidity-score-display__label">
                  Avg Score: {summary.avgLiquidityScore.toFixed(1)}
                </span>
              </div>
              <div className="liquidity-distribution">
                <div className="liquidity-distribution__item liquidity-distribution__item--high">
                  <span className="liquidity-distribution__count">{summary.highRiskPositions}</span>
                  <span className="liquidity-distribution__label">High Risk</span>
                </div>
                <div className="liquidity-distribution__item liquidity-distribution__item--medium">
                  <span className="liquidity-distribution__count">{summary.mediumRiskPositions}</span>
                  <span className="liquidity-distribution__label">Medium</span>
                </div>
                <div className="liquidity-distribution__item liquidity-distribution__item--low">
                  <span className="liquidity-distribution__count">{summary.lowRiskPositions}</span>
                  <span className="liquidity-distribution__label">Low Risk</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="liquidity-summary-card">
            <h3 className="liquidity-summary-card__title">Key Metrics</h3>
            <div className="liquidity-metrics">
              <div className="liquidity-metric">
                <span className="liquidity-metric__label">Positions</span>
                <span className="liquidity-metric__value">{summary.totalPositions}</span>
              </div>
              <div className="liquidity-metric">
                <span className="liquidity-metric__label">Total Spread Cost</span>
                <span className="liquidity-metric__value">
                  {formatCurrency(summary.totalSpreadCost, 'USD')}
                </span>
              </div>
              <div className="liquidity-metric">
                <span className="liquidity-metric__label">Avg Days to Liquidate</span>
                <span className="liquidity-metric__value">
                  {summary.avgDaysToLiquidate.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Alerts */}
          {summary.alerts.length > 0 && (
            <div className="liquidity-summary-card liquidity-summary-card--alerts">
              <h3 className="liquidity-summary-card__title">
                Alerts ({summary.alerts.length})
              </h3>
              <div className="liquidity-alerts">
                {summary.alerts.slice(0, 5).map((alert) => (
                  <div
                    key={alert.id}
                    className={`liquidity-alert ${getAlertSeverityClass(alert.severity)}`}
                  >
                    <span className="liquidity-alert__icon" />
                    <div className="liquidity-alert__content">
                      <span className="liquidity-alert__symbol">{alert.symbol}</span>
                      <span className="liquidity-alert__message">{alert.message}</span>
                    </div>
                    <span className="liquidity-alert__value">
                      {alert.currentValue.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Alert Legend */}
      <div className="liquidity-view__legend">
        <div className="liquidity-legend">
          <div className="liquidity-legend__item">
            <span className="liquidity-legend__dot liquidity-legend__dot--high" />
            <span>Position &gt; 25% ADV - Liquidation Risk</span>
          </div>
          <div className="liquidity-legend__item">
            <span className="liquidity-legend__dot liquidity-legend__dot--medium" />
            <span>Position &gt; 10% ADV - Monitor Closely</span>
          </div>
          <div className="liquidity-legend__item">
            <span className="liquidity-legend__dot liquidity-legend__dot--low" />
            <span>Position &lt; 10% ADV - Normal</span>
          </div>
        </div>
      </div>

      {/* Data Grid */}
      <DataGrid
        data={positions}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        emptyMessage={`No ${assetClass} liquidity data`}
        stickyHeader
        virtualized
      />
    </div>
  );
};

export default LiquidityView;
