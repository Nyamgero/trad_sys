// ============================================
// features/trading/positions/fx/columns.ts
// ============================================

import { ColumnDef } from '@/components/ui/DataGrid';
import type { FXPosition } from './types';

export const FX_COLUMNS: ColumnDef<FXPosition>[] = [
  // === CRITICAL (Always Visible) ===
  {
    id: 'ccyPair',
    header: 'CCY Pair',
    accessor: 'ccyPair',
    width: 90,
    sortable: true,
    pinned: 'left',
    alignment: 'left',
  },
  {
    id: 'direction',
    header: 'Dir',
    accessor: 'direction',
    width: 65,
    sortable: true,
    alignment: 'center',
  },
  {
    id: 'notionalBase',
    header: 'Notional (Base)',
    accessor: 'notionalBase',
    width: 130,
    sortable: true,
    alignment: 'right',
  },
  {
    id: 'spotRate',
    header: 'Spot Rate',
    accessor: 'spotRate',
    width: 100,
    sortable: true,
    alignment: 'right',
  },
  {
    id: 'mtmValue',
    header: 'MTM Value',
    accessor: (row) => row.mtmValue.amount,
    width: 110,
    sortable: true,
    alignment: 'right',
  },
  {
    id: 'dayChangePips',
    header: 'Day Chg (pips)',
    accessor: 'dayChangePips',
    width: 110,
    sortable: true,
    alignment: 'right',
  },
  {
    id: 'dayChangePercent',
    header: 'Day Chg %',
    accessor: 'dayChangePercent',
    width: 90,
    sortable: true,
    alignment: 'right',
  },

  // === STANDARD (Visible by default) ===
  {
    id: 'baseCurrency',
    header: 'Base',
    accessor: 'baseCurrency',
    width: 55,
    sortable: true,
    alignment: 'center',
  },
  {
    id: 'termCurrency',
    header: 'Term',
    accessor: 'termCurrency',
    width: 55,
    sortable: true,
    alignment: 'center',
  },

  // === DETAIL (Hidden by default) ===
  {
    id: 'notionalTerm',
    header: 'Notional (Term)',
    accessor: 'notionalTerm',
    width: 130,
    sortable: true,
    alignment: 'right',
    visible: false,
  },
  {
    id: 'avgRate',
    header: 'Avg Rate',
    accessor: 'avgRate',
    width: 95,
    sortable: true,
    alignment: 'right',
    visible: false,
  },
  {
    id: 'bid',
    header: 'Bid',
    accessor: 'bid',
    width: 90,
    sortable: false,
    alignment: 'right',
    visible: false,
  },
  {
    id: 'ask',
    header: 'Ask',
    accessor: 'ask',
    width: 90,
    sortable: false,
    alignment: 'right',
    visible: false,
  },
  {
    id: 'spreadPips',
    header: 'Spread (pips)',
    accessor: 'spreadPips',
    width: 100,
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

export const getFXCriticalColumns = () =>
  FX_COLUMNS.filter((c) => c.visible !== false);

export const getFXDetailColumns = () =>
  FX_COLUMNS.filter((c) => c.visible === false);
