// ============================================
// services/websocket/types.ts
// ============================================

export type AssetClass = 'equity' | 'etf' | 'fx' | 'bond';

export interface PriceUpdate {
  identifier: string;
  assetClass: AssetClass;
  bid: number;
  ask: number;
  last: number;
  change: number;
  changePercent: number;
  volume?: number;
  timestamp: string;
}

export interface PositionUpdate {
  positionId: string;
  assetClass: AssetClass;
  marketValue: number;
  dayPnL: number;
  dayPnLPercent: number;
  timestamp: string;
}

export interface AlertMessage {
  id: string;
  severity: 'info' | 'warning' | 'error';
  title: string;
  message: string;
  positionId?: string;
  assetClass?: AssetClass;
  timestamp: string;
}

export type WebSocketMessageType = 'price' | 'position' | 'alert' | 'heartbeat' | 'subscribe' | 'unsubscribe';

export interface WebSocketMessage<T = unknown> {
  type: WebSocketMessageType;
  payload: T;
  timestamp: string;
}

export interface SubscriptionRequest {
  channel: 'prices' | 'positions' | 'alerts';
  assetClass?: AssetClass;
  identifiers?: string[];
}

export type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export interface WebSocketEventHandlers {
  onPrice?: (update: PriceUpdate) => void;
  onPosition?: (update: PositionUpdate) => void;
  onAlert?: (alert: AlertMessage) => void;
  onStatusChange?: (status: WebSocketStatus) => void;
  onError?: (error: Error) => void;
}
