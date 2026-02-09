// ============================================
// components/ui/DataGrid/DataGridTotalsRow.tsx
// ============================================

import { memo } from 'react';
import { cn } from '@/lib/utils';
import { DataGridCell } from './DataGridCell';
import type { ColumnDef } from './types';

interface DataGridTotalsRowProps<T> {
  totalsRow: Partial<T>;
  totalsLabel: string;
  columns: ColumnDef<T>[];
  pinnedLeftColumns: ColumnDef<T>[];
  pinnedRightColumns: ColumnDef<T>[];
  scrollableColumns: ColumnDef<T>[];
  columnWidths: Map<string, number>;
  pinnedLeftWidth: number;
  pinnedRightWidth: number;
  compact?: boolean;
  selectable?: boolean;
  expandable?: boolean;
}

function DataGridTotalsRowInner<T>({
  totalsRow,
  totalsLabel,
  columns,
  pinnedLeftColumns,
  pinnedRightColumns,
  scrollableColumns,
  columnWidths,
  pinnedLeftWidth,
  pinnedRightWidth,
  compact,
  selectable,
  expandable,
}: DataGridTotalsRowProps<T>) {
  const rowHeight = compact ? 36 : 44;

  // Create a pseudo-row with totals data
  const row = totalsRow as T;

  return (
    <div
      className={cn(
        'datagrid-totals-row',
        'flex items-stretch',
        'bg-muted/50 border-t-2 border-border',
        'font-semibold'
      )}
      style={{ height: rowHeight }}
    >
      {/* Expand placeholder */}
      {expandable && <div style={{ width: 40, flex: '0 0 40px' }} />}

      {/* Select placeholder */}
      {selectable && <div style={{ width: 40, flex: '0 0 40px' }} />}

      {/* Pinned left cells */}
      {pinnedLeftColumns.length > 0 && (
        <div
          className="flex sticky left-0 z-10 bg-muted/50"
          style={{
            width: pinnedLeftWidth,
            marginLeft: (expandable ? 40 : 0) + (selectable ? 40 : 0),
          }}
        >
          {pinnedLeftColumns.map((column) => (
            <DataGridCell
              key={column.id}
              column={column}
              row={row}
              rowIndex={-1}
              width={columnWidths.get(column.id) ?? column.width}
              compact={compact}
            />
          ))}
        </div>
      )}

      {/* Scrollable cells */}
      <div className="flex flex-1">
        {scrollableColumns.map((column) => (
          <DataGridCell
            key={column.id}
            column={column}
            row={row}
            rowIndex={-1}
            width={columnWidths.get(column.id) ?? column.width}
            compact={compact}
          />
        ))}
      </div>

      {/* Pinned right cells */}
      {pinnedRightColumns.length > 0 && (
        <div
          className="flex sticky right-0 z-10 bg-muted/50"
          style={{ width: pinnedRightWidth }}
        >
          {pinnedRightColumns.map((column) => (
            <DataGridCell
              key={column.id}
              column={column}
              row={row}
              rowIndex={-1}
              width={columnWidths.get(column.id) ?? column.width}
              compact={compact}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export const DataGridTotalsRow = memo(
  DataGridTotalsRowInner
) as typeof DataGridTotalsRowInner;
