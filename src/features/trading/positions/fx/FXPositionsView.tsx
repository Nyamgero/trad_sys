// ============================================
// features/trading/positions/fx/FXPositionsView.tsx
// ============================================

import React, { useCallback, useMemo } from 'react';
import { DataGrid } from '@/components/ui/DataGrid';
import { SummaryCard } from '@/components/ui/SummaryCard';
import { PnLIndicator } from '@/components/ui/PnLIndicator';
import { useFXPositions, useFXSummary } from '@/hooks/queries';
import { usePositionsStore, useUIStore } from '@/stores';
import { FX_COLUMNS } from './columns';
import { FXPositionDetail } from './FXPositionDetail';
import type { FXPosition, FXPositionExpanded } from './types';
import { formatCurrency, formatNumber } from '@/lib/formatters';

interface FXPositionsViewProps {
  className?: string;
}

export const FXPositionsView: React.FC<FXPositionsViewProps> = ({
  className = '',
}) => {
  const { data: positionsData, isLoading, error, refetch } = useFXPositions();
  const { data: summaryData } = useFXSummary();

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
    expandedRowIds: state.fx.expandedRowIds,
    selectedRowIds: state.fx.selectedRowIds,
    sort: state.fx.sort,
    filters: state.fx.filters,
    toggleRowExpanded: (id: string) => state.toggleRowExpanded('fx', id),
    toggleRowSelected: (id: string) => state.toggleRowSelected('fx', id),
    selectAllRows: (ids: string[]) => state.selectAllRows('fx', ids),
    clearSelection: () => state.clearSelection('fx'),
    setSort: (column: string | null) => state.setSort('fx', column),
    setFilter: (key: string, value: string | undefined) => state.setFilter('fx', key, value),
  }));

  const { openDetailPanel, detailPanel, closeDetailPanel } = useUIStore();

  const positions = positionsData?.data?.data || [];
  const summary = summaryData?.data;

  // Filter positions
  const filteredPositions = useMemo(() => {
    let result = [...positions];

    if (filters.search) {
      const search = filters.search.toUpperCase();
      result = result.filter((p) => p.ccyPair.includes(search));
    }

    if (filters.direction) {
      result = result.filter((p) => p.direction === filters.direction);
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
    (row: FXPosition) => {
      openDetailPanel(row.id, 'fx');
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
    (row: FXPosition) => (
      <div className="fx-expanded-row">
        <div className="fx-expanded-row__grid">
          <div className="fx-expanded-row__field">
            <span className="label">Avg Rate</span>
            <span className="value">{row.avgRate.toFixed(5)}</span>
          </div>
          <div className="fx-expanded-row__field">
            <span className="label">Notional (Term)</span>
            <span className="value">
              {formatCurrency(row.notionalTerm, row.termCurrency)}
            </span>
          </div>
          <div className="fx-expanded-row__field">
            <span className="label">Bid</span>
            <span className="value">{row.bid.toFixed(5)}</span>
          </div>
          <div className="fx-expanded-row__field">
            <span className="label">Ask</span>
            <span className="value">{row.ask.toFixed(5)}</span>
          </div>
          <div className="fx-expanded-row__field">
            <span className="label">Spread (pips)</span>
            <span className="value">{row.spreadPips.toFixed(1)}</span>
          </div>
          <div className="fx-expanded-row__field">
            <span className="label">Forward Points</span>
            <span className="value">{row.forwardPoints?.toFixed(2) || '-'}</span>
          </div>
        </div>
      </div>
    ),
    []
  );

  if (error) {
    return (
      <div className="positions-view positions-view--error">
        <p>Error loading FX positions</p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }

  return (
    <div className={`positions-view positions-view--fx ${className}`}>
      {/* Summary Cards */}
      {summary && (
        <div className="positions-view__summary">
          <SummaryCard
            title="FX Portfolio"
            value={summary.totalMtmValue}
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
              <span className="stat__label">Net USD Exposure</span>
              <span className="stat__value">
                {formatCurrency(summary.netUsdExposure, 'USD')}
              </span>
            </div>
            <div className="stat">
              <span className="stat__label">Avg Hedge Ratio</span>
              <span className="stat__value">{(summary.avgHedgeRatio * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Currency Exposure Summary */}
      {summary?.currencyExposures && (
        <div className="positions-view__exposure-summary">
          <h3>Currency Exposure</h3>
          <div className="exposure-grid">
            {summary.currencyExposures.map((exp) => (
              <div key={exp.currency} className="exposure-item">
                <span className="exposure-item__currency">{exp.currency}</span>
                <span className="exposure-item__net">
                  {formatNumber(exp.netExposure)}
                </span>
                <PnLIndicator
                  value={exp.mtmPnL}
                  format="currency"
                  currency="USD"
                  size="small"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="positions-view__toolbar">
        <input
          type="text"
          placeholder="Search by currency pair..."
          value={filters.search}
          onChange={(e) => setFilter('search', e.target.value || undefined)}
          className="positions-view__search"
        />
        <div className="positions-view__filters">
          <select
            value={filters.direction || ''}
            onChange={(e) => setFilter('direction', e.target.value || undefined)}
          >
            <option value="">All Directions</option>
            <option value="long">Long</option>
            <option value="short">Short</option>
          </select>
        </div>
        <span className="positions-view__count">
          {filteredPositions.length} of {positions.length} positions
        </span>
      </div>

      {/* Data Grid */}
      <DataGrid
        data={sortedPositions}
        columns={FX_COLUMNS}
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
        emptyMessage="No FX positions found"
        stickyHeader
        virtualized
      />

      {/* Detail Panel */}
      {detailPanel.isOpen && detailPanel.assetClass === 'fx' && (
        <div className="positions-view__detail-panel">
          <FXPositionDetail
            position={
              positions.find((p) => p.id === detailPanel.positionId) as FXPositionExpanded
            }
            onClose={closeDetailPanel}
          />
        </div>
      )}
    </div>
  );
};

export default FXPositionsView;
