// ============================================
// stores/positionsStore.ts
// ============================================

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type AssetClass = 'equity' | 'etf' | 'fx' | 'bond';
export type SortOrder = 'asc' | 'desc';

interface ColumnVisibility {
  [columnId: string]: boolean;
}

interface SortState {
  column: string | null;
  order: SortOrder;
}

interface FilterState {
  search: string;
  currency?: string;
  exchange?: string;
  [key: string]: string | undefined;
}

interface AssetClassState {
  expandedRowIds: Set<string>;
  selectedRowIds: Set<string>;
  columnVisibility: ColumnVisibility;
  sort: SortState;
  filters: FilterState;
}

interface PositionsState {
  activeAssetClass: AssetClass;
  equity: AssetClassState;
  etf: AssetClassState;
  fx: AssetClassState;
  bond: AssetClassState;

  // Actions
  setActiveAssetClass: (assetClass: AssetClass) => void;
  toggleRowExpanded: (assetClass: AssetClass, rowId: string) => void;
  setRowExpanded: (assetClass: AssetClass, rowId: string, expanded: boolean) => void;
  collapseAllRows: (assetClass: AssetClass) => void;
  toggleRowSelected: (assetClass: AssetClass, rowId: string) => void;
  setRowSelected: (assetClass: AssetClass, rowId: string, selected: boolean) => void;
  selectAllRows: (assetClass: AssetClass, rowIds: string[]) => void;
  clearSelection: (assetClass: AssetClass) => void;
  setColumnVisibility: (assetClass: AssetClass, columnId: string, visible: boolean) => void;
  setSort: (assetClass: AssetClass, column: string | null, order?: SortOrder) => void;
  setFilter: (assetClass: AssetClass, key: string, value: string | undefined) => void;
  clearFilters: (assetClass: AssetClass) => void;
  resetState: (assetClass: AssetClass) => void;
}

const createDefaultAssetClassState = (): AssetClassState => ({
  expandedRowIds: new Set(),
  selectedRowIds: new Set(),
  columnVisibility: {},
  sort: { column: null, order: 'asc' },
  filters: { search: '' },
});

export const usePositionsStore = create<PositionsState>()(
  devtools(
    (set, get) => ({
      activeAssetClass: 'equity',
      equity: createDefaultAssetClassState(),
      etf: createDefaultAssetClassState(),
      fx: createDefaultAssetClassState(),
      bond: createDefaultAssetClassState(),

      setActiveAssetClass: (assetClass) => set({ activeAssetClass: assetClass }),

      toggleRowExpanded: (assetClass, rowId) =>
        set((state) => {
          const newExpanded = new Set(state[assetClass].expandedRowIds);
          if (newExpanded.has(rowId)) {
            newExpanded.delete(rowId);
          } else {
            newExpanded.add(rowId);
          }
          return {
            [assetClass]: { ...state[assetClass], expandedRowIds: newExpanded },
          };
        }),

      setRowExpanded: (assetClass, rowId, expanded) =>
        set((state) => {
          const newExpanded = new Set(state[assetClass].expandedRowIds);
          if (expanded) {
            newExpanded.add(rowId);
          } else {
            newExpanded.delete(rowId);
          }
          return {
            [assetClass]: { ...state[assetClass], expandedRowIds: newExpanded },
          };
        }),

      collapseAllRows: (assetClass) =>
        set((state) => ({
          [assetClass]: { ...state[assetClass], expandedRowIds: new Set() },
        })),

      toggleRowSelected: (assetClass, rowId) =>
        set((state) => {
          const newSelected = new Set(state[assetClass].selectedRowIds);
          if (newSelected.has(rowId)) {
            newSelected.delete(rowId);
          } else {
            newSelected.add(rowId);
          }
          return {
            [assetClass]: { ...state[assetClass], selectedRowIds: newSelected },
          };
        }),

      setRowSelected: (assetClass, rowId, selected) =>
        set((state) => {
          const newSelected = new Set(state[assetClass].selectedRowIds);
          if (selected) {
            newSelected.add(rowId);
          } else {
            newSelected.delete(rowId);
          }
          return {
            [assetClass]: { ...state[assetClass], selectedRowIds: newSelected },
          };
        }),

      selectAllRows: (assetClass, rowIds) =>
        set((state) => ({
          [assetClass]: {
            ...state[assetClass],
            selectedRowIds: new Set(rowIds),
          },
        })),

      clearSelection: (assetClass) =>
        set((state) => ({
          [assetClass]: { ...state[assetClass], selectedRowIds: new Set() },
        })),

      setColumnVisibility: (assetClass, columnId, visible) =>
        set((state) => ({
          [assetClass]: {
            ...state[assetClass],
            columnVisibility: {
              ...state[assetClass].columnVisibility,
              [columnId]: visible,
            },
          },
        })),

      setSort: (assetClass, column, order) =>
        set((state) => {
          const currentSort = state[assetClass].sort;
          let newOrder: SortOrder = order || 'asc';

          if (!order && currentSort.column === column) {
            newOrder = currentSort.order === 'asc' ? 'desc' : 'asc';
          }

          return {
            [assetClass]: {
              ...state[assetClass],
              sort: { column, order: newOrder },
            },
          };
        }),

      setFilter: (assetClass, key, value) =>
        set((state) => ({
          [assetClass]: {
            ...state[assetClass],
            filters: { ...state[assetClass].filters, [key]: value },
          },
        })),

      clearFilters: (assetClass) =>
        set((state) => ({
          [assetClass]: {
            ...state[assetClass],
            filters: { search: '' },
          },
        })),

      resetState: (assetClass) =>
        set({ [assetClass]: createDefaultAssetClassState() }),
    }),
    { name: 'positions-store' }
  )
);
