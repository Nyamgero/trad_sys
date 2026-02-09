// ============================================
// components/ui/DataGrid/DataGridRow.tsx
// ============================================

import { memo, useCallback, CSSProperties } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DataGridCell } from './DataGridCell';
import type { ColumnDef } from './types';

interface DataGridRowProps<T> {
  row: T;
  rowIndex: number;
  columns: ColumnDef<T>[];
  pinnedLeftColumns: ColumnDef<T>[];
  pinnedRightColumns: ColumnDef<T>[];
  scrollableColumns: ColumnDef<T>[];
  columnWidths: Map<string, number>;
  pinnedLeftWidth: number;
  pinnedRightWidth: number;
  isSelected?: boolean;
  isExpanded?: boolean;
  isFlashing?: boolean;
  striped?: boolean;
  highlightOnHover?: boolean;
  compact?: boolean;
  selectable?: boolean;
  expandable?: boolean;
  onClick?: (row: T, index: number) => void;
  onDoubleClick?: (row: T, index: number) => void;
  onContextMenu?: (row: T, index: number, event: React.MouseEvent) => void;
  onSelect?: (row: T) => void;
  className?: string;
  style?: CSSProperties;
}

function DataGridRowInner<T>({
  row,
  rowIndex,
  columns,
  pinnedLeftColumns,
  pinnedRightColumns,
  scrollableColumns,
  columnWidths,
  pinnedLeftWidth,
  pinnedRightWidth,
  isSelected,
  isExpanded,
  isFlashing,
  striped,
  highlightOnHover,
  compact,
  selectable,
  expandable,
  onClick,
  onDoubleClick,
  onContextMenu,
  onSelect,
  className,
  style,
}: DataGridRowProps<T>) {
  const handleClick = useCallback(() => {
    onClick?.(row, rowIndex);
  }, [onClick, row, rowIndex]);

  const handleDoubleClick = useCallback(() => {
    onDoubleClick?.(row, rowIndex);
  }, [onDoubleClick, row, rowIndex]);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      onContextMenu?.(row, rowIndex, e);
    },
    [onContextMenu, row, rowIndex]
  );

  const handleSelect = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect?.(row);
    },
    [onSelect, row]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick?.(row, rowIndex);
      }
    },
    [onClick, row, rowIndex]
  );

  const rowHeight = compact ? 32 : 40;

  return (
    <div
      className={cn(
        'datagrid-row',
        'flex items-stretch border-b border-border/50',
        'transition-colors duration-150',
        striped && rowIndex % 2 === 1 && 'bg-muted/20',
        highlightOnHover && 'hover:bg-muted/40',
        isSelected && 'bg-primary/5 hover:bg-primary/10',
        isExpanded && 'bg-muted/30',
        isFlashing && 'animate-flash',
        onClick && 'cursor-pointer',
        className
      )}
      style={{
        height: rowHeight,
        ...style,
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
      role="row"
      tabIndex={onClick ? 0 : undefined}
      aria-selected={isSelected}
    >
      {/* Expand toggle */}
      {expandable && (
        <div
          className="datagrid-row-expand flex items-center justify-center"
          style={{ width: 40, flex: '0 0 40px' }}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      )}

      {/* Selection checkbox */}
      {selectable && (
        <div
          className="datagrid-row-select flex items-center justify-center"
          style={{ width: 40, flex: '0 0 40px' }}
          onClick={handleSelect}
        >
          <input
            type="checkbox"
            checked={isSelected}
            readOnly
            aria-label="Select row"
            className="h-4 w-4 rounded border-gray-300"
          />
        </div>
      )}

      {/* Pinned left cells */}
      {pinnedLeftColumns.length > 0 && (
        <div
          className="datagrid-row-pinned-left flex sticky left-0 z-10 bg-inherit shadow-[2px_0_4px_-2px_rgba(0,0,0,0.05)]"
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
              rowIndex={rowIndex}
              width={columnWidths.get(column.id) ?? column.width}
              compact={compact}
            />
          ))}
        </div>
      )}

      {/* Scrollable cells */}
      <div className="datagrid-row-scrollable flex flex-1">
        {scrollableColumns.map((column) => (
          <DataGridCell
            key={column.id}
            column={column}
            row={row}
            rowIndex={rowIndex}
            width={columnWidths.get(column.id) ?? column.width}
            compact={compact}
          />
        ))}
      </div>

      {/* Pinned right cells */}
      {pinnedRightColumns.length > 0 && (
        <div
          className="datagrid-row-pinned-right flex sticky right-0 z-10 bg-inherit shadow-[-2px_0_4px_-2px_rgba(0,0,0,0.05)]"
          style={{ width: pinnedRightWidth }}
        >
          {pinnedRightColumns.map((column) => (
            <DataGridCell
              key={column.id}
              column={column}
              row={row}
              rowIndex={rowIndex}
              width={columnWidths.get(column.id) ?? column.width}
              compact={compact}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export const DataGridRow = memo(DataGridRowInner) as typeof DataGridRowInner;
