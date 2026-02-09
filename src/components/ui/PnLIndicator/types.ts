// ============================================
// components/ui/PnLIndicator/types.ts
// ============================================

export type PnLDirection = 'positive' | 'negative' | 'neutral';

export type PnLFormat =
  | 'currency'
  | 'percent'
  | 'number'
  | 'bps' // basis points
  | 'pips'; // FX pips

export type PnLSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface PnLIndicatorProps {
  /** The numeric value to display */
  value: number | null | undefined;

  /** How to format the value */
  format?: PnLFormat;

  /** Currency code for currency format */
  currency?: string;

  /** Number of decimal places */
  decimals?: number;

  /** Size variant */
  size?: PnLSize;

  /** Show +/- prefix */
  showSign?: boolean;

  /** Show directional arrow/icon */
  showIcon?: boolean;

  /** Icon position */
  iconPosition?: 'left' | 'right';

  /** Invert colors (red for positive, green for negative) */
  invertColors?: boolean;

  /** Use background color instead of text color */
  colorMode?: 'text' | 'background' | 'badge';

  /** Animate on value change */
  animate?: boolean;

  /** Flash duration in ms */
  flashDuration?: number;

  /** Custom neutral threshold (values within this range show as neutral) */
  neutralThreshold?: number;

  /** Compact large numbers (1.5M instead of 1,500,000) */
  compact?: boolean;

  /** Additional CSS classes */
  className?: string;

  /** Render as inline or block */
  inline?: boolean;
}
