// ============================================
// features/trading/positions/equity/columns.ts
// ============================================

import { ColumnDef } from '@/components/ui/DataGrid';
import type { EquityPosition } from './types';

export const EQUITY_COLUMNS: ColumnDef<EquityPosition>[] = [
  // === CRITICAL (Always Visible) ===
  {
    id: 'ticker',
    header: 'Ticker',
    accessor: 'ticker',
    width: 80,
    sortable: true,
    pinned: 'left',
    alignment: 'left',
  },
  {
    id: 'name',
    header: 'Name',
    accessor: 'name',
    width: 150,
    minWidth: 100,
    maxWidth: 250,
    sortable: true,
    alignment: 'left',
  },
  {
    id: 'quantity',
    header: 'Quantity',
    accessor: 'quantity',
    width: 100,
    sortable: true,
    alignment: 'right',
  },
  {
    id: 'lastPrice',
    header: 'Last Price',
    accessor: 'lastPrice',
    width: 100,
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
    id: 'dayChangePercent',
    header: 'Day Chg %',
    accessor: (row) => row.dayChange.percent,
    width: 90,
    sortable: true,
    alignment: 'right',
  },

  // === STANDARD (Visible by default) ===
  {
    id: 'exchange',
    header: 'Exchange',
    accessor: 'exchange',
    width: 80,
    sortable: true,
    alignment: 'center',
  },
  {
    id: 'currency',
    header: 'CCY',
    accessor: 'currency',
    width: 60,
    sortable: true,
    alignment: 'center',
  },
  {
    id: 'dayChange',
    header: 'Day Chg',
    accessor: (row) => row.dayChange.absolute,
    width: 80,
    sortable: true,
    alignment: 'right',
  },

  // === DETAIL (Hidden by default) ===
  {
    id: 'avgCost',
    header: 'Avg Cost',
    accessor: 'avgCost',
    width: 90,
    sortable: true,
    alignment: 'right',
    visible: false,
  },
  {
    id: 'bid',
    header: 'Bid',
    accessor: 'bid',
    width: 80,
    sortable: false,
    alignment: 'right',
    visible: false,
  },
  {
    id: 'ask',
    header: 'Ask',
    accessor: 'ask',
    width: 80,
    sortable: false,
    alignment: 'right',
    visible: false,
  },
  {
    id: 'spreadPercent',
    header: 'Spread %',
    accessor: 'spreadPercent',
    width: 80,
    sortable: true,
    alignment: 'right',
    visible: false,
  },
  {
    id: 'marketValue',
    header: 'Mkt Value (Local)',
    accessor: (row) => row.marketValue.amount,
    width: 130,
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

export const getEquityCriticalColumns = () =>
  EQUITY_COLUMNS.filter((c) => c.pinned === 'left' || c.visible !== false);

export const getEquityDetailColumns = () =>
  EQUITY_COLUMNS.filter((c) => c.visible === false);
