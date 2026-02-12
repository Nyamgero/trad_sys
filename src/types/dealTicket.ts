// ============================================
// types/dealTicket.ts - Deal Ticket Type Definitions
// ============================================

export type TicketType = 'equity' | 'fx' | 'fixed-income' | 'etf' | 'mm';
export type TicketSubType = 'spot' | 'forward' | 'bonds';
export type TradeSide = 'buy' | 'sell';
export type OrderType = 'market' | 'limit' | 'stop' | 'stop-limit';
export type TimeInForce = 'day' | 'gtc' | 'ioc' | 'fok';

export interface TicketPosition {
  x: number;
  y: number;
}

export interface DealTicket {
  id: string;
  type: TicketType;
  subType?: TicketSubType;
  position: TicketPosition;
  zIndex: number;
  data: Record<string, unknown>;
}

export interface OpenTicketConfig {
  type: TicketType;
  subType?: TicketSubType;
  initialData?: Record<string, unknown>;
}

// Form Data Types
export interface BaseTradeData {
  side: TradeSide;
  quantity: number;
  orderType: OrderType;
  timeInForce: TimeInForce;
}

export interface EquityTradeData extends BaseTradeData {
  symbol: string;
  price?: number;
  stopPrice?: number;
  account: string;
}

export interface FXSpotTradeData extends BaseTradeData {
  currencyPair: string;
  rate?: number;
  settlementDate: string;
  account: string;
}

export interface FXForwardTradeData extends BaseTradeData {
  currencyPair: string;
  forwardRate?: number;
  spotRate?: number;
  forwardPoints?: number;
  valueDate: string;
  account: string;
}

export interface BondTradeData extends BaseTradeData {
  isin: string;
  cusip?: string;
  price?: number;
  yield?: number;
  settlementDate: string;
  account: string;
}

export interface ETFTradeData extends BaseTradeData {
  symbol: string;
  price?: number;
  nav?: number;
  account: string;
}

export interface MMTradeData {
  instrument: string;
  principal: number;
  rate: number;
  startDate: string;
  maturityDate: string;
  dayCount: string;
  account: string;
}

export type TradeData =
  | EquityTradeData
  | FXSpotTradeData
  | FXForwardTradeData
  | BondTradeData
  | ETFTradeData
  | MMTradeData;
