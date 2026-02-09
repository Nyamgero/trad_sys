// ============================================
// components/ui/DataGrid/DataGridExpandedRow.tsx
// ============================================

import { memo, CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DataGridExpandedRowProps<T> {
  row: T;
  renderContent?: (row: T) => ReactNode;
  style?: CSSProperties;
  pinnedLeftWidth: number;
  expandable?: boolean;
  selectable?: boolean;
}

function DataGridExpandedRowInner<T>({
  row,
  renderContent,
  style,
  pinnedLeftWidth,
  expandable,
  selectable,
}: DataGridExpandedRowProps<T>) {
  const leftOffset = (expandable ? 40 : 0) + (selectable ? 40 : 0);

  return (
    <div
      className={cn(
        'datagrid-expanded-row',
        'bg-muted/20 border-b border-border'
      )}
      style={style}
    >
      <div className="p-4" style={{ marginLeft: leftOffset }}>
        {renderContent?.(row)}
      </div>
    </div>
  );
}

export const DataGridExpandedRow = memo(
  DataGridExpandedRowInner
) as typeof DataGridExpandedRowInner;
