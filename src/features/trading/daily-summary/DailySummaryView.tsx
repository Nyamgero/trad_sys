// ============================================
// features/trading/daily-summary/DailySummaryView.tsx
// ============================================

import React from 'react';
import { SummaryCard } from '@/components/ui/SummaryCard';
import { PnLIndicator } from '@/components/ui/PnLIndicator';
import type { DailySummary, AssetClassSummary, TopMover, Alert } from './types';
import { formatCurrency, formatPercent, formatTime } from '@/lib/formatters';
import { ASSET_CLASS_COLORS } from '@/lib/theme';

interface DailySummaryViewProps {
  data: DailySummary;
  onAssetClassClick?: (assetClass: string) => void;
  onPositionClick?: (positionId: string, assetClass: string) => void;
}

export const DailySummaryView: React.FC<DailySummaryViewProps> = ({
  data,
  onAssetClassClick,
  onPositionClick,
}) => {
  return (
    <div className="daily-summary">
      <header className="daily-summary__header">
        <h1 className="daily-summary__title">Daily Summary</h1>
        <span className="daily-summary__timestamp">
          As of {formatTime(data.asOfTime)}
        </span>
      </header>

      {/* Portfolio Total Card */}
      <section className="daily-summary__total">
        <SummaryCard
          title="Total Portfolio"
          value={data.totalMarketValue.amount}
          currency={data.totalMarketValue.currency}
          periods={[
            {
              label: 'Day',
              value: data.totalDayPnL.amount,
              percent: data.totalDayPnLPercent,
            },
            {
              label: 'MTD',
              value: data.totalMtdPnL.amount,
              percent: data.totalMtdPnLPercent,
            },
            {
              label: 'YTD',
              value: data.totalYtdPnL.amount,
              percent: data.totalYtdPnLPercent,
            },
          ]}
          variant="large"
        />
      </section>

      {/* Asset Class Breakdown */}
      <section className="daily-summary__asset-classes">
        <h2 className="daily-summary__section-title">By Asset Class</h2>
        <div className="daily-summary__cards-grid">
          {data.assetClasses.map((ac) => (
            <AssetClassCard
              key={ac.assetClass}
              data={ac}
              onClick={() => onAssetClassClick?.(ac.assetClass)}
            />
          ))}
        </div>
      </section>

      {/* Top Movers */}
      <section className="daily-summary__movers">
        <div className="daily-summary__movers-column">
          <h2 className="daily-summary__section-title daily-summary__section-title--positive">
            Top Gainers
          </h2>
          <TopMoversList
            movers={data.topGainers}
            onMoverClick={(m) => onPositionClick?.(m.id, m.assetClass)}
          />
        </div>
        <div className="daily-summary__movers-column">
          <h2 className="daily-summary__section-title daily-summary__section-title--negative">
            Top Losers
          </h2>
          <TopMoversList
            movers={data.topLosers}
            onMoverClick={(m) => onPositionClick?.(m.id, m.assetClass)}
          />
        </div>
      </section>

      {/* Alerts */}
      {data.alerts.length > 0 && (
        <section className="daily-summary__alerts">
          <h2 className="daily-summary__section-title">Alerts</h2>
          <AlertsList alerts={data.alerts} />
        </section>
      )}
    </div>
  );
};

// Asset Class Card Component
interface AssetClassCardProps {
  data: AssetClassSummary;
  onClick?: () => void;
}

const AssetClassCard: React.FC<AssetClassCardProps> = ({ data, onClick }) => {
  const colorClass = ASSET_CLASS_COLORS[data.assetClass] || 'gray';

  return (
    <div
      className={`asset-class-card asset-class-card--${colorClass}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className="asset-class-card__header">
        <span className="asset-class-card__label">
          {data.assetClass.toUpperCase()}
        </span>
        <span className="asset-class-card__count">
          {data.positionCount} positions
        </span>
      </div>

      <div className="asset-class-card__value">
        {formatCurrency(data.marketValue.amount, data.marketValue.currency)}
      </div>

      <div className="asset-class-card__pnl">
        <PnLIndicator
          value={data.dayPnL.amount}
          format="currency"
          currency={data.dayPnL.currency}
          size="medium"
        />
        <PnLIndicator
          value={data.dayPnLPercent}
          format="percent"
          size="small"
          colorMode="text"
        />
      </div>
    </div>
  );
};

// Top Movers List Component
interface TopMoversListProps {
  movers: TopMover[];
  onMoverClick?: (mover: TopMover) => void;
}

const TopMoversList: React.FC<TopMoversListProps> = ({
  movers,
  onMoverClick,
}) => {
  return (
    <ul className="top-movers-list">
      {movers.map((mover, index) => (
        <li
          key={mover.id}
          className="top-movers-list__item"
          onClick={() => onMoverClick?.(mover)}
        >
          <span className="top-movers-list__rank">{index + 1}</span>
          <div className="top-movers-list__info">
            <span className="top-movers-list__symbol">{mover.symbol}</span>
            <span className="top-movers-list__name">{mover.name}</span>
          </div>
          <div className="top-movers-list__pnl">
            <PnLIndicator
              value={mover.dayPnL.amount}
              format="currency"
              currency={mover.dayPnL.currency}
              size="small"
            />
            <PnLIndicator
              value={mover.dayPnLPercent}
              format="percent"
              size="small"
              colorMode="text"
            />
          </div>
        </li>
      ))}
    </ul>
  );
};

// Alerts List Component
interface AlertsListProps {
  alerts: Alert[];
}

const AlertsList: React.FC<AlertsListProps> = ({ alerts }) => {
  return (
    <ul className="alerts-list">
      {alerts.map((alert) => (
        <li
          key={alert.id}
          className={`alerts-list__item alerts-list__item--${alert.severity}`}
        >
          <span className="alerts-list__icon" />
          <span className="alerts-list__message">{alert.message}</span>
          <span className="alerts-list__time">
            {formatTime(alert.timestamp)}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default DailySummaryView;
