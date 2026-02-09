// ============================================
// components/ui/PnLIndicator/PnLIndicator.tsx
// ============================================

import { FC, useMemo, useEffect, useState, useRef } from 'react';
import { ChevronUp, ChevronDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PnLIndicatorProps, PnLDirection, PnLSize } from './types';

// Size configurations
const SIZE_CONFIG: Record<
  PnLSize,
  { text: string; icon: number; padding: string }
> = {
  xs: { text: 'text-xs', icon: 10, padding: 'px-1 py-0.5' },
  sm: { text: 'text-sm', icon: 12, padding: 'px-1.5 py-0.5' },
  md: { text: 'text-base', icon: 14, padding: 'px-2 py-1' },
  lg: { text: 'text-lg', icon: 16, padding: 'px-2.5 py-1' },
  xl: { text: 'text-xl', icon: 20, padding: 'px-3 py-1.5' },
};

// Color configurations
const COLOR_CONFIG = {
  text: {
    positive: 'text-emerald-600 dark:text-emerald-500',
    negative: 'text-red-600 dark:text-red-500',
    neutral: 'text-gray-500 dark:text-gray-400',
  },
  background: {
    positive:
      'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
    negative: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400',
    neutral: 'bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-400',
  },
  badge: {
    positive: 'bg-emerald-500 text-white',
    negative: 'bg-red-500 text-white',
    neutral: 'bg-gray-400 text-white',
  },
};

export const PnLIndicator: FC<PnLIndicatorProps> = ({
  value,
  format = 'currency',
  currency = 'USD',
  decimals,
  size = 'md',
  showSign = true,
  showIcon = false,
  iconPosition = 'left',
  invertColors = false,
  colorMode = 'text',
  animate = true,
  flashDuration = 300,
  neutralThreshold = 0,
  compact = false,
  className,
  inline = true,
}) => {
  const [isFlashing, setIsFlashing] = useState(false);
  const [flashDirection, setFlashDirection] = useState<PnLDirection>('neutral');
  const previousValueRef = useRef<number | null | undefined>(value);

  // Determine direction
  const direction = useMemo((): PnLDirection => {
    if (value === null || value === undefined) return 'neutral';
    if (Math.abs(value) <= neutralThreshold) return 'neutral';

    const dir = value > 0 ? 'positive' : 'negative';
    return invertColors
      ? dir === 'positive'
        ? 'negative'
        : 'positive'
      : dir;
  }, [value, neutralThreshold, invertColors]);

  // Handle flash animation on value change
  useEffect(() => {
    if (!animate || value === previousValueRef.current) {
      previousValueRef.current = value;
      return;
    }

    const prevValue = previousValueRef.current ?? 0;
    const currValue = value ?? 0;

    if (prevValue !== currValue) {
      const changeDirection: PnLDirection =
        currValue > prevValue ? 'positive' : 'negative';
      setFlashDirection(
        invertColors
          ? changeDirection === 'positive'
            ? 'negative'
            : 'positive'
          : changeDirection
      );
      setIsFlashing(true);

      const timeout = setTimeout(() => {
        setIsFlashing(false);
      }, flashDuration);

      previousValueRef.current = value;
      return () => clearTimeout(timeout);
    }
  }, [value, animate, flashDuration, invertColors]);

  // Format the value
  const formattedValue = useMemo(() => {
    if (value === null || value === undefined) return '—';

    const absValue = Math.abs(value);
    let formatted: string;

    switch (format) {
      case 'currency':
        formatted = formatCurrencyValue(absValue, currency, decimals, compact);
        break;
      case 'percent':
        formatted = formatPercentValue(absValue, decimals);
        break;
      case 'bps':
        formatted = formatBpsValue(absValue, decimals);
        break;
      case 'pips':
        formatted = formatPipsValue(absValue, decimals);
        break;
      case 'number':
      default:
        formatted = formatNumberValue(absValue, decimals, compact);
        break;
    }

    // Add sign prefix
    if (showSign && value !== 0) {
      const sign = value > 0 ? '+' : '−'; // Using proper minus sign
      formatted = `${sign}${formatted}`;
    } else if (value < 0 && !showSign) {
      formatted = `−${formatted}`;
    }

    return formatted;
  }, [value, format, currency, decimals, compact, showSign]);

  // Get icon component
  const Icon = useMemo(() => {
    if (!showIcon) return null;

    switch (direction) {
      case 'positive':
        return ChevronUp;
      case 'negative':
        return ChevronDown;
      default:
        return Minus;
    }
  }, [direction, showIcon]);

  const sizeConfig = SIZE_CONFIG[size];
  const colorClass = COLOR_CONFIG[colorMode][direction];

  // Flash animation class
  const flashClass = isFlashing
    ? flashDirection === 'positive'
      ? 'animate-flash-positive'
      : 'animate-flash-negative'
    : '';

  return (
    <span
      className={cn(
        'pnl-indicator',
        'font-medium tabular-nums',
        inline ? 'inline-flex' : 'flex',
        'items-center gap-0.5',
        sizeConfig.text,
        colorClass,
        colorMode !== 'text' && 'rounded',
        colorMode !== 'text' && sizeConfig.padding,
        flashClass,
        className
      )}
      data-direction={direction}
      data-value={value}
    >
      {showIcon && Icon && iconPosition === 'left' && (
        <Icon size={sizeConfig.icon} className="flex-shrink-0" />
      )}

      <span className="pnl-value">{formattedValue}</span>

      {showIcon && Icon && iconPosition === 'right' && (
        <Icon size={sizeConfig.icon} className="flex-shrink-0" />
      )}
    </span>
  );
};

// ============================================
// Formatting Helpers
// ============================================

function formatCurrencyValue(
  value: number,
  currency: string,
  decimals?: number,
  compact?: boolean
): string {
  if (compact && value >= 1_000_000_000) {
    return `${getCurrencySymbol(currency)}${(value / 1_000_000_000).toFixed(decimals ?? 1)}B`;
  }
  if (compact && value >= 1_000_000) {
    return `${getCurrencySymbol(currency)}${(value / 1_000_000).toFixed(decimals ?? 1)}M`;
  }
  if (compact && value >= 1_000) {
    return `${getCurrencySymbol(currency)}${(value / 1_000).toFixed(decimals ?? 1)}K`;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals ?? 0,
    maximumFractionDigits: decimals ?? 0,
  }).format(value);
}

function formatPercentValue(value: number, decimals?: number): string {
  return `${value.toFixed(decimals ?? 2)}%`;
}

function formatBpsValue(value: number, decimals?: number): string {
  return `${value.toFixed(decimals ?? 1)} bps`;
}

function formatPipsValue(value: number, decimals?: number): string {
  return `${value.toFixed(decimals ?? 1)} pips`;
}

function formatNumberValue(
  value: number,
  decimals?: number,
  compact?: boolean
): string {
  if (compact && value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(decimals ?? 1)}B`;
  }
  if (compact && value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(decimals ?? 1)}M`;
  }
  if (compact && value >= 1_000) {
    return `${(value / 1_000).toFixed(decimals ?? 1)}K`;
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals ?? 0,
    maximumFractionDigits: decimals ?? 2,
  }).format(value);
}

function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    ZAR: 'R',
    KES: 'KSh',
  };
  return symbols[currency] || `${currency} `;
}
