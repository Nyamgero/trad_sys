// ============================================
// components/ui/PriceCell/types.ts
// ============================================

export type PriceChangeDirection = 'up' | 'down' | 'unchanged';

export type PriceCellSize = 'xs' | 'sm' | 'md' | 'lg';

export type PriceCellVariant =
  | 'default' // Simple price display
  | 'with-change' // Price with change indicator
  | 'bid-ask' // Bid/Ask spread display
  | 'ohlc'; // Open/High/Low/Close

export interface PriceCellProps {
  /** Current/last price */
  price: number | null | undefined;

  /** Previous price for change calculation */
  previousPrice?: number;

  /** Currency code */
  currency?: string;

  /** Number of decimal places (auto-detected if not specified) */
  decimals?: number;

  /** Size variant */
  size?: PriceCellSize;

  /** Display variant */
  variant?: PriceCellVariant;

  /** Bid price (for bid-ask variant) */
  bid?: number;

  /** Ask price (for bid-ask variant) */
  ask?: number;

  /** Show spread (for bid-ask variant) */
  showSpread?: boolean;

  /** Spread format: percent or absolute */
  spreadFormat?: 'percent' | 'absolute' | 'pips';

  /** OHLC data (for ohlc variant) */
  ohlc?: {
    open: number;
    high: number;
    low: number;
    close: number;
  };

  /** Enable flash animation on change */
  flashOnChange?: boolean;

  /** Flash duration in ms */
  flashDuration?: number;

  /** Show currency symbol */
  showCurrency?: boolean;

  /** Show change arrow */
  showChangeArrow?: boolean;

  /** Timestamp of last update */
  timestamp?: number | string | Date;

  /** Show timestamp */
  showTimestamp?: boolean;

  /** Timestamp format */
  timestampFormat?: 'time' | 'datetime' | 'relative';

  /** Additional CSS classes */
  className?: string;

  /** Stale data threshold in ms (dims display if exceeded) */
  staleThreshold?: number;
}

export interface BidAskCellProps {
  bid: number;
  ask: number;
  decimals?: number;
  size?: PriceCellSize;
  showSpread?: boolean;
  spreadFormat?: 'percent' | 'absolute' | 'pips';
  midPrice?: number;
  flashOnChange?: boolean;
  className?: string;
}
