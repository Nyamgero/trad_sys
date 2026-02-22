// ============================================
// features/trading/blotter/TransactionBlotter.tsx
// ============================================

import React, { useMemo, useState } from 'react';
import { FileText, Download } from 'lucide-react';
import { DataGrid, ColumnDef } from '@/components/ui/DataGrid';
import { formatNumber } from '@/lib/formatters';

// Trade data type matching the design
interface Trade {
  id: string;
  tradeDate: string;
  settleDate: string;
  time: string;
  security: string;
  side: 'BUY' | 'SELL';
  qty: number;
  price: number;
  ccy: string;
  gross: number;
  comm: number;
  netValue: number;
  portfolio: string;
  portfolioColor: string;
}

// Mock data matching the design
const mockTrades: Trade[] = [
  { id: 'TRD-001', tradeDate: '2025-02-22', settleDate: '2025-02-25', time: '09:15:32', security: 'Equity Bank', side: 'BUY', qty: 100, price: 10.00, ccy: 'KES', gross: 1000, comm: 5.00, netValue: 1005, portfolio: 'AA', portfolioColor: '#f59e0b' },
  { id: 'TRD-002', tradeDate: '2025-02-22', settleDate: '2025-02-25', time: '09:23:45', security: 'KCB Group', side: 'BUY', qty: 200, price: 9.00, ccy: 'KES', gross: 1800, comm: 9.00, netValue: 1809, portfolio: 'BB', portfolioColor: '#6366f1' },
  { id: 'TRD-003', tradeDate: '2025-02-22', settleDate: '2025-02-25', time: '10:05:12', security: 'Safaricom', side: 'SELL', qty: 150, price: 25.00, ccy: 'KES', gross: 3750, comm: 18.75, netValue: 3731.25, portfolio: 'CC', portfolioColor: '#10b981' },
  { id: 'TRD-004', tradeDate: '2025-02-22', settleDate: '2025-02-25', time: '10:30:08', security: 'EABL', side: 'BUY', qty: 75, price: 180.00, ccy: 'KES', gross: 13500, comm: 67.50, netValue: 13567.50, portfolio: 'AA', portfolioColor: '#f59e0b' },
  { id: 'TRD-005', tradeDate: '2025-02-22', settleDate: '2025-02-25', time: '11:15:22', security: 'Stanbic', side: 'BUY', qty: 300, price: 95.00, ccy: 'KES', gross: 28500, comm: 142.50, netValue: 28642.50, portfolio: 'BB', portfolioColor: '#6366f1' },
  { id: 'TRD-006', tradeDate: '2025-02-22', settleDate: '2025-02-25', time: '11:45:33', security: 'Co-op Bank', side: 'SELL', qty: 250, price: 12.50, ccy: 'KES', gross: 3125, comm: 15.63, netValue: 3109.37, portfolio: 'CC', portfolioColor: '#10b981' },
  { id: 'TRD-007', tradeDate: '2025-02-22', settleDate: '2025-02-25', time: '13:20:18', security: 'BAT Kenya', side: 'BUY', qty: 50, price: 450.00, ccy: 'KES', gross: 22500, comm: 112.50, netValue: 22612.50, portfolio: 'AA', portfolioColor: '#f59e0b' },
  { id: 'TRD-008', tradeDate: '2025-02-22', settleDate: '2025-02-25', time: '14:10:55', security: 'NCBA', side: 'BUY', qty: 400, price: 35.00, ccy: 'KES', gross: 14000, comm: 70.00, netValue: 14070, portfolio: 'BB', portfolioColor: '#6366f1' },
];

interface TransactionBlotterProps {
  symbolFilter?: string;
}

