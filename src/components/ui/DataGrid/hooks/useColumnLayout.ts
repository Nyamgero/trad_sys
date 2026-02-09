// ============================================
// components/ui/DataGrid/hooks/useColumnLayout.ts
// ============================================

import { useMemo, RefObject } from 'react';
import type { ColumnDef } from '../types';

export function useColumnLayout<T>(
  columns: ColumnDef<T>[],
  containerRef: RefObject<HTMLDivElement>
) {
  return useMemo(() => {
    const pinnedLeftColumns = columns.filter((c) => c.pinned === 'left');
    const pinnedRightColumns = columns.filter((c) => c.pinned === 'right');
    const scrollableColumns = columns.filter((c) => !c.pinned);

    // Calculate widths
    const columnWidths = new Map<string, number>();
    let totalFixedWidth = 0;
    let autoColumns = 0;

    columns.forEach((col) => {
      if (col.width === 'auto') {
        autoColumns++;
      } else {
        columnWidths.set(col.id, col.width);
        totalFixedWidth += col.width;
      }
    });

    // Calculate pinned widths
    const pinnedLeftWidth = pinnedLeftColumns.reduce((sum, col) => {
      const width = col.width === 'auto' ? 150 : col.width;
      return sum + width;
    }, 0);

    const pinnedRightWidth = pinnedRightColumns.reduce((sum, col) => {
      const width = col.width === 'auto' ? 150 : col.width;
      return sum + width;
    }, 0);

    const totalWidth = totalFixedWidth + autoColumns * 150;

    return {
      columnWidths,
      pinnedLeftColumns,
      pinnedRightColumns,
      scrollableColumns,
      totalWidth,
      pinnedLeftWidth,
      pinnedRightWidth,
    };
  }, [columns]);
}
