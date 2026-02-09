// ============================================
// features/trading/positions/bond/BondPositionDetail.tsx
// ============================================

import React from 'react';
import { PnLIndicator } from '@/components/ui/PnLIndicator';
import { PriceCell } from '@/components/ui/PriceCell';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/formatters';
import type { BondPositionExpanded } from './types';

interface BondPositionDetailProps {
  position: BondPositionExpanded;
  onClose?: () => void;
}

export const BondPositionDetail: React.FC<BondPositionDetailProps> = ({
  position,
  onClose,
}) => {
  return (
    <div className="position-detail position-detail--bond">
      {/* Header */}
      <header className="position-detail__header">
        <div className="position-detail__title-group">
          <h2 className="position-detail__symbol">{position.isin}</h2>
          <span className="position-detail__name">{position.name}</span>
          <span className="position-detail__badge">{position.bondType}</span>
          <span className="position-detail__rating">{position.rating}</span>
        </div>
        <button className="position-detail__close" onClick={onClose}>
          ×
        </button>
      </header>

      {/* Price Section */}
      <section className="position-detail__section">
        <h3 className="position-detail__section-title">Price & Yield</h3>
        <div className="position-detail__grid position-detail__grid--3col">
          <div className="position-detail__field">
            <span className="position-detail__label">Clean Price</span>
            <PriceCell
              value={position.cleanPrice}
              decimals={4}
              currency={position.currency}
            />
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Dirty Price</span>
            <span className="position-detail__value">
              {position.dirtyPrice.toFixed(4)}
            </span>
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Accrued Interest</span>
            <span className="position-detail__value">
              {position.accruedInterest.toFixed(4)}
            </span>
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">YTM</span>
            <span className="position-detail__value position-detail__value--highlight">
              {formatPercent(position.ytm)}
            </span>
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Z-Spread</span>
            <span className="position-detail__value">
              {position.zSpread.toFixed(1)} bps
            </span>
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Spread to Benchmark</span>
            <span className="position-detail__value">
              {position.spreadToBenchmark.toFixed(1)} bps
            </span>
          </div>
        </div>
      </section>

      {/* Bond Details Section */}
      <section className="position-detail__section">
        <h3 className="position-detail__section-title">Bond Details</h3>
        <div className="position-detail__grid position-detail__grid--3col">
          <div className="position-detail__field">
            <span className="position-detail__label">Issuer</span>
            <span className="position-detail__value">{position.issuer}</span>
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Coupon</span>
            <span className="position-detail__value">
              {formatPercent(position.coupon)} ({position.couponFrequency})
            </span>
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Maturity Date</span>
            <span className="position-detail__value">{position.maturityDate}</span>
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Issue Date</span>
            <span className="position-detail__value">{position.issueDate}</span>
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Rating</span>
            <span className="position-detail__value">
              {position.rating} ({position.ratingAgency})
            </span>
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Sector</span>
            <span className="position-detail__value">{position.sector}</span>
          </div>
        </div>
      </section>

      {/* Position Section */}
      <section className="position-detail__section">
        <h3 className="position-detail__section-title">Position</h3>
        <div className="position-detail__grid position-detail__grid--3col">
          <div className="position-detail__field">
            <span className="position-detail__label">Face Value</span>
            <span className="position-detail__value">
              {formatCurrency(position.faceValue, position.currency)}
            </span>
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Quantity</span>
            <span className="position-detail__value">
              {formatNumber(position.quantity)}
            </span>
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Avg Price</span>
            <span className="position-detail__value">
              {position.avgPrice.toFixed(4)}
            </span>
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Market Value</span>
            <span className="position-detail__value">
              {formatCurrency(position.marketValueBase.amount, position.marketValueBase.currency)}
            </span>
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Day Change (bps)</span>
            <PnLIndicator
              value={position.dayChangeBps}
              format="bps"
              size="medium"
            />
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Currency</span>
            <span className="position-detail__value">{position.currency}</span>
          </div>
        </div>
      </section>

      {/* Risk Metrics Section */}
      <section className="position-detail__section">
        <h3 className="position-detail__section-title">Risk Metrics</h3>
        <div className="position-detail__grid position-detail__grid--3col">
          <div className="position-detail__field">
            <span className="position-detail__label">Duration</span>
            <span className="position-detail__value position-detail__value--highlight">
              {position.duration.toFixed(2)}
            </span>
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Modified Duration</span>
            <span className="position-detail__value">
              {position.modifiedDuration.toFixed(2)}
            </span>
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Convexity</span>
            <span className="position-detail__value">
              {position.convexity.toFixed(2)}
            </span>
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">DV01</span>
            <span className="position-detail__value">
              {formatCurrency(position.dv01, position.currency)}
            </span>
          </div>
        </div>
      </section>

      {/* Key Rate DV01 Section */}
      <section className="position-detail__section">
        <h3 className="position-detail__section-title">Key Rate DV01</h3>
        <div className="position-detail__krd-grid">
          {position.keyRateDV01.map((krd) => (
            <div key={krd.tenor} className="position-detail__krd-item">
              <span className="position-detail__krd-tenor">{krd.tenor}</span>
              <span className="position-detail__krd-value">
                {formatCurrency(krd.value, position.currency)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* P&L Section */}
      <section className="position-detail__section">
        <h3 className="position-detail__section-title">P&L Attribution</h3>
        <div className="position-detail__grid position-detail__grid--3col">
          <div className="position-detail__field">
            <span className="position-detail__label">Price P&L</span>
            <PnLIndicator
              value={position.pricePnL.amount}
              format="currency"
              currency={position.pricePnL.currency}
              size="medium"
            />
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Coupon Received</span>
            <PnLIndicator
              value={position.couponReceived.amount}
              format="currency"
              currency={position.couponReceived.currency}
              size="medium"
            />
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Accrued P&L</span>
            <PnLIndicator
              value={position.accruedPnL.amount}
              format="currency"
              currency={position.accruedPnL.currency}
              size="medium"
            />
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Roll P&L</span>
            <PnLIndicator
              value={position.rollPnL.amount}
              format="currency"
              currency={position.rollPnL.currency}
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
            <span className="position-detail__label">Total P&L</span>
            <PnLIndicator
              value={position.totalPnL.amount}
              format="currency"
              currency={position.totalPnL.currency}
              size="medium"
            />
          </div>
        </div>
      </section>

      {/* Cash Flows Section */}
      <section className="position-detail__section">
        <h3 className="position-detail__section-title">Upcoming Cash Flows</h3>
        <div className="position-detail__grid position-detail__grid--3col">
          <div className="position-detail__field">
            <span className="position-detail__label">Next Coupon Date</span>
            <span className="position-detail__value">{position.nextCouponDate}</span>
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Next Coupon Amount</span>
            <span className="position-detail__value">
              {formatCurrency(position.nextCouponAmount, position.currency)}
            </span>
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Remaining Coupons</span>
            <span className="position-detail__value">{position.remainingCoupons}</span>
          </div>
        </div>
      </section>

      {/* Liquidity Section */}
      <section className="position-detail__section">
        <h3 className="position-detail__section-title">Liquidity</h3>
        <div className="position-detail__grid position-detail__grid--3col">
          <div className="position-detail__field">
            <span className="position-detail__label">Est. Daily Volume</span>
            <span className="position-detail__value">
              {formatCurrency(position.estDailyVolume, position.currency)}
            </span>
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Position % Volume</span>
            <span className="position-detail__value">
              {formatPercent(position.positionPctVolume)}
            </span>
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Bid-Ask Spread (bps)</span>
            <span className="position-detail__value">
              {position.bidAskSpreadBps.toFixed(1)}
            </span>
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Spread Cost</span>
            <span className="position-detail__value">
              {formatCurrency(position.spreadCost, position.currency)}
            </span>
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Dealer Count</span>
            <span className="position-detail__value">{position.dealerCount}</span>
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Last Trade Date</span>
            <span className="position-detail__value">{position.lastTradeDate}</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BondPositionDetail;
