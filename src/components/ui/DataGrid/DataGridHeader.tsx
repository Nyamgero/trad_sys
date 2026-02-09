// ============================================
// components/ui/DataGrid/DataGridHeader.tsx
// ============================================

import { memo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ColumnDef, SortDirection } from './types';

interface DataGridHeaderProps<T> {
  columns: ColumnDef<T>[];
  pinnedLeftColumns: ColumnDef<T>[];
  pinnedRightColumns: ColumnDef<T>[];
  scrollableColumns: ColumnDef<T>[];
  columnWidths: Map<string, number>;
  pinnedLeftWidth: number;
  pinnedRightWidth: number;
  sortBy?: string | null;
  sortDirection?: SortDirection;
  onSort?: (columnId: string) => void;
  selectable?: boolean;
  expandable?: boolean;
  allSelected?: boolean;
  someSelected?: boolean;
  onSelectAll?: () => void;
  sticky?: boolean;
  className?: string;
}

function DataGridHeaderInner<T>({
  columns,
  pinnedLeftColumns,
  pinnedRightColumns,
  scrollableColumns,
  columnWidths,
  pinnedLeftWidth,
  pinnedRightWidth,
  sortBy,
  sortDirection,
  onSort,
  selectable,
  expandable,
  allSelected,
  someSelected,
  onSelectAll,
  sticky,
  className,
}: DataGridHeaderProps<T>) {
  const renderSortIcon = (columnId: string, sortable?: boolean) => {
    if (!sortable) return null;

    if (sortBy === columnId) {
      return sortDirection === 'asc' ? (
        <ChevronUp className="h-4 w-4" />
      ) : (
        <ChevronDown className="h-4 w-4" />
      );
    }

    return <ChevronsUpDown className="h-4 w-4 opacity-30" />;
  };

  const renderHeaderCell = (column: ColumnDef<T>) => {
    const width = columnWidths.get(column.id) ?? column.width;
    const isSortable = column.sortable && onSort;

    return (
      <div
        key={column.id}
        className={cn(
          'datagrid-header-cell',
          'flex items-center gap-1 px-3 py-2',
          'text-xs font-semibold text-muted-foreground uppercase tracking-wider',
          'border-b border-border',
          'select-none',
          isSortable && 'cursor-pointer hover:bg-muted/50',
          column.alignment === 'center' && 'justify-center',
          column.alignment === 'right' && 'justify-end',
          column.headerClassName
        )}
        style={{
          width: width === 'auto' ? undefined : width,
          minWidth: column.minWidth,
          maxWidth: column.maxWidth,
          flex: width === 'auto' ? '1 1 auto' : `0 0 ${width}px`,
        }}
        onClick={() => isSortable && onSort(column.id)}
        role={isSortable ? 'button' : undefined}
        tabIndex={isSortable ? 0 : undefined}
        onKeyDown={(e) => {
          if (isSortable && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onSort(column.id);
          }
        }}
      >
        <span className="truncate">{column.header}</span>
        {renderSortIcon(column.id, column.sortable)}
      </div>
    );
  };

  return (
    <div
      className={cn(
        'datagrid-header',
        'flex bg-muted/30',
        sticky && 'sticky top-0 z-20',
        className
      )}
    >
      {/* Expand column placeholder */}
      {expandable && (
        <div
          className="datagrid-header-cell flex items-center justify-center border-b border-border bg-muted/30"
          style={{ width: 40, flex: '0 0 40px' }}
        />
      )}

      {/* Selection checkbox */}
      {selectable && (
        <div
          className="datagrid-header-cell flex items-center justify-center border-b border-border bg-muted/30"
          style={{ width: 40, flex: '0 0 40px' }}
        >
          <input
            type="checkbox"
            checked={allSelected}
            ref={(el) => {
              if (el) el.indeterminate = someSelected || false;
            }}
            onChange={onSelectAll}
            aria-label="Select all rows"
            className="h-4 w-4 rounded border-gray-300"
          />
        </div>
      )}

      {/* Pinned left columns */}
      {pinnedLeftColumns.length > 0 && (
        <div
          className="datagrid-header-pinned-left flex sticky left-0 z-10 bg-muted/30 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]"
          style={{
            width: pinnedLeftWidth,
            marginLeft: (expandable ? 40 : 0) + (selectable ? 40 : 0),
          }}
        >
          {pinnedLeftColumns.map(renderHeaderCell)}
        </div>
      )}

      {/* Scrollable columns */}
      <div className="datagrid-header-scrollable flex flex-1">
        {scrollableColumns.map(renderHeaderCell)}
      </div>

      {/* Pinned right columns */}
      {pinnedRightColumns.length > 0 && (
        <div
          className="datagrid-header-pinned-right flex sticky right-0 z-10 bg-muted/30 shadow-[-2px_0_4px_-2px_rgba(0,0,0,0.1)]"
          style={{ width: pinnedRightWidth }}
        >
          {pinnedRightColumns.map(renderHeaderCell)}
        </div>
      )}
    </div>
  );
}

export const DataGridHeader = memo(DataGridHeaderInner) as typeof DataGridHeaderInner;
