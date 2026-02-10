// ============================================
// features/trading/pnl/FXPnLView.tsx
// ============================================

import React, { useMemo } from 'react';
import { DataGrid } from '@/components/ui/DataGrid';
import { SummaryCard } from '@/components/ui/SummaryCard';
import { PnLIndicator } from '@/components/ui/PnLIndicator';
import { FX_PNL_COLUMNS } from './columns';
import type { FXPnLPosition, FXPnLSummary } from './types';
import { formatCurrency, formatPercent } from '@/lib/formatters';

interface FXPnLViewProps {
  positions: FXPnLPosition[];
  summary: FXPnLSummary | null;
  isLoading?: boolean;
  className?: string;
}

export const FXPnLView: React.FC<FXPnLViewProps> = ({
  positions,
  summary,
  isLoading = false,
  className = '',
}) => {
  const totalsRow = useMemo(() => {
    if (!summary) return null;
    return {
      id: 'totals',
      ccyPair: 'TOTAL',
      direction: '' as const,
      notional: 0,
      avgRate: 0,
      spotRate: 0,
      ratePnLPips: 0,
      spotPnL: { amount: summary.totalSpotPnL, currency: 'USD' },
      forwardPointsPnL: { amount: summary.totalForwardPointsPnL, currency: 'USD' },
      unrealizedPnL: { amount: summary.totalPnL, currency: 'USD' },
      realizedPnL: { amount: 0, currency: 'USD' },
      totalPnL: { amount: summary.totalPnL, currency: 'USD' },
      dayPnL: { amount: summary.dayPnL, currency: 'USD' },
      dayPnLPercent: summary.dayPnLPercent,
      mtdPnL: { amount: summary.mtdPnL, currency: 'USD' },
      mtdPnLPercent: summary.mtdPnLPercent,
      ytdPnL: { amount: summary.ytdPnL, currency: 'USD' },
      ytdPnLPercent: summary.ytdPnLPercent,
    };
  }, [summary]);

  return (
    <div className={`pnl-view pnl-view--fx ${className}`}>
      {/* Summary Section */}
      {summary && (
        <div className="pnl-view__summary">
          <SummaryCard
            title="FX P&L"
            value={summary.totalPnL}
            currency="USD"
            periods={[
              { label: 'Day', value: summary.dayPnL, percent: summary.dayPnLPercent },
              { label: 'MTD', value: summary.mtdPnL, percent: summary.mtdPnLPercent },
              { label: 'YTD', value: summary.ytdPnL, percent: summary.ytdPnLPercent },
            ]}
          />

          {/* P&L Attribution */}
          <div className="pnl-view__attribution">
            <h3 className="pnl-view__attribution-title">P&L Attribution</h3>
            <div className="pnl-attribution-grid">
              <div className="pnl-attribution-item">
                <div className="pnl-attribution-item__header">
                  <span className="pnl-attribution-item__label">Spot P&L</span>
                  <span className="pnl-attribution-item__percent">
                    {formatPercent(summary.attribution.spotPercent)}
                  </span>
                </div>
                <PnLIndicator
                  value={summary.attribution.spotPnL}
                  format="currency"
                  currency="USD"
                  size="medium"
                />
                <div className="pnl-attribution-item__bar">
                  <div
                    className="pnl-attribution-item__bar-fill pnl-attribution-item__bar-fill--spot"
                    style={{ width: `${Math.abs(summary.attribution.spotPercent)}%` }}
                  />
                </div>
              </div>

              <div className="pnl-attribution-item">
                <div className="pnl-attribution-item__header">
                  <span className="pnl-attribution-item__label">Forward Points</span>
                  <span className="pnl-attribution-item__percent">
                    {formatPercent(summary.attribution.forwardPercent)}
                  </span>
                </div>
                <PnLIndicator
                  value={summary.attribution.forwardPointsPnL}
                  format="currency"
                  currency="USD"
                  size="medium"
                />
                <div className="pnl-attribution-item__bar">
                  <div
                    className="pnl-attribution-item__bar-fill pnl-attribution-item__bar-fill--forward"
                    style={{ width: `${Math.abs(summary.attribution.forwardPercent)}%` }}
                  />
                </div>
              </div>

              <div className="pnl-attribution-item pnl-attribution-item--total">
                <span className="pnl-attribution-item__label">Total FX P&L</span>
                <PnLIndicator
                  value={summary.attribution.totalPnL}
                  format="currency"
                  currency="USD"
                  size="large"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Grid */}
      <DataGrid
        data={positions}
        columns={FX_PNL_COLUMNS}
        rowKey="id"
        loading={isLoading}
        totalsRow={totalsRow}
        emptyMessage="No FX P&L data"
        stickyHeader
        virtualized
      />
    </div>
  );
};

export default FXPnLView;
