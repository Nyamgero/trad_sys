// ============================================
// features/trading/positions/bond/BondPositionsView.tsx
// ============================================

import React, { useCallback, useMemo } from 'react';
import { DataGrid } from '@/components/ui/DataGrid';
import { SummaryCard } from '@/components/ui/SummaryCard';
import { PnLIndicator } from '@/components/ui/PnLIndicator';
import { useBondPositions, useBondSummary } from '@/hooks/queries';
import { usePositionsStore, useUIStore } from '@/stores';
import { BOND_COLUMNS } from './columns';
import { BondPositionDetail } from './BondPositionDetail';
import type { BondPosition, BondPositionExpanded } from './types';
import { formatCurrency, formatPercent } from '@/lib/formatters';

interface BondPositionsViewProps {
  className?: string;
}

export const BondPositionsView: React.FC<BondPositionsViewProps> = ({
  className = '',
}) => {
  const { data: positionsData, isLoading, error, refetch } = useBondPositions();
  const { data: summaryData } = useBondSummary();

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
    expandedRowIds: state.bond.expandedRowIds,
    selectedRowIds: state.bond.selectedRowIds,
    sort: state.bond.sort,
    filters: state.bond.filters,
    toggleRowExpanded: (id: string) => state.toggleRowExpanded('bond', id),
    toggleRowSelected: (id: string) => state.toggleRowSelected('bond', id),
    selectAllRows: (ids: string[]) => state.selectAllRows('bond', ids),
    clearSelection: () => state.clearSelection('bond'),
    setSort: (column: string | null) => state.setSort('bond', column),
    setFilter: (key: string, value: string | undefined) => state.setFilter('bond', key, value),
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
          p.isin.toLowerCase().includes(search) ||
          p.name.toLowerCase().includes(search) ||
          p.issuer.toLowerCase().includes(search)
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
    (row: BondPosition) => {
      openDetailPanel(row.id, 'bond');
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
    (row: BondPosition) => (
      <div className="bond-expanded-row">
        <div className="bond-expanded-row__grid">
          <div className="bond-expanded-row__field">
            <span className="label">Dirty Price</span>
            <span className="value">{row.dirtyPrice.toFixed(4)}</span>
          </div>
          <div className="bond-expanded-row__field">
            <span className="label">Accrued Interest</span>
            <span className="value">{row.accruedInterest.toFixed(4)}</span>
          </div>
          <div className="bond-expanded-row__field">
            <span className="label">Quantity</span>
            <span className="value">{formatCurrency(row.quantity, row.currency)}</span>
          </div>
          <div className="bond-expanded-row__field">
            <span className="label">Avg Price</span>
            <span className="value">{row.avgPrice.toFixed(4)}</span>
          </div>
          <div className="bond-expanded-row__field">
            <span className="label">Issuer</span>
            <span className="value">{row.issuer}</span>
          </div>
          <div className="bond-expanded-row__field">
            <span className="label">Market Value</span>
            <span className="value">
              {formatCurrency(row.marketValue.amount, row.marketValue.currency)}
            </span>
          </div>
        </div>
      </div>
    ),
    []
  );

  if (error) {
    return (
      <div className="positions-view positions-view--error">
        <p>Error loading bond positions</p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }

  return (
    <div className={`positions-view positions-view--bond ${className}`}>
      {/* Summary Cards */}
      {summary && (
        <div className="positions-view__summary">
          <SummaryCard
            title="Bond Portfolio"
            value={summary.totalMarketValue}
            currency="USD"
            periods={[
              { label: 'Day', value: summary.dayPnL, percent: summary.dayPnLBps / 100 },
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
              <span className="stat__label">Duration</span>
              <span className="stat__value">{summary.portfolioDuration.toFixed(2)}</span>
            </div>
            <div className="stat">
              <span className="stat__label">YTM</span>
              <span className="stat__value">{formatPercent(summary.portfolioYtm)}</span>
            </div>
            <div className="stat">
              <span className="stat__label">DV01</span>
              <span className="stat__value">{formatCurrency(summary.totalDv01, 'USD')}</span>
            </div>
          </div>
        </div>
      )}

      {/* P&L Attribution */}
      {summary && (
        <div className="positions-view__attribution">
          <h3>P&L Attribution (YTD)</h3>
          <div className="attribution-grid">
            <div className="attribution-item">
              <span className="label">Price P&L</span>
              <PnLIndicator value={summary.pricePnL} format="currency" currency="USD" size="small" />
            </div>
            <div className="attribution-item">
              <span className="label">Coupon Income</span>
              <PnLIndicator value={summary.couponIncome} format="currency" currency="USD" size="small" />
            </div>
            <div className="attribution-item">
              <span className="label">Accrued P&L</span>
              <PnLIndicator value={summary.accruedPnL} format="currency" currency="USD" size="small" />
            </div>
            <div className="attribution-item">
              <span className="label">Roll/Carry</span>
              <PnLIndicator value={summary.rollCarryPnL} format="currency" currency="USD" size="small" />
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="positions-view__toolbar">
        <input
          type="text"
          placeholder="Search by ISIN, name, or issuer..."
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
            <option value="KES">KES</option>
          </select>
        </div>
        <span className="positions-view__count">
          {filteredPositions.length} of {positions.length} positions
        </span>
      </div>

      {/* Data Grid */}
      <DataGrid
        data={sortedPositions}
        columns={BOND_COLUMNS}
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
        emptyMessage="No bond positions found"
        stickyHeader
        virtualized
      />

      {/* Detail Panel */}
      {detailPanel.isOpen && detailPanel.assetClass === 'bond' && (
        <div className="positions-view__detail-panel">
          <BondPositionDetail
            position={
              positions.find((p) => p.id === detailPanel.positionId) as BondPositionExpanded
            }
            onClose={closeDetailPanel}
          />
        </div>
      )}
    </div>
  );
};

export default BondPositionsView;
