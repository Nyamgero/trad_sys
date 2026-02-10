// ============================================
// features/trading/positions/etf/ETFPositionsView.tsx
// ============================================

import React, { useCallback, useMemo } from 'react';
import { DataGrid } from '@/components/ui/DataGrid';
import { SummaryCard } from '@/components/ui/SummaryCard';
import { PnLIndicator } from '@/components/ui/PnLIndicator';
import { useETFPositions, useETFSummary } from '@/hooks/queries';
import { usePositionsStore, useUIStore } from '@/stores';
import { ETF_COLUMNS } from './columns';
import { ETFPositionDetail } from './ETFPositionDetail';
import type { ETFPosition, ETFPositionExpanded } from './types';
import { formatCurrency, formatPercent } from '@/lib/formatters';

interface ETFPositionsViewProps {
  className?: string;
}

export const ETFPositionsView: React.FC<ETFPositionsViewProps> = ({
  className = '',
}) => {
  const { data: positionsData, isLoading, error, refetch } = useETFPositions();
  const { data: summaryData } = useETFSummary();

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
    expandedRowIds: state.etf.expandedRowIds,
    selectedRowIds: state.etf.selectedRowIds,
    sort: state.etf.sort,
    filters: state.etf.filters,
    toggleRowExpanded: (id: string) => state.toggleRowExpanded('etf', id),
    toggleRowSelected: (id: string) => state.toggleRowSelected('etf', id),
    selectAllRows: (ids: string[]) => state.selectAllRows('etf', ids),
    clearSelection: () => state.clearSelection('etf'),
    setSort: (column: string | null) => state.setSort('etf', column),
    setFilter: (key: string, value: string | undefined) => state.setFilter('etf', key, value),
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
    (row: ETFPosition) => {
      openDetailPanel(row.id, 'etf');
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
    (row: ETFPosition) => (
      <div className="etf-expanded-row">
        <div className="etf-expanded-row__grid">
          <div className="etf-expanded-row__field">
            <span className="label">Avg Cost</span>
            <span className="value">{formatCurrency(row.avgCost, row.currency)}</span>
          </div>
          <div className="etf-expanded-row__field">
            <span className="label">Bid</span>
            <span className="value">{formatCurrency(row.bid, row.currency)}</span>
          </div>
          <div className="etf-expanded-row__field">
            <span className="label">Ask</span>
            <span className="value">{formatCurrency(row.ask, row.currency)}</span>
          </div>
          <div className="etf-expanded-row__field">
            <span className="label">Spread</span>
            <span className="value">{row.spreadPercent.toFixed(2)}%</span>
          </div>
          <div className="etf-expanded-row__field">
            <span className="label">Expense Ratio</span>
            <span className="value">{formatPercent(row.expenseRatio)}</span>
          </div>
          <div className="etf-expanded-row__field">
            <span className="label">AUM</span>
            <span className="value">{formatCurrency(row.aum, row.currency)}</span>
          </div>
        </div>
        {/* Premium/Discount Alert */}
        {Math.abs(row.premiumDiscount) > 0.5 && (
          <div className="etf-expanded-row__alert etf-expanded-row__alert--warning">
            Premium/Discount exceeds 0.5%: {formatPercent(row.premiumDiscount)}
          </div>
        )}
      </div>
    ),
    []
  );

  if (error) {
    return (
      <div className="positions-view positions-view--error">
        <p>Error loading ETF positions</p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }

  return (
    <div className={`positions-view positions-view--etf ${className}`}>
      {/* Summary Cards */}
      {summary && (
        <div className="positions-view__summary">
          <SummaryCard
            title="ETF Portfolio"
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
              <span className="stat__label">Avg Expense Ratio</span>
              <span className="stat__value">{formatPercent(summary.avgExpenseRatio)}</span>
            </div>
            <div className="stat">
              <span className="stat__label">Avg Premium/Disc</span>
              <span className="stat__value">
                <PnLIndicator
                  value={summary.avgPremiumDiscount}
                  format="percent"
                  size="small"
                  invertColors
                />
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
          </select>
        </div>
        <span className="positions-view__count">
          {filteredPositions.length} of {positions.length} positions
        </span>
      </div>

      {/* Data Grid */}
      <DataGrid
        data={sortedPositions}
        columns={ETF_COLUMNS}
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
        emptyMessage="No ETF positions found"
        stickyHeader
        virtualized
      />

      {/* Detail Panel */}
      {detailPanel.isOpen && detailPanel.assetClass === 'etf' && (
        <div className="positions-view__detail-panel">
          <ETFPositionDetail
            position={
              positions.find((p) => p.id === detailPanel.positionId) as ETFPositionExpanded
            }
            onClose={closeDetailPanel}
          />
        </div>
      )}
    </div>
  );
};

export default ETFPositionsView;
