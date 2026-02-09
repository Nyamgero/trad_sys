// ============================================
// features/trading/positions/etf/columns.ts
// ============================================

import { ColumnDef } from '@/components/ui/DataGrid';
import type { ETFPosition } from './types';

export const ETF_COLUMNS: ColumnDef<ETFPosition>[] = [
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
    width: 160,
    minWidth: 120,
    maxWidth: 250,
    sortable: true,
    alignment: 'left',
  },
  {
    id: 'units',
    header: 'Units',
    accessor: 'units',
    width: 90,
    sortable: true,
    alignment: 'right',
  },
  {
    id: 'lastPrice',
    header: 'Last Price',
    accessor: 'lastPrice',
    width: 95,
    sortable: true,
    alignment: 'right',
  },
  {
    id: 'nav',
    header: 'NAV',
    accessor: 'nav',
    width: 85,
    sortable: true,
    alignment: 'right',
  },
  {
    id: 'premiumDiscount',
    header: 'Prem/Disc',
    accessor: 'premiumDiscount',
    width: 90,
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
    width: 55,
    sortable: true,
    alignment: 'center',
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
    width: 85,
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

export const getETFCriticalColumns = () =>
  ETF_COLUMNS.filter((c) => c.visible !== false);

export const getETFDetailColumns = () =>
  ETF_COLUMNS.filter((c) => c.visible === false);
