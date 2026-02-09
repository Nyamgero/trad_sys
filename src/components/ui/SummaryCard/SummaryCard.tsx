// ============================================
// components/ui/SummaryCard/SummaryCard.tsx
// ============================================

import { FC, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { PnLIndicator } from '@/components/ui/PnLIndicator';

export type SummaryCardVariant = 'default' | 'compact' | 'detailed';

export interface PnLPeriod {
  label: string;
  value: number;
  percent: number;
}

export interface SummaryCardProps {
  title: string;
  icon?: ReactNode;
  variant?: SummaryCardVariant;
  periods: PnLPeriod[];
  isLoading?: boolean;
  className?: string;
  accentColor?: string;
  children?: ReactNode;
}

export const SummaryCard: FC<SummaryCardProps> = ({
  title,
  icon,
  variant = 'default',
  periods,
  isLoading,
  className,
  accentColor,
  children,
}) => {
  if (isLoading) {
    return <SummaryCardSkeleton variant={variant} />;
  }

  return (
    <div
      className={cn(
        'summary-card',
        'bg-background rounded-lg border border-border',
        variant === 'compact' ? 'p-3' : 'p-4',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        {accentColor && (
          <div
            className="w-1 h-4 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
        )}
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <h3
          className={cn(
            'font-semibold text-muted-foreground uppercase tracking-wider',
            variant === 'compact' ? 'text-xs' : 'text-sm'
          )}
        >
          {title}
        </h3>
      </div>

      {/* Custom children or Metrics Grid */}
      {children || (
        <div
          className={cn(
            'grid gap-4',
            periods.length === 3
              ? 'grid-cols-3'
              : periods.length === 4
                ? 'grid-cols-4'
                : 'grid-cols-2'
          )}
        >
          {periods.map((period) => (
            <div
              key={period.label}
              className={cn(
                'text-center',
                variant === 'detailed' && 'p-2 bg-muted/30 rounded-lg'
              )}
            >
              <div
                className={cn(
                  'text-muted-foreground',
                  variant === 'compact' ? 'text-xs' : 'text-sm'
                )}
              >
                {period.label}
              </div>
              <div className="mt-1">
                <PnLIndicator
                  value={period.value}
                  format="currency"
                  size={variant === 'compact' ? 'md' : 'lg'}
                  showSign
                  compact
                />
              </div>
              <div className="mt-0.5">
                <PnLIndicator
                  value={period.percent}
                  format="percent"
                  size={variant === 'compact' ? 'xs' : 'sm'}
                  showSign
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SummaryCardSkeleton: FC<{ variant: SummaryCardVariant }> = ({ variant }) => (
  <div
    className={cn(
      'summary-card animate-pulse',
      'bg-background rounded-lg border border-border',
      variant === 'compact' ? 'p-3' : 'p-4'
    )}
  >
    <div className="h-4 w-32 bg-muted rounded mb-3" />
    <div className="grid grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="text-center">
          <div className="h-3 w-12 bg-muted rounded mx-auto mb-2" />
          <div className="h-6 w-20 bg-muted rounded mx-auto mb-1" />
          <div className="h-4 w-14 bg-muted rounded mx-auto" />
        </div>
      ))}
    </div>
  </div>
);
