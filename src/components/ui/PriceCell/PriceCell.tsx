// ============================================
// components/ui/PriceCell/PriceCell.tsx
// ============================================

import { FC, useMemo, useEffect, useState, useRef, memo } from 'react';
import { ArrowUp, ArrowDown, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PriceCellProps, PriceChangeDirection, PriceCellSize } from './types';

// Size configurations
const SIZE_CONFIG: Record<
  PriceCellSize,
  {
    text: string;
    icon: number;
    secondary: string;
  }
> = {
  xs: { text: 'text-xs', icon: 10, secondary: 'text-[10px]' },
  sm: { text: 'text-sm', icon: 12, secondary: 'text-xs' },
  md: { text: 'text-base', icon: 14, secondary: 'text-sm' },
  lg: { text: 'text-lg', icon: 16, secondary: 'text-base' },
};

// Flash animation colors
const FLASH_COLORS = {
  up: 'animate-price-flash-up',
  down: 'animate-price-flash-down',
  unchanged: '',
};

export const PriceCell: FC<PriceCellProps> = memo(
  ({
    price,
    previousPrice,
    currency = 'USD',
    decimals,
    size = 'md',
    variant = 'default',
    bid,
    ask,
    showSpread = true,
    spreadFormat = 'percent',
    ohlc,
    flashOnChange = true,
    flashDuration = 300,
    showCurrency = false,
    showChangeArrow = true,
    timestamp,
    showTimestamp = false,
    timestampFormat = 'time',
    className,
    staleThreshold,
  }) => {
    const [flashClass, setFlashClass] = useState('');
    const [changeDirection, setChangeDirection] =
      useState<PriceChangeDirection>('unchanged');
    const previousPriceRef = useRef<number | null | undefined>(price);
    const flashTimeoutRef = useRef<NodeJS.Timeout>();

    // Auto-detect decimals based on price magnitude
    const effectiveDecimals = useMemo(() => {
      if (decimals !== undefined) return decimals;
      if (price === null || price === undefined) return 2;

      // For FX pairs, typically 4-5 decimals
      if (price < 10 && price > 0.0001) return 4;
      // For most prices
      if (price < 1000) return 2;
      // For large prices
      return 0;
    }, [price, decimals]);

    // Determine change direction
    useEffect(() => {
      const prevPrice = previousPrice ?? previousPriceRef.current;

      if (
        price !== null &&
        price !== undefined &&
        prevPrice !== null &&
        prevPrice !== undefined
      ) {
        if (price > prevPrice) {
          setChangeDirection('up');
        } else if (price < prevPrice) {
          setChangeDirection('down');
        } else {
          setChangeDirection('unchanged');
        }
      }

      previousPriceRef.current = price;
    }, [price, previousPrice]);

    // Handle flash animation
    useEffect(() => {
      if (!flashOnChange || changeDirection === 'unchanged') return;

      // Clear any existing timeout
      if (flashTimeoutRef.current) {
        clearTimeout(flashTimeoutRef.current);
      }

      setFlashClass(FLASH_COLORS[changeDirection]);

      flashTimeoutRef.current = setTimeout(() => {
        setFlashClass('');
      }, flashDuration);

      return () => {
        if (flashTimeoutRef.current) {
          clearTimeout(flashTimeoutRef.current);
        }
      };
    }, [price, changeDirection, flashOnChange, flashDuration]);

    // Check if data is stale
    const isStale = useMemo(() => {
      if (!staleThreshold || !timestamp) return false;

      const updateTime =
        typeof timestamp === 'number'
          ? timestamp
          : new Date(timestamp).getTime();

      return Date.now() - updateTime > staleThreshold;
    }, [timestamp, staleThreshold]);

    // Format the price
    const formattedPrice = useMemo(() => {
      if (price === null || price === undefined) return '—';

      const formatted = price.toLocaleString('en-US', {
        minimumFractionDigits: effectiveDecimals,
        maximumFractionDigits: effectiveDecimals,
      });

      if (showCurrency) {
        return `${getCurrencySymbol(currency)}${formatted}`;
      }

      return formatted;
    }, [price, effectiveDecimals, showCurrency, currency]);

    // Format timestamp
    const formattedTimestamp = useMemo(() => {
      if (!showTimestamp || !timestamp) return null;

      const date =
        typeof timestamp === 'number' ? new Date(timestamp) : new Date(timestamp);

      switch (timestampFormat) {
        case 'relative':
          return formatRelativeTime(date);
        case 'datetime':
          return date.toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            month: 'short',
            day: 'numeric',
          });
        case 'time':
        default:
          return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          });
      }
    }, [timestamp, showTimestamp, timestampFormat]);

    const sizeConfig = SIZE_CONFIG[size];

    // Render based on variant
    switch (variant) {
      case 'bid-ask':
        return (
          <BidAskDisplay
            bid={bid ?? 0}
            ask={ask ?? 0}
            decimals={effectiveDecimals}
            size={size}
            showSpread={showSpread}
            spreadFormat={spreadFormat}
            flashClass={flashClass}
            className={className}
          />
        );

      case 'ohlc':
        return (
          <OHLCDisplay
            ohlc={ohlc}
            decimals={effectiveDecimals}
            size={size}
            className={className}
          />
        );

      case 'with-change':
        return (
          <div
            className={cn(
              'price-cell inline-flex items-center gap-1',
              sizeConfig.text,
              isStale && 'opacity-50',
              flashClass,
              className
            )}
          >
            {showChangeArrow && changeDirection !== 'unchanged' && (
              <ChangeArrow direction={changeDirection} size={sizeConfig.icon} />
            )}
            <span
              className={cn(
                'font-mono font-medium tabular-nums',
                changeDirection === 'up' &&
                  'text-emerald-600 dark:text-emerald-500',
                changeDirection === 'down' && 'text-red-600 dark:text-red-500'
              )}
            >
              {formattedPrice}
            </span>
            {showTimestamp && formattedTimestamp && (
              <span className={cn('text-muted-foreground', sizeConfig.secondary)}>
                {formattedTimestamp}
              </span>
            )}
          </div>
        );

      case 'default':
      default:
        return (
          <div
            className={cn(
              'price-cell inline-flex items-center gap-1',
              sizeConfig.text,
              isStale && 'opacity-50',
              flashClass,
              className
            )}
          >
            <span className="font-mono font-medium tabular-nums">
              {formattedPrice}
            </span>
            {showTimestamp && formattedTimestamp && (
              <span
                className={cn(
                  'text-muted-foreground flex items-center gap-0.5',
                  sizeConfig.secondary
                )}
              >
                <Clock size={sizeConfig.icon - 2} />
                {formattedTimestamp}
              </span>
            )}
          </div>
        );
    }
  }
);

