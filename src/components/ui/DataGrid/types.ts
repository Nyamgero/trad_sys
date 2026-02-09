// ============================================
// components/ui/DataGrid/types.ts
// ============================================

import { ReactNode } from 'react';

export type SortDirection = 'asc' | 'desc';
export type ColumnAlignment = 'left' | 'center' | 'right';
export type ColumnPinning = 'left' | 'right' | undefined;

export interface ColumnDef<T> {
  id: string;
  header: string | ReactNode;
  accessor: keyof T | ((row: T) => unknown);

  // Rendering
  cell?: (value: unknown, row: T, rowIndex: number) => ReactNode;
  footer?: (rows: T[]) => ReactNode;

  // Sizing
  width: number | 'auto';
  minWidth?: number;
  maxWidth?: number;

  // Behavior
  sortable?: boolean;
  resizable?: boolean;

  // Layout
  alignment?: ColumnAlignment;
  pinned?: ColumnPinning;
  visible?: boolean;

  // Styling
  className?: string;
  headerClassName?: string;
  cellClassName?: string | ((value: unknown, row: T) => string);
}

export interface DataGridProps<T> {
  // Data
  data: T[];
  columns: ColumnDef<T>[];
  keyField: keyof T;

  // Sorting
  sortBy?: string | null;
  sortDirection?: SortDirection;
  onSort?: (columnId: string, direction: SortDirection) => void;

  // Selection
  selectable?: boolean;
  selectedRows?: Set<string>;
  onRowSelect?: (rowId: string) => void;
  onSelectAll?: (selected: boolean) => void;

  // Expansion
  expandable?: boolean;
  expandedRows?: Set<string>;
  onRowExpand?: (rowId: string) => void;
  renderExpandedRow?: (row: T) => ReactNode;

  // Row events
  onRowClick?: (row: T, index: number) => void;
  onRowDoubleClick?: (row: T, index: number) => void;
  onRowContextMenu?: (row: T, index: number, event: React.MouseEvent) => void;

  // Footer / Totals
  showTotals?: boolean;
  totalsRow?: Partial<T>;
  totalsLabel?: string;

  // Loading
  loading?: boolean;
  loadingRows?: number;
  emptyMessage?: string | ReactNode;

  // Virtualization
  virtualized?: boolean;
  rowHeight?: number;
  overscan?: number;
  maxHeight?: number | string;

  // Styling
  striped?: boolean;
  bordered?: boolean;
  compact?: boolean;
  highlightOnHover?: boolean;
  stickyHeader?: boolean;

  // Class overrides
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  rowClassName?: string | ((row: T, index: number) => string);

  // Real-time updates
  flashOnUpdate?: boolean;
  flashDuration?: number;
  getRowUpdateKey?: (row: T) => string;
}

export interface DataGridRef {
  scrollToRow: (index: number) => void;
  scrollToTop: () => void;
  getVisibleRange: () => { start: number; end: number };
}
