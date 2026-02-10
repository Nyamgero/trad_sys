// ============================================
// features/trading/pnl/ETFPnLView.tsx
// ============================================

import React, { useMemo } from 'react';
import { DataGrid } from '@/components/ui/DataGrid';
import { SummaryCard } from '@/components/ui/SummaryCard';
import { PnLIndicator } from '@/components/ui/PnLIndicator';
import { ETF_PNL_COLUMNS } from './columns';
import type { ETFPnLPosition, ETFPnLSummary } from './types';
import { formatCurrency } from '@/lib/formatters';

interface ETFPnLViewProps {
  positions: ETFPnLPosition[];
  summary: ETFPnLSummary | null;
  isLoading?: boolean;
  className?: string;
}

export const ETFPnLView: React.FC<ETFPnLViewProps> = ({
  positions,
  summary,
  isLoading = false,
  className = '',
}) => {
  const totalsRow = useMemo(() => {
    if (!summary) return null;
    return {
      id: 'totals',
      symbol: 'TOTAL',
      name: '',
      units: positions.reduce((sum, p) => sum + p.units, 0),
      avgCost: 0,
      lastPrice: 0,
      costBasis: { amount: summary.totalCostBasis, currency: 'USD' },
      marketValue: { amount: summary.totalMarketValue, currency: 'USD' },
      unrealizedPnL: { amount: summary.totalUnrealizedPnL, currency: 'USD' },
      unrealizedPercent: summary.totalUnrealizedPercent,
      realizedPnL: { amount: summary.totalRealizedPnL, currency: 'USD' },
      totalPnL: { amount: summary.totalUnrealizedPnL + summary.totalRealizedPnL, currency: 'USD' },
      dayPnL: { amount: summary.dayPnL, currency: 'USD' },
      dayPnLPercent: summary.dayPnLPercent,
      mtdPnL: { amount: summary.mtdPnL, currency: 'USD' },
      mtdPnLPercent: summary.mtdPnLPercent,
      ytdPnL: { amount: summary.ytdPnL, currency: 'USD' },
      ytdPnLPercent: summary.ytdPnLPercent,
    };
  }, [summary, positions]);

  return (
    <div className={`pnl-view pnl-view--etf ${className}`}>
      {/* Summary Section */}
      {summary && (
        <div className="pnl-view__summary">
          <SummaryCard
            title="ETF P&L"
            value={summary.totalUnrealizedPnL + summary.totalRealizedPnL}
            currency="USD"
            periods={[
              { label: 'Day', value: summary.dayPnL, percent: summary.dayPnLPercent },
              { label: 'MTD', value: summary.mtdPnL, percent: summary.mtdPnLPercent },
              { label: 'YTD', value: summary.ytdPnL, percent: summary.ytdPnLPercent },
            ]}
          />

          <div className="pnl-view__breakdown">
            <div className="pnl-breakdown-card">
              <span className="pnl-breakdown-card__label">Cost Basis</span>
              <span className="pnl-breakdown-card__value">
                {formatCurrency(summary.totalCostBasis, 'USD')}
              </span>
            </div>
            <div className="pnl-breakdown-card">
              <span className="pnl-breakdown-card__label">Market Value</span>
              <span className="pnl-breakdown-card__value">
                {formatCurrency(summary.totalMarketValue, 'USD')}
              </span>
            </div>
            <div className="pnl-breakdown-card">
              <span className="pnl-breakdown-card__label">Unrealized P&L</span>
              <PnLIndicator
                value={summary.totalUnrealizedPnL}
                format="currency"
                currency="USD"
                size="medium"
              />
              <span className="pnl-breakdown-card__percent">
                <PnLIndicator
                  value={summary.totalUnrealizedPercent}
                  format="percent"
                  size="small"
                  colorMode="text"
                />
              </span>
            </div>
            <div className="pnl-breakdown-card">
              <span className="pnl-breakdown-card__label">Realized P&L (YTD)</span>
              <PnLIndicator
                value={summary.totalRealizedPnL}
                format="currency"
                currency="USD"
                size="medium"
              />
            </div>
          </div>
        </div>
      )}

      {/* Data Grid */}
      <DataGrid
        data={positions}
        columns={ETF_PNL_COLUMNS}
        rowKey="id"
        loading={isLoading}
        totalsRow={totalsRow}
        emptyMessage="No ETF P&L data"
        stickyHeader
        virtualized
      />
    </div>
  );
};

export default ETFPnLView;
