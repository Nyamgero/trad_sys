// ============================================
// services/api/positions.ts
// ============================================

import { apiClient } from './client';
import type { ApiResponse, PaginatedResponse, PositionQueryParams } from './types';
import type { EquityPosition, EquityPositionExpanded, EquityPortfolioSummary } from '@/features/trading/positions/equity';
import type { ETFPosition, ETFPositionExpanded, ETFPortfolioSummary } from '@/features/trading/positions/etf';
import type { FXPosition, FXPositionExpanded, FXPortfolioSummary } from '@/features/trading/positions/fx';
import type { BondPosition, BondPositionExpanded, BondPortfolioSummary } from '@/features/trading/positions/bond';

// Equity Positions API
export const equityApi = {
  getPositions: (params?: PositionQueryParams) =>
    apiClient.get<PaginatedResponse<EquityPosition>>('/positions/equity', params),

  getPosition: (id: string) =>
    apiClient.get<EquityPositionExpanded>(`/positions/equity/${id}`),

  getSummary: () =>
    apiClient.get<EquityPortfolioSummary>('/positions/equity/summary'),
};

// ETF Positions API
export const etfApi = {
  getPositions: (params?: PositionQueryParams) =>
    apiClient.get<PaginatedResponse<ETFPosition>>('/positions/etf', params),

  getPosition: (id: string) =>
    apiClient.get<ETFPositionExpanded>(`/positions/etf/${id}`),

  getSummary: () =>
    apiClient.get<ETFPortfolioSummary>('/positions/etf/summary'),
};

// FX Positions API
export const fxApi = {
  getPositions: (params?: PositionQueryParams) =>
    apiClient.get<PaginatedResponse<FXPosition>>('/positions/fx', params),

  getPosition: (id: string) =>
    apiClient.get<FXPositionExpanded>(`/positions/fx/${id}`),

  getSummary: () =>
    apiClient.get<FXPortfolioSummary>('/positions/fx/summary'),
};

// Bond Positions API
export const bondApi = {
  getPositions: (params?: PositionQueryParams) =>
    apiClient.get<PaginatedResponse<BondPosition>>('/positions/bond', params),

  getPosition: (id: string) =>
    apiClient.get<BondPositionExpanded>(`/positions/bond/${id}`),

  getSummary: () =>
    apiClient.get<BondPortfolioSummary>('/positions/bond/summary'),
};

// Combined positions API
export const positionsApi = {
  equity: equityApi,
  etf: etfApi,
  fx: fxApi,
  bond: bondApi,
};

export default positionsApi;