export const TransactionBlotter: React.FC<TransactionBlotterProps> = () => {
  const [portfolioFilter, setPortfolioFilter] = useState<string>('ALL');
  const [sideFilter, setSideFilter] = useState<string>('ALL');

  const filteredTrades = useMemo(() => {
    return mockTrades.filter((trade) => {
      if (portfolioFilter !== 'ALL' && trade.portfolio !== portfolioFilter) {
        return false;
      }
      if (sideFilter !== 'ALL' && trade.side !== sideFilter) {
        return false;
      }
      return true;
    });
  }, [portfolioFilter, sideFilter]);

  // Calculate summary
  const summary = useMemo(() => {
    const buys = filteredTrades.filter(t => t.side === 'BUY');
    const sells = filteredTrades.filter(t => t.side === 'SELL');
    return {
      totalBuys: buys.length,
      totalSells: sells.length,
      netBuyValue: buys.reduce((sum, t) => sum + t.netValue, 0),
      netSellValue: sells.reduce((sum, t) => sum + t.netValue, 0),
    };
  }, [filteredTrades]);

  // Column definitions matching the design
  const columns: ColumnDef<Trade>[] = useMemo(() => [
    {
      id: 'id',
      header: 'TRADE ID',
      accessor: 'id',
      width: 85,
      sortable: true,
      alignment: 'left',
      cell: (value) => <span style={{ color: '#3b82f6' }}>{value as string}</span>,
    },
    {
      id: 'tradeDate',
      header: 'TRADE DATE',
      accessor: 'tradeDate',
      width: 95,
      sortable: true,
      alignment: 'left',
    },
    {
      id: 'settleDate',
      header: 'SETTLE DATE',
      accessor: 'settleDate',
      width: 95,
      sortable: true,
      alignment: 'left',
    },
    {
      id: 'time',
      header: 'TIME',
      accessor: 'time',
      width: 80,
      sortable: true,
      alignment: 'left',
    },
    {
      id: 'security',
      header: 'SECURITY',
      accessor: 'security',
      width: 110,
      sortable: true,
      alignment: 'left',
    },
    {
      id: 'side',
      header: 'SIDE',
      accessor: 'side',
      width: 60,
      sortable: true,
      alignment: 'center',
      cell: (value) => (
        <span className={`side-badge side-badge--${(value as string).toLowerCase()}`}>
          {value as string}
        </span>
      ),
    },
    {
      id: 'qty',
      header: 'QTY',
      accessor: 'qty',
      width: 70,
      sortable: true,
      alignment: 'right',
      cell: (value) => formatNumber(value as number),
    },
    {
      id: 'price',
      header: 'PRICE',
      accessor: 'price',
      width: 80,
      sortable: true,
      alignment: 'right',
      cell: (value) => <span style={{ color: '#3b82f6' }}>{(value as number).toFixed(2)}</span>,
    },
    {
      id: 'ccy',
      header: 'CCY',
      accessor: 'ccy',
      width: 55,
      sortable: true,
      alignment: 'center',
    },
    {
      id: 'gross',
      header: 'GROSS',
      accessor: 'gross',
      width: 90,
      sortable: true,
      alignment: 'right',
      cell: (value) => <span style={{ color: '#3b82f6' }}>{formatNumber(value as number)}</span>,
    },
    {
      id: 'comm',
      header: 'COMM.',
      accessor: 'comm',
      width: 70,
      sortable: true,
      alignment: 'right',
      cell: (value) => <span style={{ color: '#ef4444' }}>{(value as number).toFixed(2)}</span>,
    },
    {
      id: 'netValue',
      header: 'NET VALUE',
      accessor: 'netValue',
      width: 100,
      sortable: true,
      alignment: 'right',
      cell: (value) => <span style={{ color: '#10b981' }}>{formatNumber(value as number)}</span>,
    },
    {
      id: 'portfolio',
      header: 'PORTFOLIO',
      accessor: 'portfolio',
      width: 90,
      sortable: true,
      alignment: 'center',
      cell: (value, row) => (
        <span
          className="portfolio-badge"
          style={{ backgroundColor: (row as Trade).portfolioColor }}
        >
          {value as string}
        </span>
      ),
    },
  ], []);

  const handleExportCSV = () => {
    // TODO: Implement CSV export
    console.log('Export CSV clicked');
  };

  return (
    <div className="panel">
      <div className="panel__header">
        <div className="panel__title-group">
          <FileText size={18} className="panel__icon" />
          <h2 className="panel__title">Transactions Blotter</h2>
          <span className="panel__badge">{filteredTrades.length} trades</span>
        </div>

        <div className="panel__filters">
          <select
            className="panel__filter-select"
            value={portfolioFilter}
            onChange={(e) => setPortfolioFilter(e.target.value)}
          >
            <option value="ALL">All Portfolios</option>
            <option value="AA">AA</option>
            <option value="BB">BB</option>
            <option value="CC">CC</option>
          </select>

          <select
            className="panel__filter-select"
            value={sideFilter}
            onChange={(e) => setSideFilter(e.target.value)}
          >
            <option value="ALL">All Sides</option>
            <option value="BUY">Buy</option>
            <option value="SELL">Sell</option>
          </select>

          <button className="panel__action-btn panel__action-btn--success" onClick={handleExportCSV}>
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="panel__content">
        <DataGrid
          data={filteredTrades}
          columns={columns}
          rowKey="id"
          loading={false}
          stickyHeader
          rowHeight={44}
          emptyMessage="No trades found"
        />
      </div>

      <div className="panel__footer">
        <div className="panel__footer-left">
          <div className="footer-stat">
            <span className="footer-stat__label">Total Buys:</span>
            <span className="footer-stat__value">{summary.totalBuys}</span>
          </div>
          <div className="footer-stat">
            <span className="footer-stat__label">Total Sells:</span>
            <span className="footer-stat__value footer-stat__value--negative">{summary.totalSells}</span>
          </div>
        </div>
        <div className="panel__footer-right">
          <div className="footer-stat">
            <span className="footer-stat__label">Net Buy Value:</span>
            <span className="footer-stat__value footer-stat__value--positive">${formatNumber(summary.netBuyValue)}</span>
          </div>
          <div className="footer-stat">
            <span className="footer-stat__label">Net Sell Value:</span>
            <span className="footer-stat__value">${formatNumber(summary.netSellValue)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionBlotter;
