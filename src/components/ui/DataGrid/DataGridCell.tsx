// ============================================
// components/ui/DataGrid/DataGridCell.tsx
// ============================================

import { memo, useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { ColumnDef } from './types';

interface DataGridCellProps<T> {
  column: ColumnDef<T>;
  row: T;
  rowIndex: number;
  width: number | 'auto';
  compact?: boolean;
}

function DataGridCellInner<T>({
  column,
  row,
  rowIndex,
  width,
  compact,
}: DataGridCellProps<T>) {
  // Get the value
  const value = useMemo(() => {
    if (typeof column.accessor === 'function') {
      return column.accessor(row);
    }
    return row[column.accessor];
  }, [column, row]);

  // Get dynamic class name
  const dynamicClassName = useMemo(() => {
    if (typeof column.cellClassName === 'function') {
      return column.cellClassName(value, row);
    }
    return column.cellClassName;
  }, [column, value, row]);

  // Render content
  const content = useMemo(() => {
    if (column.cell) {
      return column.cell(value, row, rowIndex);
    }

    // Default rendering
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground">—</span>;
    }

    return String(value);
  }, [column, value, row, rowIndex]);

  return (
    <div
      className={cn(
        'datagrid-cell',
        'flex items-center px-3 truncate',
        compact ? 'py-1 text-xs' : 'py-2 text-sm',
        column.alignment === 'center' && 'justify-center text-center',
        column.alignment === 'right' && 'justify-end text-right',
        column.className,
        dynamicClassName
      )}
      style={{
        width: width === 'auto' ? undefined : width,
        minWidth: column.minWidth,
        maxWidth: column.maxWidth,
        flex: width === 'auto' ? '1 1 auto' : `0 0 ${width}px`,
      }}
      role="cell"
    >
      {content}
    </div>
  );
}

export const DataGridCell = memo(DataGridCellInner) as typeof DataGridCellInner;
