// ============================================
// components/ui/LiquidityScore/LiquidityScore.tsx
// ============================================

import { FC, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface LiquidityScoreProps {
  /** Score from 1-5 */
  score: number;
  /** Maximum score */
  maxScore?: number;
  /** Show text label */
  showLabel?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional classes */
  className?: string;
}

export const LiquidityScore: FC<LiquidityScoreProps> = ({
  score,
  maxScore = 5,
  showLabel = false,
  size = 'md',
  className,
}) => {
  const normalizedScore = Math.max(1, Math.min(maxScore, Math.round(score)));

  const sizeConfig = useMemo(() => {
    switch (size) {
      case 'sm':
        return { dot: 'w-2 h-2', gap: 'gap-0.5', text: 'text-xs' };
      case 'lg':
        return { dot: 'w-4 h-4', gap: 'gap-1.5', text: 'text-base' };
      default:
        return { dot: 'w-3 h-3', gap: 'gap-1', text: 'text-sm' };
    }
  }, [size]);

  const getColor = (index: number) => {
    if (index >= normalizedScore) return 'bg-muted';

    if (normalizedScore >= 4) return 'bg-emerald-500';
    if (normalizedScore >= 3) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className={cn('inline-flex items-center', sizeConfig.gap, className)}>
      <div className={cn('flex items-center', sizeConfig.gap)}>
        {Array.from({ length: maxScore }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'rounded-full transition-colors',
              sizeConfig.dot,
              getColor(i)
            )}
          />
        ))}
      </div>
      {showLabel && (
        <span className={cn('ml-1.5 text-muted-foreground', sizeConfig.text)}>
          ({normalizedScore}/{maxScore})
        </span>
      )}
    </div>
  );
};