PriceCell.displayName = 'PriceCell';

// ============================================
// Change Arrow Component
// ============================================

interface ChangeArrowProps {
  direction: PriceChangeDirection;
  size: number;
}

const ChangeArrow: FC<ChangeArrowProps> = ({ direction, size }) => {
  if (direction === 'unchanged') return null;

  const Icon = direction === 'up' ? ArrowUp : ArrowDown;
  const colorClass =
    direction === 'up'
      ? 'text-emerald-600 dark:text-emerald-500'
      : 'text-red-600 dark:text-red-500';

  return <Icon size={size} className={cn('flex-shrink-0', colorClass)} />;
};

// ============================================
// Bid/Ask Display Component
// ============================================

interface BidAskDisplayProps {
  bid: number;
  ask: number;
  decimals: number;
  size: PriceCellSize;
  showSpread: boolean;
  spreadFormat: 'percent' | 'absolute' | 'pips';
  flashClass: string;
  className?: string;
}

const BidAskDisplay: FC<BidAskDisplayProps> = ({
  bid,
  ask,
  decimals,
  size,
  showSpread,
  spreadFormat,
  flashClass,
  className,
}) => {
  const sizeConfig = SIZE_CONFIG[size];

  const spread = useMemo(() => {
    if (!showSpread) return null;

    const absoluteSpread = ask - bid;
    const midPrice = (bid + ask) / 2;

    switch (spreadFormat) {
      case 'percent':
        return `${((absoluteSpread / midPrice) * 100).toFixed(2)}%`;
      case 'pips':
        // Assuming 4 decimal places for FX
        return `${(absoluteSpread * 10000).toFixed(1)} pips`;
      case 'absolute':
      default:
        return absoluteSpread.toFixed(decimals);
    }
  }, [bid, ask, showSpread, spreadFormat, decimals]);

  const formatPrice = (price: number) =>
    price.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

  return (
    <div
      className={cn(
        'bid-ask-cell inline-flex flex-col',
        sizeConfig.text,
        flashClass,
        className
      )}
    >
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-end">
          <span className="text-muted-foreground text-[10px] uppercase tracking-wider">
            Bid
          </span>
          <span className="font-mono font-medium tabular-nums text-blue-600 dark:text-blue-400">
            {formatPrice(bid)}
          </span>
        </div>
        <div className="text-muted-foreground/30 text-lg">/</div>
        <div className="flex flex-col items-start">
          <span className="text-muted-foreground text-[10px] uppercase tracking-wider">
            Ask
          </span>
          <span className="font-mono font-medium tabular-nums text-orange-600 dark:text-orange-400">
            {formatPrice(ask)}
          </span>
        </div>
      </div>
      {showSpread && spread && (
        <div
          className={cn(
            'text-muted-foreground text-center mt-0.5',
            sizeConfig.secondary
          )}
        >
          Spread: {spread}
        </div>
      )}
    </div>
  );
};

