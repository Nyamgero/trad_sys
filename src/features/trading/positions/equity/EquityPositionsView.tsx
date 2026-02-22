// ============================================
// features/trading/positions/equity/EquityPositionsView.tsx
// ============================================

import React, { useMemo } from 'react';
import { Lock, Plus } from 'lucide-react';
import { DataGrid, ColumnDef } from '@/components/ui/DataGrid';
import { SplitPanel } from '@/components/ui/SplitPanel';
import { TransactionBlotter } from '@/features/trading/blotter';
import { useDealTicketStore } from '@/stores/dealTicketStore';
import { formatNumber } from '@/lib/formatters';

// Position data type for the new design
interface Position {
  id: string;
  name: string;
  country: string;
  countryColor: string;
  shares: number;
  price: number;
  value: number;
  portfolio: string;
  portfolioColor: string;
}

// Mock data matching the design
const mockPositions: Position[] = [
  { id: '1', name: 'Stanbic Zambia', country: 'Zambia', countryColor: '#10b981', shares: 600, price: 5.00, value: 3000, portfolio: 'CC', portfolioColor: '#10b981' },
  { id: '2', name: 'CRDB Bank', country: 'Tanzania', countryColor: '#3b82f6', shares: 700, price: 4.00, value: 2800, portfolio: 'AA', portfolioColor: '#f59e0b' },
  { id: '3', name: 'NMB Bank', country: 'Tanzania', countryColor: '#3b82f6', shares: 800, price: 3.00, value: 2400, portfolio: 'BB', portfolioColor: '#6366f1' },
  { id: '4', name: 'Stanbic Uganda', country: 'Uganda', countryColor: '#ef4444', shares: 900, price: 2.00, value: 1800, portfolio: 'CC', portfolioColor: '#10b981' },
  { id: '5', name: 'Centenary Bank', country: 'Uganda', countryColor: '#ef4444', shares: 1000, price: 1.00, value: 1000, portfolio: 'AA', portfolioColor: '#f59e0b' },
];

interface EquityPositionsViewProps {
  className?: string;
}

export const EquityPositionsView: React.FC<EquityPositionsViewProps> = ({
  className = '',
}) => {
  const openTicket = useDealTicketStore((state) => state.openTicket);

  const handleNewTrade = () => {
    openTicket({ type: 'equity' });
  };

  // Column definitions matching the design
  const columns: ColumnDef<Position>[] = useMemo(() => [
    {
      id: 'name',
      header: 'Equity Bank',
      accessor: 'name',
      width: 180,
      sortable: true,
      alignment: 'left',
    },
    {
      id: 'country',
      header: 'Country',
      accessor: 'country',
      width: 140,
      sortable: true,
      alignment: 'left',
      cell: (value, row) => (
        <span className="country-cell">
          <span
            className="country-dot"
            style={{ backgroundColor: (row as Position).countryColor }}
          />
          {value as string}
        </span>
      ),
    },
    {
      id: 'shares',
      header: 'No. of Shares',
      accessor: 'shares',
      width: 120,
      sortable: true,
      alignment: 'right',
      cell: (value) => formatNumber(value as number),
    },
    {
      id: 'price',
      header: 'Price',
      accessor: 'price',
      width: 100,
      sortable: true,
      alignment: 'right',
      cell: (value) => (value as number).toFixed(2),
    },
    {
      id: 'value',
      header: 'Value of Shares',
      accessor: 'value',
      width: 140,
      sortable: true,
      alignment: 'right',
      cell: (value) => (
        <span className="value-positive">{formatNumber(value as number)}</span>
      ),
    },
    {
      id: 'portfolio',
      header: 'Portfolio',
      accessor: 'portfolio',
      width: 100,
      sortable: true,
      alignment: 'center',
      cell: (value, row) => (
        <span
          className="portfolio-badge"
          style={{ backgroundColor: (row as Position).portfolioColor }}
        >
          {value as string}
        </span>
      ),
    },
  ], []);

  const positionsPanel = (
    <div className="panel">
      <div className="panel__header">
        <div className="panel__title-group">
          <Lock size={18} className="panel__icon" />
          <h2 className="panel__title">Positions</h2>
          <span className="panel__badge">{mockPositions.length} holdings</span>
        </div>
        <button className="panel__action-btn panel__action-btn--primary" onClick={handleNewTrade}>
          <Plus size={16} />
          New Trade
        </button>
      </div>
      <div className="panel__content">
        <DataGrid
          data={mockPositions}
          columns={columns}
          rowKey="id"
          loading={false}
          emptyMessage="No positions found"
          stickyHeader
          rowHeight={48}
        />
      </div>
    </div>
  );

  const blotterPanel = (
    <TransactionBlotter />
  );

  return (
    <div className={`trading-view ${className}`}>
      <SplitPanel
        topPanel={positionsPanel}
        bottomPanel={blotterPanel}
        defaultTopHeight={55}
        minTopHeight={30}
        maxTopHeight={75}
      />
    </div>
  );
};

export default EquityPositionsView;
