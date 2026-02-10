// ============================================
// hooks/queries/useETFPositions.ts
// ============================================

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { etfApi } from '@/services/api';
import type { PositionQueryParams } from '@/services/api';
import type { ETFPosition } from '@/features/trading/positions/etf';

export const ETF_QUERY_KEYS = {
  all: ['etf'] as const,
  positions: () => [...ETF_QUERY_KEYS.all, 'positions'] as const,
  positionsList: (params?: PositionQueryParams) =>
    [...ETF_QUERY_KEYS.positions(), params] as const,
  position: (id: string) => [...ETF_QUERY_KEYS.all, 'position', id] as const,
  summary: () => [...ETF_QUERY_KEYS.all, 'summary'] as const,
};

export function useETFPositions(params?: PositionQueryParams) {
  return useQuery({
    queryKey: ETF_QUERY_KEYS.positionsList(params),
    queryFn: () => etfApi.getPositions(params),
    staleTime: 5000,
    refetchInterval: 5000,
  });
}

export function useETFPosition(id: string) {
  return useQuery({
    queryKey: ETF_QUERY_KEYS.position(id),
    queryFn: () => etfApi.getPosition(id),
    enabled: !!id,
    staleTime: 5000,
  });
}

export function useETFSummary() {
  return useQuery({
    queryKey: ETF_QUERY_KEYS.summary(),
    queryFn: () => etfApi.getSummary(),
    staleTime: 5000,
    refetchInterval: 5000,
  });
}

export function useETFPositionUpdate() {
  const queryClient = useQueryClient();

  const updatePosition = (id: string, updates: Partial<ETFPosition>) => {
    queryClient.setQueryData(
      ETF_QUERY_KEYS.positionsList(),
      (old: any) => {
        if (!old?.data?.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            data: old.data.data.map((pos: ETFPosition) =>
              pos.id === id ? { ...pos, ...updates } : pos
            ),
          },
        };
      }
    );
  };

  const invalidatePositions = () => {
    queryClient.invalidateQueries({ queryKey: ETF_QUERY_KEYS.positions() });
  };

  return { updatePosition, invalidatePositions };
}