// ============================================
// OHLC Display Component
// ============================================

interface OHLCDisplayProps {
  ohlc?: {
    open: number;
    high: number;
    low: number;
    close: number;
  };
  decimals: number;
  size: PriceCellSize;
  className?: string;
}

const OHLCDisplay: FC<OHLCDisplayProps> = ({ ohlc, decimals, size, className }) => {
  const sizeConfig = SIZE_CONFIG[size];

  if (!ohlc) {
    return <span className="text-muted-foreground">—</span>;
  }

  const { open, high, low, close } = ohlc;
  const isPositive = close >= open;

  const formatPrice = (price: number) =>
    price.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

  return (
    <div
      className={cn('ohlc-cell grid grid-cols-4 gap-2', sizeConfig.secondary, className)}
    >
      <div className="flex flex-col items-center">
        <span className="text-muted-foreground text-[10px] uppercase">O</span>
        <span className="font-mono tabular-nums">{formatPrice(open)}</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-muted-foreground text-[10px] uppercase">H</span>
        <span className="font-mono tabular-nums text-emerald-600">
          {formatPrice(high)}
        </span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-muted-foreground text-[10px] uppercase">L</span>
        <span className="font-mono tabular-nums text-red-600">{formatPrice(low)}</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-muted-foreground text-[10px] uppercase">C</span>
        <span
          className={cn(
            'font-mono tabular-nums font-medium',
            isPositive ? 'text-emerald-600' : 'text-red-600'
          )}
        >
          {formatPrice(close)}
        </span>
      </div>
    </div>
  );
};

// ============================================
// Utility Functions
// ============================================

function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    ZAR: 'R',
    KES: 'KSh',
    CHF: 'CHF ',
    AUD: 'A$',
    CAD: 'C$',
  };
  return symbols[currency] || `${currency} `;
}

function formatRelativeTime(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();

  if (diff < 1000) return 'now';
  if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}
