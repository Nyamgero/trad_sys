// ============================================
// NewEquityTradeWindow/types.ts - Type Definitions
// ============================================

// Trade sides
export type TradeSide = 'BUY' | 'SELL' | 'SHORT_SELL' | 'BUY_TO_COVER';

// Order types
export type OrderType = 'MARKET' | 'LIMIT' | 'VWAP' | 'BLOCK' | 'STOP';

// Capacity types
export type Capacity = 'AGENCY' | 'PRINCIPAL' | 'RISKLESS_PRINCIPAL';

// Settlement cycles
export type SettlementCycle = 'T+0' | 'T+1' | 'T+2' | 'T+3';

// Status types
export type SettlementStatus = 'PENDING' | 'SETTLED' | 'FAILED' | 'CANCELLED';
export type TradeStatus = 'NEW' | 'EXECUTED' | 'ALLOCATED' | 'CONFIRMED' | 'REJECTED' | 'AMENDED';

// Security for autocomplete
export interface Security {
  ticker: string;
  isin: string;
  name: string;
  primaryExchange: string;
  tradingCurrency: string;
  tickSize: number;
}

// Quote data
export interface QuoteData {
  last: number;
  bid: number;
  ask: number;
  volume: number;
  change: number;
  changePercent: number;
}

// Portfolio reference
export interface Portfolio {
  id: string;
  name: string;
  aum?: number;
  strategy?: string;
  baseCurrency: string;
}

// Trader reference
export interface Trader {
  id: string;
  name: string;
}

// Broker reference
export interface Broker {
  id: string;
  code: string;
  name: string;
  lei?: string;
}

// Custodian reference
export interface Custodian {
  id: string;
  code: string;
  name: string;
}

// Main trade form state
export interface TradeFormState {
  // Tab 1: Instrument Identification
  tickerSymbol: string;
  isin: string;
  micCode: string;
  currency: string;
  securityName?: string;

  // Tab 2: Trade Details
  tradeId?: string;
  orderId?: string;
  side: TradeSide;
  quantity: number | null;
  executionPrice: number | null;
  grossConsideration: number;
  tradeDate: Date;
  transactTimestamp?: Date;
  orderType: OrderType;
  shortSellFlag: boolean;
  capacity: Capacity;

  // Tab 3: Costs & Financials
  commission: number | null;
  sttTax: number;
  otherFees: number | null;
  netConsideration: number;
  fxRate?: number;

  // Tab 4: Booking
  portfolioId: string;
  traderId: string;
  brokerId: string;
  clientId?: string;
  bookImmediately: boolean;
  routeToCompliance: boolean;

  // Tab 5: Settlement
  settlementDate: Date;
  settlementCycle: SettlementCycle;
  custodian?: string;
  settlementStatus: SettlementStatus;
  tradeStatus: TradeStatus;
  notes?: string;
}

// Tab definitions
export type TabId = 'instrument' | 'trade-details' | 'costs' | 'booking' | 'settlement';

export interface TabDefinition {
  id: TabId;
  label: string;
  shortcut: string;
}

export const TABS: TabDefinition[] = [
  { id: 'instrument', label: 'Instrument', shortcut: 'Ctrl+1' },
  { id: 'trade-details', label: 'Trade Details', shortcut: 'Ctrl+2' },
  { id: 'costs', label: 'Costs', shortcut: 'Ctrl+3' },
  { id: 'booking', label: 'Booking', shortcut: 'Ctrl+4' },
  { id: 'settlement', label: 'Settlement', shortcut: 'Ctrl+5' },
];

// Validation error type
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
}

export interface ValidationState {
  errors: ValidationError[];
  warnings: ValidationWarning[];
  isValid: boolean;
}

// Initial state factory type
export interface InitialStateOptions {
  currentUserId?: string;
  defaultPortfolio?: string;
}
