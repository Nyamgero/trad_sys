// ============================================
// features/trading/positions/equity/EquityPositionDetail.tsx
// ============================================

import React from 'react';
import { PnLIndicator } from '@/components/ui/PnLIndicator';
import { PriceCell } from '@/components/ui/PriceCell';
import { LiquidityScore } from '@/components/ui/LiquidityScore';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/formatters';
import type { EquityPositionExpanded } from './types';

interface EquityPositionDetailProps {
  position: EquityPositionExpanded;
  onClose?: () => void;
}

export const EquityPositionDetail: React.FC<EquityPositionDetailProps> = ({
  position,
  onClose,
}) => {
  return (
    <div className="position-detail position-detail--equity">
      {/* Header */}
      <header className="position-detail__header">
        <div className="position-detail__title-group">
          <h2 className="position-detail__symbol">{position.symbol}</h2>
          <span className="position-detail__name">{position.name}</span>
          <span className="position-detail__exchange">{position.exchange}</span>
        </div>
        <button className="position-detail__close" onClick={onClose}>
          ×
        </button>
      </header>

      {/* Price Section */}
      <section className="position-detail__section">
        <h3 className="position-detail__section-title">Price</h3>
        <div className="position-detail__grid position-detail__grid--2col">
          <div className="position-detail__field">
            <span className="position-detail__label">Last Price</span>
            <PriceCell
              value={position.lastPrice}
              change={{
                absolute: position.dayChange.absolute,
                percent: position.dayChange.percent,
                direction: position.dayChange.direction,
              }}
              currency={position.currency}
              variant="with-change"
            />
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">VWAP</span>
            <PriceCell
              value={position.vwap}
              currency={position.currency}
            />
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Bid / Ask</span>
            <PriceCell
              value={position.bid}
              bidAsk={{ bid: position.bid, ask: position.ask }}
              currency={position.currency}
              variant="bid-ask"
            />
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Day Range</span>
            <span className="position-detail__value">
              {formatCurrency(position.dayLow, position.currency)} - {formatCurrency(position.dayHigh, position.currency)}
            </span>
          </div>
        </div>
      </section>

      {/* Position Section */}
      <section className="position-detail__section">
        <h3 className="position-detail__section-title">Position</h3>
        <div className="position-detail__grid position-detail__grid--3col">
          <div className="position-detail__field">
            <span className="position-detail__label">Quantity</span>
            <span className="position-detail__value">
              {formatNumber(position.quantity)}
            </span>
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Avg Cost</span>
            <span className="position-detail__value">
              {formatCurrency(position.avgCost, position.currency)}
            </span>
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Market Value</span>
            <span className="position-detail__value">
              {formatCurrency(position.marketValueBase.amount, position.marketValueBase.currency)}
            </span>
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Cost Basis</span>
            <span className="position-detail__value">
              {formatCurrency(position.costBasis.amount, position.costBasis.currency)}
            </span>
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Weight</span>
            <span className="position-detail__value">
              {formatPercent(position.portfolioWeight)}
            </span>
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Sector</span>
            <span className="position-detail__value">{position.sector}</span>
          </div>
        </div>
      </section>

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

      {/* Liquidity Section */}
      <section className="position-detail__section">
        <h3 className="position-detail__section-title">Liquidity</h3>
        <div className="position-detail__grid position-detail__grid--3col">
          <div className="position-detail__field">
            <span className="position-detail__label">Score</span>
            <LiquidityScore score={position.liquidityScore} showLabel />
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Est. Daily Volume</span>
            <span className="position-detail__value">
              {formatNumber(position.estDailyVolume)}
            </span>
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Position % Volume</span>
            <span className="position-detail__value">
              {formatPercent(position.positionPctVolume)}
            </span>
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Spread Cost</span>
            <span className="position-detail__value">
              {formatCurrency(position.spreadCost, position.currency)}
            </span>
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Days to Liquidate</span>
            <span className="position-detail__value">
              {position.daysToLiquidate.toFixed(1)}
            </span>
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Bid-Ask Spread</span>
            <span className="position-detail__value">
              {position.bidAskSpreadBps.toFixed(1)} bps
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EquityPositionDetail;
