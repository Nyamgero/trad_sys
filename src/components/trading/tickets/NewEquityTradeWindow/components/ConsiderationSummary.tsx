// ============================================
// NewEquityTradeWindow/components/ConsiderationSummary.tsx
// ============================================

import React from 'react';
import clsx from 'clsx';
import { formatCurrency } from '@/lib/formatters';
import type { TradeSide } from '../types';

interface ConsiderationSummaryProps {
  grossConsideration: number;
  commission: number;
  sttTax: number;
  otherFees: number;
  netConsideration: number;
  totalCosts: number;
  costPercentage: number;
  currency: string;
  side: TradeSide;
}

export const ConsiderationSummary: React.FC<ConsiderationSummaryProps> = ({
  grossConsideration,
  commission,
  sttTax,
  otherFees,
  netConsideration,
  totalCosts,
  costPercentage,
  currency,
  side,
}) => {
  const isBuy = side === 'BUY' || side === 'BUY_TO_COVER';
  const operator = isBuy ? '+' : '-';

  return (
    <div className="consideration-summary">
      <div className="consideration-summary__header">
        <span className="consideration-summary__icon">&#128202;</span>
        <span className="consideration-summary__title">COST BREAKDOWN</span>
      </div>

      <div className="consideration-summary__body">
        <div className="consideration-summary__row">
          <span className="consideration-summary__label">Gross Consideration</span>
          <span className="consideration-summary__value">
            {formatCurrency(grossConsideration, currency)}
          </span>
        </div>

        <div className="consideration-summary__row consideration-summary__row--indent">
          <span className="consideration-summary__label">
            {operator} Commission
          </span>
          <span className="consideration-summary__value">
            {formatCurrency(commission, currency)}
          </span>
        </div>

        {sttTax > 0 && (
          <div className="consideration-summary__row consideration-summary__row--indent">
            <span className="consideration-summary__label">
              {operator} STT Tax (0.25%)
            </span>
            <span className="consideration-summary__value">
              {formatCurrency(sttTax, currency)}
            </span>
          </div>
        )}

        <div className="consideration-summary__row consideration-summary__row--indent">
          <span className="consideration-summary__label">
            {operator} Other Fees
          </span>
          <span className="consideration-summary__value">
            {formatCurrency(otherFees, currency)}
          </span>
        </div>

        <div className="consideration-summary__divider" />

        <div className="consideration-summary__row consideration-summary__row--total">
          <span className="consideration-summary__label">NET CONSIDERATION</span>
          <span className={clsx(
            'consideration-summary__value',
            'consideration-summary__value--total',
            isBuy ? 'consideration-summary__value--buy' : 'consideration-summary__value--sell'
          )}>
            {formatCurrency(netConsideration, currency)}
          </span>
        </div>

        <div className="consideration-summary__footer">
          Total Costs: {formatCurrency(totalCosts, currency)} ({costPercentage.toFixed(2)}% of gross)
        </div>
      </div>
    </div>
  );
};

export default ConsiderationSummary;
