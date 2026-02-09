// ============================================
// features/trading/positions/fx/FXPositionDetail.tsx
// ============================================

import React from 'react';
import { PnLIndicator } from '@/components/ui/PnLIndicator';
import { PriceCell } from '@/components/ui/PriceCell';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/formatters';
import type { FXPositionExpanded } from './types';

interface FXPositionDetailProps {
  position: FXPositionExpanded;
  onClose?: () => void;
}

export const FXPositionDetail: React.FC<FXPositionDetailProps> = ({
  position,
  onClose,
}) => {
  return (
    <div className="position-detail position-detail--fx">
      {/* Header */}
      <header className="position-detail__header">
        <div className="position-detail__title-group">
          <h2 className="position-detail__symbol">{position.ccyPair}</h2>
          <span className={`position-detail__direction position-detail__direction--${position.direction}`}>
            {position.direction.toUpperCase()}
          </span>
          <span className="position-detail__badge">{position.productType}</span>
        </div>
        <button className="position-detail__close" onClick={onClose}>
          ×
        </button>
      </header>

      {/* Rate Section */}
      <section className="position-detail__section">
        <h3 className="position-detail__section-title">Rates</h3>
        <div className="position-detail__grid position-detail__grid--3col">
          <div className="position-detail__field">
            <span className="position-detail__label">Spot Rate</span>
            <PriceCell
              value={position.spotRate}
              decimals={5}
              variant="default"
            />
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Bid / Ask</span>
            <PriceCell
              value={position.bid}
              bidAsk={{ bid: position.bid, ask: position.ask }}
              decimals={5}
              variant="bid-ask"
            />
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Spread (pips)</span>
            <span className="position-detail__value">
              {position.spreadPips.toFixed(1)}
            </span>
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Avg Entry Rate</span>
            <span className="position-detail__value">
              {position.avgRate.toFixed(5)}
            </span>
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Day Change (pips)</span>
            <PnLIndicator
              value={position.dayChangePips}
              format="pips"
              size="medium"
            />
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Day Change %</span>
            <PnLIndicator
              value={position.dayChangePercent}
              format="percent"
              size="medium"
            />
          </div>
        </div>
      </section>

      {/* Position Section */}
      <section className="position-detail__section">
        <h3 className="position-detail__section-title">Position</h3>
        <div className="position-detail__grid position-detail__grid--2col">
          <div className="position-detail__field">
            <span className="position-detail__label">Notional (Base)</span>
            <span className="position-detail__value">
              {formatCurrency(position.notionalBase, position.baseCurrency)}
            </span>
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Notional (Term)</span>
            <span className="position-detail__value">
              {formatCurrency(position.notionalTerm, position.termCurrency)}
            </span>
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">MTM Value</span>
            <span className="position-detail__value">
              {formatCurrency(position.mtmValue.amount, position.mtmValue.currency)}
            </span>
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Margin Required</span>
            <span className="position-detail__value">
              {formatCurrency(position.marginRequired.amount, position.marginRequired.currency)}
            </span>
          </div>
        </div>
      </section>

      {/* Forward Points (if applicable) */}
      {position.productType === 'forward' && position.forwardPoints !== undefined && (
        <section className="position-detail__section">
          <h3 className="position-detail__section-title">Forward Details</h3>
          <div className="position-detail__grid position-detail__grid--3col">
            <div className="position-detail__field">
              <span className="position-detail__label">Value Date</span>
              <span className="position-detail__value">{position.valueDate}</span>
            </div>
            <div className="position-detail__field">
              <span className="position-detail__label">Forward Points</span>
              <span className="position-detail__value">
                {position.forwardPoints.toFixed(2)}
              </span>
            </div>
            <div className="position-detail__field">
              <span className="position-detail__label">Forward Rate</span>
              <span className="position-detail__value">
                {position.forwardRate?.toFixed(5) || '-'}
              </span>
            </div>
            <div className="position-detail__field">
              <span className="position-detail__label">Days to Maturity</span>
              <span className="position-detail__value">
                {position.daysToMaturity}
              </span>
            </div>
            <div className="position-detail__field">
              <span className="position-detail__label">Roll Cost (pips)</span>
              <span className="position-detail__value">
                {position.rollCostPips?.toFixed(2) || '-'}
              </span>
            </div>
            <div className="position-detail__field">
              <span className="position-detail__label">Interest Differential</span>
              <span className="position-detail__value">
                {formatPercent(position.interestDifferential || 0)}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* P&L Section */}
      <section className="position-detail__section">
        <h3 className="position-detail__section-title">P&L</h3>
        <div className="position-detail__grid position-detail__grid--3col">
          <div className="position-detail__field">
            <span className="position-detail__label">Day P&L</span>
            <PnLIndicator
              value={position.dayPnL.amount}
              format="currency"
              currency={position.dayPnL.currency}
              size="medium"
            />
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Unrealized P&L</span>
            <PnLIndicator
              value={position.unrealizedPnL.amount}
              format="currency"
              currency={position.unrealizedPnL.currency}
              size="medium"
            />
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Realized P&L</span>
            <PnLIndicator
              value={position.realizedPnL.amount}
              format="currency"
              currency={position.realizedPnL.currency}
              size="medium"
            />
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">MTD P&L</span>
            <PnLIndicator
              value={position.mtdPnL.amount}
              format="currency"
              currency={position.mtdPnL.currency}
              size="medium"
            />
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">YTD P&L</span>
            <PnLIndicator
              value={position.ytdPnL.amount}
              format="currency"
              currency={position.ytdPnL.currency}
              size="medium"
            />
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Total P&L (pips)</span>
            <PnLIndicator
              value={position.totalPnLPips}
              format="pips"
              size="medium"
            />
          </div>
        </div>
      </section>

      {/* Risk Section */}
      <section className="position-detail__section">
        <h3 className="position-detail__section-title">Risk Metrics</h3>
        <div className="position-detail__grid position-detail__grid--3col">
          <div className="position-detail__field">
            <span className="position-detail__label">Value at Risk (1d)</span>
            <span className="position-detail__value">
              {formatCurrency(position.valueAtRisk1d.amount, position.valueAtRisk1d.currency)}
            </span>
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Delta (1pip)</span>
            <span className="position-detail__value">
              {formatCurrency(position.delta1pip.amount, position.delta1pip.currency)}
            </span>
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Implied Vol</span>
            <span className="position-detail__value">
              {formatPercent(position.impliedVol)}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FXPositionDetail;
