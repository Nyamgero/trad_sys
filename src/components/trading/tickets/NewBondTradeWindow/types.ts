// ============================================
// NewBondTradeWindow/types.ts - Type Definitions
// ============================================

// Direction (Buy/Sell for bonds)
export type BondDirection = 'BUY' | 'SELL';

// Capacity types
export type BondCapacity = 'PRINCIPAL' | 'AGENCY';

// Day count conventions
export type DayCountConvention =
  | 'ACT/ACT'      // US Treasury
  | 'ACT/360'      // Money market
  | 'ACT/365'      // UK Gilts
  | '30/360'       // US Corporate
  | '30E/360';     // Eurobond

// Settlement conventions
export type SettlementConvention = 'T+0' | 'T+1' | 'T+2' | 'T+3';

// Special conditions
export type SpecialCondition =
  | 'PORTFOLIO_TRADE'
  | 'WHEN_ISSUED'
  | 'ODD_LOT'
  | 'BLOCK';

// Trade status
export type BondTradeStatus = 'pending' | 'confirmed' | 'settled' | 'cancelled';

// Bond instrument details
export interface BondInstrumentDetails {
  issuer: string;
  couponRate: number;
  couponFrequency: number;  // 1=Annual, 2=Semi-Annual, 4=Quarterly
  maturityDate: Date;
  dayCountConvention: DayCountConvention;
  issueDate: Date;
  firstCouponDate?: Date;
  creditRating?: string;
  outstandingAmount?: number;
  callable?: boolean;
  minimumLotSize: number;
}

// Bond instrument for autocomplete
export interface BondInstrument {
  isin: string;
  cusip?: string;
  description: string;
  issuer: string;
  couponRate: number;
  couponFrequency: number;
  maturityDate: string;  // ISO string
  currency: string;
  dayCountConvention: DayCountConvention;
  issueDate: string;  // ISO string
  firstCouponDate?: string;
  creditRating?: string;
  outstandingAmount?: number;
  callable?: boolean;
  minimumLotSize: number;
  bondType: 'TREASURY' | 'CORPORATE' | 'MUNICIPAL' | 'AGENCY' | 'SOVEREIGN';
}

// Bond quote data
export interface BondQuoteData {
  bid: number;
  ask: number;
  lastPrice: number;
  lastYield: number;
  volume: number;
}

// Fund reference
export interface Fund {
  id: string;
  name: string;
  aum: number;
  strategy: string;
  durationTarget: string;
  currentDuration: number;
  cashAvailable: number;
  baseCurrency: string;
}

// Counterparty reference
export interface Counterparty {
  id: string;
  code: string;
  name: string;
  lei: string;
  currentExposure?: number;
  exposureLimit?: number;
}

// Trader reference
export interface BondTrader {
  id: string;
  name: string;
}

// Execution venue
export interface ExecutionVenue {
  id: string;
  name: string;
}

// Yield and risk metrics
export interface YieldMetrics {
  modifiedDuration: number;
  macaulayDuration: number;
  convexity: number;
  spreadToBenchmark: number;
  dv01: number;
}

// Accrued interest calculation
export interface AccruedInterestCalc {
  lastCouponDate: Date;
  settlementDate: Date;
  daysAccrued: number;
  daysInPeriod: number;
  accruedPercent: number;
  accruedAmount: number;
}

// Settlement calculation
export interface SettlementCalculation {
  principalValue: number;
  accruedInterest: number;
  dirtyValue: number;
  commission: number;
  taxes: number;
  netSettlement: number;
  baseCurrencyAmount: number;
}

// Main bond trade form state
export interface BondTradeFormState {
  // Tab 1: Bond Identification
  tradeReference?: string;
  bondIdentifier: string;
  bondName: string;
  currency: string;
  bondDetails?: BondInstrumentDetails;

  // Tab 2: Transaction Details
  direction: BondDirection;
  faceValue: number | null;
  executionVenue: string;
  capacity: BondCapacity;
  specialConditions: SpecialCondition[];

  // Tab 3: Pricing & Yield
  cleanPrice: number | null;
  accruedInterest: number;
  dirtyPrice: number;
  ytm: number | null;
  yieldToWorst?: number;
  currentMarketYield?: number;
  yieldMetrics?: YieldMetrics;

  // Tab 4: Parties & Accounts
  fundAccountId: string;
  counterparty: string;
  traderId: string;

  // Tab 5: Settlement & Costs
  tradeDate: Date;
  tradeTime?: string;
  settlementDate: Date;
  settlementConvention: SettlementConvention;
  valueDate?: Date;
  commissionFees: number | null;
  taxesWithholding: number | null;
  netSettlementAmount: number;
  fxRate?: number;
  tradeStatus: BondTradeStatus;
  notes?: string;
}

// Tab definitions
export type BondTabId = 'bond-id' | 'transaction' | 'pricing' | 'parties' | 'settlement';

export interface BondTabDefinition {
  id: BondTabId;
  label: string;
  shortcut: string;
}

export const BOND_TABS: BondTabDefinition[] = [
  { id: 'bond-id', label: 'Bond ID', shortcut: 'Ctrl+1' },
  { id: 'transaction', label: 'Transaction', shortcut: 'Ctrl+2' },
  { id: 'pricing', label: 'Pricing & Yield', shortcut: 'Ctrl+3' },
  { id: 'parties', label: 'Parties', shortcut: 'Ctrl+4' },
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
export interface InitialBondStateOptions {
  currentUserId?: string;
  defaultFund?: string;
}
