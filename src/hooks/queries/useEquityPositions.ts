// ============================================
// hooks/queries/useEquityPositions.ts
// ============================================

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { equityApi } from '@/services/api';
import type { PositionQueryParams } from '@/services/api';
import type { EquityPosition, EquityPositionExpanded, EquityPortfolioSummary } from '@/features/trading/positions/equity';

export const EQUITY_QUERY_KEYS = {
  all: ['equity'] as const,
  positions: () => [...EQUITY_QUERY_KEYS.all, 'positions'] as const,
  positionsList: (params?: PositionQueryParams) =>
    [...EQUITY_QUERY_KEYS.positions(), params] as const,
  position: (id: string) => [...EQUITY_QUERY_KEYS.all, 'position', id] as const,
  summary: () => [...EQUITY_QUERY_KEYS.all, 'summary'] as const,
};

export function useEquityPositions(params?: PositionQueryParams) {
  return useQuery({
    queryKey: EQUITY_QUERY_KEYS.positionsList(params),
    queryFn: () => equityApi.getPositions(params),
    staleTime: 5000, // 5 seconds
    refetchInterval: 5000,
  });
}

export function useEquityPosition(id: string) {
  return useQuery({
    queryKey: EQUITY_QUERY_KEYS.position(id),
    queryFn: () => equityApi.getPosition(id),
    enabled: !!id,
    staleTime: 5000,
  });
}

export function useEquitySummary() {
  return useQuery({
    queryKey: EQUITY_QUERY_KEYS.summary(),
    queryFn: () => equityApi.getSummary(),
    staleTime: 5000,
    refetchInterval: 5000,
  });
}

export function useEquityPositionUpdate() {
  const queryClient = useQueryClient();

  const updatePosition = (id: string, updates: Partial<EquityPosition>) => {
    queryClient.setQueryData(
      EQUITY_QUERY_KEYS.positionsList(),
      (old: any) => {
        if (!old?.data?.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            data: old.data.data.map((pos: EquityPosition) =>
              pos.id === id ? { ...pos, ...updates } : pos
            ),
          },
        };
      }
    );
  };

  const invalidatePositions = () => {
    queryClient.invalidateQueries({ queryKey: EQUITY_QUERY_KEYS.positions() });
  };

  return { updatePosition, invalidatePositions };
}
