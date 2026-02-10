// ============================================
// hooks/queries/useFXPositions.ts
// ============================================

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fxApi } from '@/services/api';
import type { PositionQueryParams } from '@/services/api';
import type { FXPosition } from '@/features/trading/positions/fx';

export const FX_QUERY_KEYS = {
  all: ['fx'] as const,
  positions: () => [...FX_QUERY_KEYS.all, 'positions'] as const,
  positionsList: (params?: PositionQueryParams) =>
    [...FX_QUERY_KEYS.positions(), params] as const,
  position: (id: string) => [...FX_QUERY_KEYS.all, 'position', id] as const,
  summary: () => [...FX_QUERY_KEYS.all, 'summary'] as const,
};

export function useFXPositions(params?: PositionQueryParams) {
  return useQuery({
    queryKey: FX_QUERY_KEYS.positionsList(params),
    queryFn: () => fxApi.getPositions(params),
    staleTime: 500, // FX updates more frequently
    refetchInterval: 500,
  });
}

export function useFXPosition(id: string) {
  return useQuery({
    queryKey: FX_QUERY_KEYS.position(id),
    queryFn: () => fxApi.getPosition(id),
    enabled: !!id,
    staleTime: 500,
  });
}

export function useFXSummary() {
  return useQuery({
    queryKey: FX_QUERY_KEYS.summary(),
    queryFn: () => fxApi.getSummary(),
    staleTime: 1000,
    refetchInterval: 1000,
  });
}

export function useFXPositionUpdate() {
  const queryClient = useQueryClient();

  const updatePosition = (id: string, updates: Partial<FXPosition>) => {
    queryClient.setQueryData(
      FX_QUERY_KEYS.positionsList(),
      (old: any) => {
        if (!old?.data?.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            data: old.data.data.map((pos: FXPosition) =>
              pos.id === id ? { ...pos, ...updates } : pos
            ),
          },
        };
      }
    );
  };

  const invalidatePositions = () => {
    queryClient.invalidateQueries({ queryKey: FX_QUERY_KEYS.positions() });
  };

  return { updatePosition, invalidatePositions };
}
