// ============================================
// services/api/types.ts
// ============================================

export interface ApiResponse<T> {
  data: T;
  timestamp: string;
  requestId: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface QueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, string | number | boolean>;
}

export interface PositionQueryParams extends QueryParams {
  assetClass?: 'equity' | 'etf' | 'fx' | 'bond';
  currency?: string;
  exchange?: string;
}

export interface PriceUpdate {
  identifier: string;
  assetClass: 'equity' | 'etf' | 'fx' | 'bond';
  bid: number;
  ask: number;
  last: number;
  change: number;
  changePercent: number;
  volume?: number;
  timestamp: string;
}

export interface WebSocketMessage<T = unknown> {
  type: 'price' | 'position' | 'alert' | 'heartbeat';
  payload: T;
  timestamp: string;
}
