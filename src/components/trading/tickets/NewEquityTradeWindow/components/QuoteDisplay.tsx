// ============================================
// NewEquityTradeWindow/components/QuoteDisplay.tsx
// ============================================

import React from 'react';
import clsx from 'clsx';
import { formatNumber, formatCurrency } from '@/lib/formatters';
import type { QuoteData } from '../types';

interface QuoteDisplayProps {
  quote: QuoteData | null;
  currency: string;
  isLoading?: boolean;
}

export const QuoteDisplay: React.FC<QuoteDisplayProps> = ({
  quote,
  currency,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="quote-display quote-display--loading">
        <div className="quote-display__skeleton" />
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="quote-display quote-display--empty">
        <span className="quote-display__placeholder">
          Select a security to view quote data
        </span>
      </div>
    );
  }

  const isPositive = quote.change >= 0;

  return (
    <div className="quote-display">
      <div className="quote-display__row">
        <div className="quote-display__item">
          <span className="quote-display__label">Last</span>
          <span className="quote-display__value quote-display__value--primary">
            {formatCurrency(quote.last, currency)}
          </span>
        </div>
        <div className="quote-display__divider" />
        <div className="quote-display__item">
          <span className="quote-display__label">Bid</span>
          <span className="quote-display__value">
            {formatNumber(quote.bid)}
          </span>
        </div>
        <div className="quote-display__divider" />
        <div className="quote-display__item">
          <span className="quote-display__label">Ask</span>
          <span className="quote-display__value">
            {formatNumber(quote.ask)}
          </span>
        </div>
      </div>
      <div className="quote-display__row">
        <div className="quote-display__item">
          <span className="quote-display__label">Vol</span>
          <span className="quote-display__value">
            {(quote.volume / 1000000).toFixed(1)}M
          </span>
        </div>
        <div className="quote-display__divider" />
        <div className="quote-display__item">
          <span className="quote-display__label">Change</span>
          <span className={clsx(
            'quote-display__value',
            isPositive ? 'quote-display__value--positive' : 'quote-display__value--negative'
          )}>
            {isPositive ? '+' : ''}{quote.changePercent.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuoteDisplay;
