// ============================================
// components/ui/DataGrid/DataGrid.tsx
// ============================================

import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { cn } from '@/lib/utils';
import { DataGridHeader } from './DataGridHeader';
import { DataGridRow } from './DataGridRow';
import { DataGridExpandedRow } from './DataGridExpandedRow';
import { DataGridTotalsRow } from './DataGridTotalsRow';
import { DataGridEmpty } from './DataGridEmpty';
import { DataGridLoading } from './DataGridLoading';
import { useColumnLayout } from './hooks/useColumnLayout';
import { useFlashUpdates } from './hooks/useFlashUpdates';
import type { DataGridProps, DataGridRef, SortDirection } from './types';

function DataGridInner<T>(
  props: DataGridProps<T>,
  ref: React.ForwardedRef<DataGridRef>
) {
  const {
    // Data
    data,
    columns: columnsProp,
    keyField,

    // Sorting
    sortBy,
    sortDirection = 'asc',
    onSort,

    // Selection
    selectable = false,
    selectedRows = new Set(),
    onRowSelect,
    onSelectAll,

    // Expansion
    expandable = false,
    expandedRows = new Set(),
    onRowExpand,
    renderExpandedRow,

    // Row events
    onRowClick,
    onRowDoubleClick,
    onRowContextMenu,

    // Footer
    showTotals = false,
    totalsRow,
    totalsLabel = 'TOTAL',

    // Loading
    loading = false,
    loadingRows = 5,
    emptyMessage = 'No data available',

    // Virtualization
    virtualized = true,
    rowHeight = 40,
    overscan = 5,
    maxHeight = '100%',

    // Styling
    striped = false,
    bordered = false,
    compact = false,
    highlightOnHover = true,
    stickyHeader = true,

    // Classes
    className,
    headerClassName,
    bodyClassName,
    rowClassName,

    // Real-time
    flashOnUpdate = true,
    flashDuration = 300,
    getRowUpdateKey,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Filter visible columns
  const columns = useMemo(
    () => columnsProp.filter((col) => col.visible !== false),
    [columnsProp]
  );

  // Column layout calculations
  const {
    columnWidths,
    pinnedLeftColumns,
    pinnedRightColumns,
    scrollableColumns,
    totalWidth,
    pinnedLeftWidth,
    pinnedRightWidth,
  } = useColumnLayout(columns, containerRef);

  // Flash updates tracking
  const flashingCells = useFlashUpdates({
    data,
    keyField,
    enabled: flashOnUpdate,
    duration: flashDuration,
    getUpdateKey: getRowUpdateKey,
  });

  // Build row items (including expanded rows for virtualization)
  const rowItems = useMemo(() => {
    const items: Array<{ type: 'row' | 'expanded'; data: T; index: number }> =
      [];

    data.forEach((row, index) => {
      const rowKey = String(row[keyField]);
      items.push({ type: 'row', data: row, index });

      if (expandable && expandedRows.has(rowKey)) {
        items.push({ type: 'expanded', data: row, index });
      }
    });

    return items;
  }, [data, keyField, expandable, expandedRows]);

  // Virtual row sizing
  const getItemSize = useCallback(
    (index: number) => {
      const item = rowItems[index];
      if (item.type === 'expanded') {
        return 200; // Default expanded row height
      }
      return compact ? 32 : rowHeight;
    },
    [rowItems, compact, rowHeight]
  );

  // Virtualizer
  const virtualizer = useVirtualizer({
    count: rowItems.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: getItemSize,
    overscan,
    enabled: virtualized,
  });

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    scrollToRow: (index: number) => {
      virtualizer.scrollToIndex(index, { align: 'center' });
    },
    scrollToTop: () => {
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    },
    getVisibleRange: () => {
      const range = virtualizer.range;
      return { start: range?.startIndex ?? 0, end: range?.endIndex ?? 0 };
    },
  }));

  // Sort handler
  const handleSort = useCallback(
    (columnId: string) => {
      if (!onSort) return;

      const newDirection: SortDirection =
        sortBy === columnId && sortDirection === 'asc' ? 'desc' : 'asc';

      onSort(columnId, newDirection);
    },
    [sortBy, sortDirection, onSort]
  );

  // Row click handler
  const handleRowClick = useCallback(
    (row: T, index: number) => {
      const rowKey = String(row[keyField]);

      if (expandable && onRowExpand) {
        onRowExpand(rowKey);
      }

      onRowClick?.(row, index);
    },
    [keyField, expandable, onRowExpand, onRowClick]
  );

  // Selection handlers
  const handleRowSelect = useCallback(
    (row: T) => {
      const rowKey = String(row[keyField]);
      onRowSelect?.(rowKey);
    },
    [keyField, onRowSelect]
  );

  const handleSelectAll = useCallback(() => {
    const allSelected = selectedRows.size === data.length;
    onSelectAll?.(!allSelected);
  }, [selectedRows, data.length, onSelectAll]);

  // Render virtual rows
  const virtualRows = virtualizer.getVirtualItems();

  // Loading state
  if (loading && data.length === 0) {
    return (
      <div className={cn('datagrid', className)} ref={containerRef}>
        <DataGridLoading
          columns={columns}
          rows={loadingRows}
          rowHeight={rowHeight}
          compact={compact}
        />
      </div>
    );
  }

  // Empty state
  if (!loading && data.length === 0) {
    return (
      <div className={cn('datagrid', className)} ref={containerRef}>
        <DataGridHeader
          columns={columns}
          pinnedLeftColumns={pinnedLeftColumns}
          pinnedRightColumns={pinnedRightColumns}
          scrollableColumns={scrollableColumns}
          columnWidths={columnWidths}
          pinnedLeftWidth={pinnedLeftWidth}
          pinnedRightWidth={pinnedRightWidth}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSort={handleSort}
          selectable={selectable}
          allSelected={false}
          onSelectAll={handleSelectAll}
          sticky={stickyHeader}
          className={headerClassName}
        />
        <DataGridEmpty message={emptyMessage} />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'datagrid',
        'relative flex flex-col h-full',
        bordered && 'border border-border rounded-md',
        className
      )}
    >
      {/* Header */}
      <DataGridHeader
        columns={columns}
        pinnedLeftColumns={pinnedLeftColumns}
        pinnedRightColumns={pinnedRightColumns}
        scrollableColumns={scrollableColumns}
        columnWidths={columnWidths}
        pinnedLeftWidth={pinnedLeftWidth}
        pinnedRightWidth={pinnedRightWidth}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSort={handleSort}
        selectable={selectable}
        allSelected={selectedRows.size === data.length && data.length > 0}
        someSelected={selectedRows.size > 0 && selectedRows.size < data.length}
        onSelectAll={handleSelectAll}
        sticky={stickyHeader}
        className={headerClassName}
        expandable={expandable}
      />

      {/* Scrollable Body */}
      <div
        ref={scrollRef}
        className={cn('datagrid-body', 'flex-1 overflow-auto', bodyClassName)}
        style={{ maxHeight }}
      >
        <div
          className="datagrid-body-inner relative"
          style={{
            height: virtualized ? virtualizer.getTotalSize() : 'auto',
            width: totalWidth,
          }}
        >
          {virtualized
            ? // Virtualized rows
              virtualRows.map((virtualRow) => {
                const item = rowItems[virtualRow.index];
                const rowKey = String(item.data[keyField]);
                const isSelected = selectedRows.has(rowKey);
                const isExpanded = expandedRows.has(rowKey);
                const isFlashing = flashingCells.has(rowKey);

                if (item.type === 'expanded') {
                  return (
                    <DataGridExpandedRow
                      key={`${rowKey}-expanded`}
                      row={item.data}
                      renderContent={renderExpandedRow}
                      style={{
                        position: 'absolute',
                        top: virtualRow.start,
                        left: 0,
                        width: '100%',
                        height: virtualRow.size,
                      }}
                      pinnedLeftWidth={pinnedLeftWidth}
                      expandable={expandable}
                      selectable={selectable}
                    />
                  );
                }

                return (
                  <DataGridRow
                    key={rowKey}
                    row={item.data}
                    rowIndex={item.index}
                    columns={columns}
                    pinnedLeftColumns={pinnedLeftColumns}
                    pinnedRightColumns={pinnedRightColumns}
                    scrollableColumns={scrollableColumns}
                    columnWidths={columnWidths}
                    pinnedLeftWidth={pinnedLeftWidth}
                    pinnedRightWidth={pinnedRightWidth}
                    isSelected={isSelected}
                    isExpanded={isExpanded}
                    isFlashing={isFlashing}
                    striped={striped}
                    highlightOnHover={highlightOnHover}
                    compact={compact}
                    selectable={selectable}
                    expandable={expandable}
                    onClick={handleRowClick}
                    onDoubleClick={onRowDoubleClick}
                    onContextMenu={onRowContextMenu}
                    onSelect={handleRowSelect}
                    className={
                      typeof rowClassName === 'function'
                        ? rowClassName(item.data, item.index)
                        : rowClassName
                    }
                    style={{
                      position: 'absolute',
                      top: virtualRow.start,
                      left: 0,
                      width: '100%',
                      height: virtualRow.size,
                    }}
                  />
                );
              })
            : // Non-virtualized rows
              rowItems.map((item) => {
                const rowKey = String(item.data[keyField]);
                const isSelected = selectedRows.has(rowKey);
                const isExpanded = expandedRows.has(rowKey);
                const isFlashing = flashingCells.has(rowKey);

                if (item.type === 'expanded') {
                  return (
                    <DataGridExpandedRow
                      key={`${rowKey}-expanded`}
                      row={item.data}
                      renderContent={renderExpandedRow}
                      pinnedLeftWidth={pinnedLeftWidth}
                      expandable={expandable}
                      selectable={selectable}
                    />
                  );
                }

                return (
                  <DataGridRow
                    key={rowKey}
                    row={item.data}
                    rowIndex={item.index}
                    columns={columns}
                    pinnedLeftColumns={pinnedLeftColumns}
                    pinnedRightColumns={pinnedRightColumns}
                    scrollableColumns={scrollableColumns}
                    columnWidths={columnWidths}
                    pinnedLeftWidth={pinnedLeftWidth}
                    pinnedRightWidth={pinnedRightWidth}
                    isSelected={isSelected}
                    isExpanded={isExpanded}
                    isFlashing={isFlashing}
                    striped={striped}
                    highlightOnHover={highlightOnHover}
                    compact={compact}
                    selectable={selectable}
                    expandable={expandable}
                    onClick={handleRowClick}
                    onDoubleClick={onRowDoubleClick}
                    onContextMenu={onRowContextMenu}
                    onSelect={handleRowSelect}
                    className={
                      typeof rowClassName === 'function'
                        ? rowClassName(item.data, item.index)
                        : rowClassName
                    }
                  />
                );
              })}
        </div>
      </div>

      {/* Totals Row */}
      {showTotals && totalsRow && (
        <DataGridTotalsRow
          totalsRow={totalsRow}
          totalsLabel={totalsLabel}
          columns={columns}
          pinnedLeftColumns={pinnedLeftColumns}
          pinnedRightColumns={pinnedRightColumns}
          scrollableColumns={scrollableColumns}
          columnWidths={columnWidths}
          pinnedLeftWidth={pinnedLeftWidth}
          pinnedRightWidth={pinnedRightWidth}
          compact={compact}
          selectable={selectable}
          expandable={expandable}
        />
      )}

      {/* Loading overlay */}
      {loading && data.length > 0 && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      )}
    </div>
  );
}

// Forward ref with generic support
export const DataGrid = forwardRef(DataGridInner) as <T>(
  props: DataGridProps<T> & { ref?: React.ForwardedRef<DataGridRef> }
) => ReturnType<typeof DataGridInner>;
