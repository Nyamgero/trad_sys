// ============================================
// hooks/queries/useBondPositions.ts
// ============================================

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { bondApi } from '@/services/api';
import type { PositionQueryParams } from '@/services/api';
import type { BondPosition } from '@/features/trading/positions/bond';

export const BOND_QUERY_KEYS = {
  all: ['bond'] as const,
  positions: () => [...BOND_QUERY_KEYS.all, 'positions'] as const,
  positionsList: (params?: PositionQueryParams) =>
    [...BOND_QUERY_KEYS.positions(), params] as const,
  position: (id: string) => [...BOND_QUERY_KEYS.all, 'position', id] as const,
  summary: () => [...BOND_QUERY_KEYS.all, 'summary'] as const,
};

export function useBondPositions(params?: PositionQueryParams) {
  return useQuery({
    queryKey: BOND_QUERY_KEYS.positionsList(params),
    queryFn: () => bondApi.getPositions(params),
    staleTime: 30000, // Bonds update less frequently
    refetchInterval: 30000,
  });
}

export function useBondPosition(id: string) {
  return useQuery({
    queryKey: BOND_QUERY_KEYS.position(id),
    queryFn: () => bondApi.getPosition(id),
    enabled: !!id,
    staleTime: 30000,
  });
}

export function useBondSummary() {
  return useQuery({
    queryKey: BOND_QUERY_KEYS.summary(),
    queryFn: () => bondApi.getSummary(),
    staleTime: 30000,
    refetchInterval: 30000,
  });
}

export function useBondPositionUpdate() {
  const queryClient = useQueryClient();

  const updatePosition = (id: string, updates: Partial<BondPosition>) => {
    queryClient.setQueryData(
      BOND_QUERY_KEYS.positionsList(),
      (old: any) => {
        if (!old?.data?.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            data: old.data.data.map((pos: BondPosition) =>
              pos.id === id ? { ...pos, ...updates } : pos
            ),
          },
        };
      }
    );
  };

  const invalidatePositions = () => {
    queryClient.invalidateQueries({ queryKey: BOND_QUERY_KEYS.positions() });
  };

  return { updatePosition, invalidatePositions };
}
