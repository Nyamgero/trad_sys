// ============================================
// features/trading/positions/bond/columns.ts
// ============================================

import { ColumnDef } from '@/components/ui/DataGrid';
import type { BondPosition } from './types';

export const BOND_COLUMNS: ColumnDef<BondPosition>[] = [
  // === CRITICAL (Always Visible) ===
  {
    id: 'isin',
    header: 'ISIN',
    accessor: 'isin',
    width: 120,
    sortable: true,
    pinned: 'left',
    alignment: 'left',
  },
  {
    id: 'name',
    header: 'Name',
    accessor: 'name',
    width: 160,
    minWidth: 120,
    maxWidth: 220,
    sortable: true,
    alignment: 'left',
  },
  {
    id: 'faceValue',
    header: 'Face Value',
    accessor: 'faceValue',
    width: 110,
    sortable: true,
    alignment: 'right',
  },
  {
    id: 'cleanPrice',
    header: 'Clean Price',
    accessor: 'cleanPrice',
    width: 100,
    sortable: true,
    alignment: 'right',
  },
  {
    id: 'ytm',
    header: 'YTM',
    accessor: 'ytm',
    width: 75,
    sortable: true,
    alignment: 'right',
  },
  {
    id: 'duration',
    header: 'Duration',
    accessor: 'duration',
    width: 85,
    sortable: true,
    alignment: 'right',
  },
  {
    id: 'marketValueBase',
    header: 'Mkt Value (Base)',
    accessor: (row) => row.marketValueBase.amount,
    width: 130,
    sortable: true,
    alignment: 'right',
  },
  {
    id: 'dayChangeBps',
    header: 'Day Chg (bps)',
    accessor: 'dayChangeBps',
    width: 110,
    sortable: true,
    alignment: 'right',
  },

  // === STANDARD (Visible by default) ===
  {
    id: 'issuer',
    header: 'Issuer',
    accessor: 'issuer',
    width: 120,
    sortable: true,
    alignment: 'left',
  },
  {
    id: 'currency',
    header: 'CCY',
    accessor: 'currency',
    width: 55,
    sortable: true,
    alignment: 'center',
  },

  // === DETAIL (Hidden by default) ===
  {
    id: 'dirtyPrice',
    header: 'Dirty Price',
    accessor: 'dirtyPrice',
    width: 100,
    sortable: true,
    alignment: 'right',
    visible: false,
  },
  {
    id: 'accruedInterest',
    header: 'Accrued Int',
    accessor: 'accruedInterest',
    width: 95,
    sortable: true,
    alignment: 'right',
    visible: false,
  },
  {
    id: 'quantity',
    header: 'Quantity',
    accessor: 'quantity',
    width: 100,
    sortable: true,
    alignment: 'right',
    visible: false,
  },
  {
    id: 'avgPrice',
    header: 'Avg Price',
    accessor: 'avgPrice',
    width: 90,
    sortable: true,
    alignment: 'right',
    visible: false,
  },
  {
    id: 'updatedAt',
    header: 'Updated',
    accessor: (row) => row.updatedAt.display,
    width: 80,
    sortable: true,
    alignment: 'right',
    visible: false,
  },
];

export const getBondCriticalColumns = () =>
  BOND_COLUMNS.filter((c) => c.visible !== false);

export const getBondDetailColumns = () =>
  BOND_COLUMNS.filter((c) => c.visible === false);
