// ============================================
// features/trading/positions/etf/ETFPositionDetail.tsx
// ============================================

import React from 'react';
import { PnLIndicator } from '@/components/ui/PnLIndicator';
import { PriceCell } from '@/components/ui/PriceCell';
import { LiquidityScore } from '@/components/ui/LiquidityScore';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/formatters';
import type { ETFPositionExpanded } from './types';

interface ETFPositionDetailProps {
  position: ETFPositionExpanded;
  onClose?: () => void;
}

export const ETFPositionDetail: React.FC<ETFPositionDetailProps> = ({
  position,
  onClose,
}) => {
  return (
    <div className="position-detail position-detail--etf">
      {/* Header */}
      <header className="position-detail__header">
        <div className="position-detail__title-group">
          <h2 className="position-detail__symbol">{position.symbol}</h2>
          <span className="position-detail__name">{position.name}</span>
          <span className="position-detail__badge">{position.strategy}</span>
        </div>
        <button className="position-detail__close" onClick={onClose}>
          ×
        </button>
      </header>

      {/* Price & NAV Section */}
      <section className="position-detail__section">
        <h3 className="position-detail__section-title">Price & NAV</h3>
        <div className="position-detail__grid position-detail__grid--3col">
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
            <span className="position-detail__label">NAV</span>
            <span className="position-detail__value">
              {formatCurrency(position.nav, position.currency)}
            </span>
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Premium/Discount</span>
            <PnLIndicator
              value={position.premiumDiscount}
              format="percent"
              size="medium"
              invertColors
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
            <span className="position-detail__label">Expense Ratio</span>
            <span className="position-detail__value">
              {formatPercent(position.expenseRatio)}
            </span>
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">AUM</span>
            <span className="position-detail__value">
              {formatCurrency(position.aum, position.currency)}
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
            <span className="position-detail__label">Holdings Count</span>
            <span className="position-detail__value">
              {position.holdingsCount}
            </span>
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Issuer</span>
            <span className="position-detail__value">{position.issuer}</span>
          </div>
          <div className="position-detail__field">
            <span className="position-detail__label">Index Tracked</span>
            <span className="position-detail__value">
              {position.indexTracked || 'N/A'}
            </span>
          </div>
        </div>
      </section>

      {/* Top Holdings Section */}
      <section className="position-detail__section">
        <h3 className="position-detail__section-title">Top Holdings</h3>
        <table className="position-detail__table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Name</th>
              <th className="text-right">Weight</th>
              <th className="text-right">Day Chg</th>
            </tr>
          </thead>
          <tbody>
            {position.topHoldings.slice(0, 10).map((holding) => (
              <tr key={holding.symbol}>
                <td>{holding.symbol}</td>
                <td>{holding.name}</td>
                <td className="text-right">{formatPercent(holding.weight)}</td>
                <td className="text-right">
                  <PnLIndicator
                    value={holding.dayChangePercent}
                    format="percent"
                    size="small"
                    colorMode="text"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Sector Allocation Section */}
      <section className="position-detail__section">
        <h3 className="position-detail__section-title">Sector Allocation</h3>
        <div className="position-detail__allocation-bars">
          {position.sectorAllocation.map((sector) => (
            <div key={sector.sector} className="allocation-bar">
              <div className="allocation-bar__label">
                <span>{sector.sector}</span>
                <span>{formatPercent(sector.weight)}</span>
              </div>
              <div className="allocation-bar__track">
                <div
                  className="allocation-bar__fill"
                  style={{ width: `${sector.weight}%` }}
                />
              </div>
            </div>
          ))}
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
            <span className="position-detail__label">Tracking Error</span>
            <span className="position-detail__value">
              {position.trackingError.toFixed(2)}%
            </span>
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
            <span className="position-detail__label">Avg Daily Volume</span>
            <span className="position-detail__value">
              {formatNumber(position.avgDailyVolume)}
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

export default ETFPositionDetail;
