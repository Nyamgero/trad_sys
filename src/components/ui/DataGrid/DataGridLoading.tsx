// ============================================
// components/ui/DataGrid/DataGridLoading.tsx
// ============================================

import { cn } from '@/lib/utils';
import type { ColumnDef } from './types';

interface DataGridLoadingProps<T> {
  columns: ColumnDef<T>[];
  rows: number;
  rowHeight: number;
  compact?: boolean;
}

export function DataGridLoading<T>({
  columns,
  rows,
  rowHeight,
  compact,
}: DataGridLoadingProps<T>) {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="flex bg-muted/30 border-b border-border">
        {columns.map((col) => (
          <div
            key={col.id}
            className="px-3 py-3"
            style={{
              width: col.width === 'auto' ? 150 : col.width,
              flex: col.width === 'auto' ? '1 1 auto' : undefined,
            }}
          >
            <div className="h-3 bg-muted rounded" />
          </div>
        ))}
      </div>

      {/* Row skeletons */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="flex border-b border-border/50"
          style={{ height: compact ? 32 : rowHeight }}
        >
          {columns.map((col) => (
            <div
              key={col.id}
              className={cn(
                'px-3 flex items-center',
                col.alignment === 'right' && 'justify-end',
                col.alignment === 'center' && 'justify-center'
              )}
              style={{
                width: col.width === 'auto' ? 150 : col.width,
                flex: col.width === 'auto' ? '1 1 auto' : undefined,
              }}
            >
              <div
                className="h-3 bg-muted rounded"
                style={{
                  width: `${50 + Math.random() * 40}%`,
                }}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
