// ============================================
// NewMMTradeWindow/types.ts - Type Definitions
// ============================================

// Direction (Placement = lend, Borrowing = take)
export type MMDirection = 'PLACEMENT' | 'BORROWING';

// Deposit types
export type DepositType = 'CALL' | 'NOTICE' | 'FIXED' | 'TERM';

// Rate types
export type RateType = 'FIXED' | 'FLOATING';

// Day count conventions
export type MMDayCountConvention = 'ACT/365' | 'ACT/360' | '30/360';

// Interest frequency
export type InterestFrequency = 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUAL' | 'AT_MATURITY';

// Compounding type
export type CompoundingType = 'SIMPLE' | 'COMPOUND';

// Settlement type
export type SettlementType = 'SAME_DAY' | 'NEXT_DAY';

// Confirmation method
export type ConfirmationMethod = 'SWIFT_MT320' | 'EMAIL' | 'FAX';

// Trade status
export type MMTradeStatus = 'DRAFT' | 'PENDING' | 'CONFIRMED' | 'ACTIVE' | 'MATURED' | 'CANCELLED';

// Tenor preset
export type TenorPreset = 'O/N' | '1W' | '2W' | '1M' | '2M' | '3M' | '6M' | '9M' | '12M' | 'CUSTOM';

// Approval step status
export type ApprovalStepStatus = 'COMPLETED' | 'PENDING' | 'NOT_STARTED';

// Compliance check status
export type ComplianceCheckStatus = 'PASS' | 'WARN' | 'FAIL';

// Approval workflow step
export interface ApprovalStep {
  step: string;
  status: ApprovalStepStatus;
  approver?: string;
  timestamp?: Date;
}

// Compliance check result
export interface ComplianceCheck {
  rule: string;
  status: ComplianceCheckStatus;
  current: string;
  limit: string;
  message: string;
}

// Bank counterparty
export interface BankCounterparty {
  id: string;
  name: string;
  shortName: string;
  lei: string;
  swiftCode: string;
  creditRating: {
    fitch?: string;
    moodys?: string;
    sp?: string;
  };
  country: string;
  approvedLimit: number;
  currentExposure: number;
  availableLimit: number;
  contacts: BankContact[];
}

// Bank contact
export interface BankContact {
  name: string;
  role: string;
  phone: string;
  email: string;
}

// Fund for MM
export interface MMFund {
  id: string;
  name: string;
  aum: number;
  availableCash: number;
  currentPlacements: number;
  pendingMaturities: number;
  singleBankLimit: number;
  baseCurrency: string;
}

// Funding account
export interface FundingAccount {
  id: string;
  name: string;
  accountNumber: string;
  bank: string;
  currency: string;
  balance: number;
  available: number;
}

// Trader reference
export interface MMTrader {
  id: string;
  name: string;
}

// Reference rates
export interface ReferenceRates {
  sarb_repo: number;
  prime: number;
  jibar_1m: number;
  jibar_3m: number;
  jibar_6m: number;
  jibar_12m: number;
  asOf: Date;
}

// Main trade form state
export interface MMTradeFormState {
  // Tab 1: Deposit Details
  tradeReference?: string;
  direction: MMDirection;
  depositType: DepositType;
  principalAmount: number | null;
  currency: string;
  tradeDate: Date;
  valueDate: Date;
  tenor: TenorPreset;
  maturityDate: Date | null;
  days: number;
  noticePeriod?: number;

  // Tab 2: Pricing & Interest
  rateType: RateType;
  interestRate: number | null;
  dayCountConvention: MMDayCountConvention;
  referenceRate?: string;
  currentReference?: number;
  spreadBps?: number;
  allInRate?: number;
  interestFrequency: InterestFrequency;
  compounding: CompoundingType;
  interestAmount: number;
  maturityProceeds: number;
  autoRollover: boolean;
  rolloverTenor?: string;
  capitalizeInterest: boolean;

  // Tab 3: Counterparty & Account
  fundId: string;
  counterpartyBank: string;
  dealerBroker: string;
  traderId: string;
  confirmationMethod: ConfirmationMethod;
  bankContact?: string;

  // Tab 4: Settlement
  settlementType: SettlementType;
  fundingAccount: string;
  bankSwift?: string;
  bankAccountNumber?: string;
  paymentReference: string;
  specialInstructions?: string;

  // Tab 5: Status & Notes
  tradeStatus: MMTradeStatus;
  approvalWorkflow?: ApprovalStep[];
  complianceChecks?: ComplianceCheck[];
  notes?: string;
  internalReference?: string;
  externalReference?: string;

  // Audit
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  version?: number;
}

// Tab definitions
export type MMTabId = 'deposit-details' | 'pricing' | 'counterparty' | 'settlement' | 'status';

export interface MMTabDefinition {
  id: MMTabId;
  label: string;
  shortcut: string;
}

export const MM_TABS: MMTabDefinition[] = [
  { id: 'deposit-details', label: 'Deposit Details', shortcut: 'Ctrl+1' },
  { id: 'pricing', label: 'Pricing', shortcut: 'Ctrl+2' },
  { id: 'counterparty', label: 'Counterparty', shortcut: 'Ctrl+3' },
  { id: 'settlement', label: 'Settlement', shortcut: 'Ctrl+4' },
  { id: 'status', label: 'Status', shortcut: 'Ctrl+5' },
];

// Validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
}

// Initial state factory type
export interface InitialMMStateOptions {
  currentUserId?: string;
  defaultFund?: string;
}

// Deposit type config
export interface DepositTypeConfig {
  type: DepositType;
  hasMaturity: boolean;
  hasNoticePeriod: boolean;
  defaultDayCount: MMDayCountConvention;
  minTenor?: number;
  maxTenor?: number;
  rolloverAllowed: boolean;
}

export const DEPOSIT_TYPE_CONFIGS: Record<DepositType, DepositTypeConfig> = {
  'CALL': {
    type: 'CALL',
    hasMaturity: false,
    hasNoticePeriod: false,
    defaultDayCount: 'ACT/365',
    rolloverAllowed: false,
  },
  'NOTICE': {
    type: 'NOTICE',
    hasMaturity: false,
    hasNoticePeriod: true,
    defaultDayCount: 'ACT/365',
    rolloverAllowed: false,
  },
  'FIXED': {
    type: 'FIXED',
    hasMaturity: true,
    hasNoticePeriod: false,
    defaultDayCount: 'ACT/365',
    minTenor: 7,
    maxTenor: 365,
    rolloverAllowed: true,
  },
  'TERM': {
    type: 'TERM',
    hasMaturity: true,
    hasNoticePeriod: false,
    defaultDayCount: 'ACT/365',
    minTenor: 30,
    maxTenor: 1825,
    rolloverAllowed: true,
  },
};

// Tenor days mapping
export const TENOR_DAYS: Record<TenorPreset, number | null> = {
  'O/N': 1,
  '1W': 7,
  '2W': 14,
  '1M': 30,
  '2M': 60,
  '3M': 91,
  '6M': 182,
  '9M': 273,
  '12M': 365,
  'CUSTOM': null,
};
