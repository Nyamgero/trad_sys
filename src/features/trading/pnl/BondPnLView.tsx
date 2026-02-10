// ============================================
// features/trading/pnl/BondPnLView.tsx
// ============================================

import React, { useMemo } from 'react';
import { DataGrid } from '@/components/ui/DataGrid';
import { SummaryCard } from '@/components/ui/SummaryCard';
import { PnLIndicator } from '@/components/ui/PnLIndicator';
import { BOND_PNL_COLUMNS } from './columns';
import type { BondPnLPosition, BondPnLSummary } from './types';
import { formatCurrency, formatPercent } from '@/lib/formatters';

interface BondPnLViewProps {
  positions: BondPnLPosition[];
  summary: BondPnLSummary | null;
  isLoading?: boolean;
  className?: string;
}

export const BondPnLView: React.FC<BondPnLViewProps> = ({
  positions,
  summary,
  isLoading = false,
  className = '',
}) => {
  const totalsRow = useMemo(() => {
    if (!summary) return null;
    return {
      id: 'totals',
      isin: 'TOTAL',
      name: '',
      faceValue: positions.reduce((sum, p) => sum + p.faceValue, 0),
      avgPrice: 0,
      cleanPrice: 0,
      pricePnL: { amount: summary.totalPricePnL, currency: 'USD' },
      couponReceived: { amount: summary.totalCouponIncome, currency: 'USD' },
      accruedPnL: { amount: summary.totalAccruedPnL, currency: 'USD' },
      rollPnL: { amount: summary.totalRollCarryPnL, currency: 'USD' },
      unrealizedPnL: { amount: summary.totalPricePnL, currency: 'USD' },
      realizedPnL: { amount: summary.totalCouponIncome, currency: 'USD' },
      totalPnL: { amount: summary.totalPnL, currency: 'USD' },
      dayPnL: { amount: summary.dayPnL, currency: 'USD' },
      dayPnLPercent: 0,
      dayChangeBps: summary.dayPnLBps,
      mtdPnL: { amount: summary.mtdPnL, currency: 'USD' },
      mtdPnLPercent: summary.mtdPnLPercent,
      ytdPnL: { amount: summary.ytdPnL, currency: 'USD' },
      ytdPnLPercent: summary.ytdPnLPercent,
    };
  }, [summary, positions]);

  return (
    <div className={`pnl-view pnl-view--bond ${className}`}>
      {/* Summary Section */}
      {summary && (
        <div className="pnl-view__summary">
          <SummaryCard
            title="Bond P&L"
            value={summary.totalPnL}
            currency="USD"
            periods={[
              { label: 'Day', value: summary.dayPnL, percent: summary.dayPnLBps / 100 },
              { label: 'MTD', value: summary.mtdPnL, percent: summary.mtdPnLPercent },
              { label: 'YTD', value: summary.ytdPnL, percent: summary.ytdPnLPercent },
            ]}
          />

          {/* P&L Attribution */}
          <div className="pnl-view__attribution">
            <h3 className="pnl-view__attribution-title">P&L Attribution</h3>
            <div className="pnl-attribution-grid pnl-attribution-grid--4col">
              <div className="pnl-attribution-item">
                <div className="pnl-attribution-item__header">
                  <span className="pnl-attribution-item__label">Price P&L</span>
                  <span className="pnl-attribution-item__percent">
                    {formatPercent(summary.attribution.pricePercent)}
                  </span>
                </div>
                <PnLIndicator
                  value={summary.attribution.pricePnL}
                  format="currency"
                  currency="USD"
                  size="medium"
                />
                <div className="pnl-attribution-item__bar">
                  <div
                    className="pnl-attribution-item__bar-fill pnl-attribution-item__bar-fill--price"
                    style={{ width: `${Math.min(Math.abs(summary.attribution.pricePercent), 100)}%` }}
                  />
                </div>
              </div>

              <div className="pnl-attribution-item">
                <div className="pnl-attribution-item__header">
                  <span className="pnl-attribution-item__label">Coupon Income</span>
                  <span className="pnl-attribution-item__percent">
                    {formatPercent(summary.attribution.couponPercent)}
                  </span>
                </div>
                <PnLIndicator
                  value={summary.attribution.couponIncome}
                  format="currency"
                  currency="USD"
                  size="medium"
                />
                <div className="pnl-attribution-item__bar">
                  <div
                    className="pnl-attribution-item__bar-fill pnl-attribution-item__bar-fill--coupon"
                    style={{ width: `${Math.min(Math.abs(summary.attribution.couponPercent), 100)}%` }}
                  />
                </div>
              </div>

              <div className="pnl-attribution-item">
                <div className="pnl-attribution-item__header">
                  <span className="pnl-attribution-item__label">Accrued Interest</span>
                  <span className="pnl-attribution-item__percent">
                    {formatPercent(summary.attribution.accruedPercent)}
                  </span>
                </div>
                <PnLIndicator
                  value={summary.attribution.accruedPnL}
                  format="currency"
                  currency="USD"
                  size="medium"
                />
                <div className="pnl-attribution-item__bar">
                  <div
                    className="pnl-attribution-item__bar-fill pnl-attribution-item__bar-fill--accrued"
                    style={{ width: `${Math.min(Math.abs(summary.attribution.accruedPercent), 100)}%` }}
                  />
                </div>
              </div>

              <div className="pnl-attribution-item">
                <div className="pnl-attribution-item__header">
                  <span className="pnl-attribution-item__label">Roll/Carry</span>
                  <span className="pnl-attribution-item__percent">
                    {formatPercent(summary.attribution.rollPercent)}
                  </span>
                </div>
                <PnLIndicator
                  value={summary.attribution.rollCarryPnL}
                  format="currency"
                  currency="USD"
                  size="medium"
                />
                <div className="pnl-attribution-item__bar">
                  <div
                    className="pnl-attribution-item__bar-fill pnl-attribution-item__bar-fill--roll"
                    style={{ width: `${Math.min(Math.abs(summary.attribution.rollPercent), 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pnl-attribution-total">
              <span className="pnl-attribution-total__label">Total Bond P&L</span>
              <PnLIndicator
                value={summary.attribution.totalPnL}
                format="currency"
                currency="USD"
                size="large"
              />
            </div>
          </div>
        </div>
      )}

      {/* Data Grid */}
      <DataGrid
        data={positions}
        columns={BOND_PNL_COLUMNS}
        rowKey="id"
        loading={isLoading}
        totalsRow={totalsRow}
        emptyMessage="No bond P&L data"
        stickyHeader
        virtualized
      />
    </div>
  );
};

export default BondPnLView;
