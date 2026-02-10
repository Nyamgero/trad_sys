// ============================================
// features/trading/positions/equity/EquityPositionsView.tsx
// ============================================

import React, { useCallback, useMemo } from 'react';
import { DataGrid } from '@/components/ui/DataGrid';
import { SummaryCard } from '@/components/ui/SummaryCard';
import { useEquityPositions, useEquitySummary } from '@/hooks/queries';
import { usePositionsStore, useUIStore } from '@/stores';
import { EQUITY_COLUMNS, getEquityCriticalColumns } from './columns';
import { EquityPositionDetail } from './EquityPositionDetail';
import type { EquityPosition, EquityPositionExpanded } from './types';
import { formatCurrency } from '@/lib/formatters';

interface EquityPositionsViewProps {
  className?: string;
}

export const EquityPositionsView: React.FC<EquityPositionsViewProps> = ({
  className = '',
}) => {
  const { data: positionsData, isLoading, error, refetch } = useEquityPositions();
  const { data: summaryData } = useEquitySummary();

  const {
    expandedRowIds,
    selectedRowIds,
    sort,
    filters,
    toggleRowExpanded,
    toggleRowSelected,
    selectAllRows,
    clearSelection,
    setSort,
    setFilter,
  } = usePositionsStore((state) => ({
    expandedRowIds: state.equity.expandedRowIds,
    selectedRowIds: state.equity.selectedRowIds,
    sort: state.equity.sort,
    filters: state.equity.filters,
    toggleRowExpanded: (id: string) => state.toggleRowExpanded('equity', id),
    toggleRowSelected: (id: string) => state.toggleRowSelected('equity', id),
    selectAllRows: (ids: string[]) => state.selectAllRows('equity', ids),
    clearSelection: () => state.clearSelection('equity'),
    setSort: (column: string | null) => state.setSort('equity', column),
    setFilter: (key: string, value: string | undefined) => state.setFilter('equity', key, value),
  }));

  const { openDetailPanel, detailPanel, closeDetailPanel } = useUIStore();

  const positions = positionsData?.data?.data || [];
  const summary = summaryData?.data;

  // Filter positions
  const filteredPositions = useMemo(() => {
    let result = [...positions];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.symbol.toLowerCase().includes(search) ||
          p.name.toLowerCase().includes(search)
      );
    }

    if (filters.currency) {
      result = result.filter((p) => p.currency === filters.currency);
    }

    if (filters.exchange) {
      result = result.filter((p) => p.exchange === filters.exchange);
    }

    return result;
  }, [positions, filters]);

  // Sort positions
  const sortedPositions = useMemo(() => {
    if (!sort.column) return filteredPositions;

    return [...filteredPositions].sort((a, b) => {
      const aVal = (a as any)[sort.column!];
      const bVal = (b as any)[sort.column!];

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sort.order === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal || '');
      const bStr = String(bVal || '');
      return sort.order === 'asc'
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });
  }, [filteredPositions, sort]);

  const handleRowClick = useCallback(
    (row: EquityPosition) => {
      openDetailPanel(row.id, 'equity');
    },
    [openDetailPanel]
  );

  const handleSort = useCallback(
    (columnId: string) => {
      setSort(columnId);
    },
    [setSort]
  );

  const handleSelectAll = useCallback(() => {
    if (selectedRowIds.size === sortedPositions.length) {
      clearSelection();
    } else {
      selectAllRows(sortedPositions.map((p) => p.id));
    }
  }, [selectedRowIds.size, sortedPositions, selectAllRows, clearSelection]);

  const renderExpandedRow = useCallback(
    (row: EquityPosition) => (
      <div className="equity-expanded-row">
        <div className="equity-expanded-row__grid">
          <div className="equity-expanded-row__field">
            <span className="label">Avg Cost</span>
            <span className="value">{formatCurrency(row.avgCost, row.currency)}</span>
          </div>
          <div className="equity-expanded-row__field">
            <span className="label">Cost Basis</span>
            <span className="value">
              {formatCurrency(row.costBasis.amount, row.costBasis.currency)}
            </span>
          </div>
          <div className="equity-expanded-row__field">
            <span className="label">Bid</span>
            <span className="value">{formatCurrency(row.bid, row.currency)}</span>
          </div>
          <div className="equity-expanded-row__field">
            <span className="label">Ask</span>
            <span className="value">{formatCurrency(row.ask, row.currency)}</span>
          </div>
          <div className="equity-expanded-row__field">
            <span className="label">Spread</span>
            <span className="value">{row.spreadPercent.toFixed(2)}%</span>
          </div>
          <div className="equity-expanded-row__field">
            <span className="label">Exchange</span>
            <span className="value">{row.exchange}</span>
          </div>
        </div>
      </div>
    ),
    []
  );

  const totals = useMemo(() => {
    if (!summary) return null;
    return {
      marketValueBase: { amount: summary.totalMarketValue, currency: 'USD' },
      dayPnL: { amount: summary.dayPnL, percent: summary.dayPnLPercent },
    };
  }, [summary]);

  if (error) {
    return (
      <div className="positions-view positions-view--error">
        <p>Error loading equity positions</p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }

  return (
    <div className={`positions-view positions-view--equity ${className}`}>
      {/* Summary Cards */}
      {summary && (
        <div className="positions-view__summary">
          <SummaryCard
            title="Equity Portfolio"
            value={summary.totalMarketValue}
            currency="USD"
            periods={[
              { label: 'Day', value: summary.dayPnL, percent: summary.dayPnLPercent },
              { label: 'MTD', value: summary.mtdPnL, percent: summary.mtdPnLPercent },
              { label: 'YTD', value: summary.ytdPnL, percent: summary.ytdPnLPercent },
            ]}
          />
          <div className="positions-view__stats">
            <div className="stat">
              <span className="stat__label">Positions</span>
              <span className="stat__value">{summary.totalPositions}</span>
            </div>
            <div className="stat">
              <span className="stat__label">Unrealized</span>
              <span className="stat__value">
                {formatCurrency(summary.unrealizedPnL, 'USD')}
              </span>
            </div>
            <div className="stat">
              <span className="stat__label">Realized</span>
              <span className="stat__value">
                {formatCurrency(summary.realizedPnL, 'USD')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="positions-view__toolbar">
        <input
          type="text"
          placeholder="Search by symbol or name..."
          value={filters.search}
          onChange={(e) => setFilter('search', e.target.value || undefined)}
          className="positions-view__search"
        />
        <div className="positions-view__filters">
          <select
            value={filters.currency || ''}
            onChange={(e) => setFilter('currency', e.target.value || undefined)}
          >
            <option value="">All Currencies</option>
            <option value="USD">USD</option>
            <option value="ZAR">ZAR</option>
            <option value="GBP">GBP</option>
            <option value="EUR">EUR</option>
          </select>
          <select
            value={filters.exchange || ''}
            onChange={(e) => setFilter('exchange', e.target.value || undefined)}
          >
            <option value="">All Exchanges</option>
            <option value="NASDAQ">NASDAQ</option>
            <option value="NYSE">NYSE</option>
            <option value="JSE">JSE</option>
            <option value="LSE">LSE</option>
          </select>
        </div>
        <span className="positions-view__count">
          {filteredPositions.length} of {positions.length} positions
        </span>
      </div>

      {/* Data Grid */}
      <DataGrid
        data={sortedPositions}
        columns={EQUITY_COLUMNS}
        rowKey="id"
        loading={isLoading}
        expandedRowIds={expandedRowIds}
        selectedRowIds={selectedRowIds}
        sortColumn={sort.column}
        sortOrder={sort.order}
        onRowClick={handleRowClick}
        onRowExpand={toggleRowExpanded}
        onRowSelect={toggleRowSelected}
        onSelectAll={handleSelectAll}
        onSort={handleSort}
        renderExpandedRow={renderExpandedRow}
        emptyMessage="No equity positions found"
        stickyHeader
        virtualized
      />

      {/* Detail Panel */}
      {detailPanel.isOpen && detailPanel.assetClass === 'equity' && (
        <div className="positions-view__detail-panel">
          <EquityPositionDetail
            position={
              positions.find((p) => p.id === detailPanel.positionId) as EquityPositionExpanded
            }
            onClose={closeDetailPanel}
          />
        </div>
      )}
    </div>
  );
};

export default EquityPositionsView;
