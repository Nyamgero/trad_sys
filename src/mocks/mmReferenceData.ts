// ============================================
// mocks/mmReferenceData.ts - Mock Money Market Reference Data
// ============================================

import type {
  BankCounterparty,
  MMFund,
  FundingAccount,
  MMTrader,
  ReferenceRates,
} from '@/components/trading/tickets/NewMMTradeWindow/types';

// Mock bank counterparties
export const mockBanks: BankCounterparty[] = [
  {
    id: 'ABSA',
    name: 'ABSA Bank Limited',
    shortName: 'ABSA',
    lei: '894500NKLFEHI2E2HC95',
    swiftCode: 'ABSAZAJJ',
    creditRating: {
      fitch: 'AA-',
      moodys: 'Aa3',
      sp: 'AA-',
    },
    country: 'South Africa',
    approvedLimit: 500000000,
    currentExposure: 320000000,
    availableLimit: 180000000,
    contacts: [
      { name: 'John Mokoena', role: 'Treasury Desk', phone: '+27 11 350 4000', email: 'john.mokoena@absa.co.za' },
    ],
  },
  {
    id: 'SBSA',
    name: 'Standard Bank of South Africa Limited',
    shortName: 'Standard Bank',
    lei: '213800F62CPDBJ7SG310',
    swiftCode: 'SBZAZAJJ',
    creditRating: {
      fitch: 'AA-',
      moodys: 'Aa3',
      sp: 'AA-',
    },
    country: 'South Africa',
    approvedLimit: 600000000,
    currentExposure: 250000000,
    availableLimit: 350000000,
    contacts: [
      { name: 'Thabo Ndlovu', role: 'Money Markets', phone: '+27 11 636 9111', email: 'thabo.ndlovu@standardbank.co.za' },
    ],
  },
  {
    id: 'NEDBANK',
    name: 'Nedbank Limited',
    shortName: 'Nedbank',
    lei: '549300K1LRE5P7E56B12',
    swiftCode: 'NEDSZAJJ',
    creditRating: {
      fitch: 'AA-',
      moodys: 'Aa3',
      sp: 'A+',
    },
    country: 'South Africa',
    approvedLimit: 450000000,
    currentExposure: 180000000,
    availableLimit: 270000000,
    contacts: [
      { name: 'Sarah van der Merwe', role: 'Treasury Sales', phone: '+27 11 295 5555', email: 'sarah.vdmerwe@nedbank.co.za' },
    ],
  },
  {
    id: 'FNB',
    name: 'FirstRand Bank Limited (FNB)',
    shortName: 'FirstRand/FNB',
    lei: '529900XXDQWV8ZJ9NL07',
    swiftCode: 'FIRNZAJJ',
    creditRating: {
      fitch: 'AA-',
      moodys: 'Aa3',
      sp: 'AA-',
    },
    country: 'South Africa',
    approvedLimit: 500000000,
    currentExposure: 420000000,
    availableLimit: 80000000,
    contacts: [
      { name: 'Pieter Botha', role: 'Fixed Income', phone: '+27 11 282 1808', email: 'pieter.botha@fnb.co.za' },
    ],
  },
  {
    id: 'INVESTEC',
    name: 'Investec Bank Limited',
    shortName: 'Investec',
    lei: '2138007N3EKZNL9P3H43',
    swiftCode: 'LOIRZAJJ',
    creditRating: {
      fitch: 'A',
      moodys: 'A3',
      sp: 'A-',
    },
    country: 'South Africa',
    approvedLimit: 300000000,
    currentExposure: 150000000,
    availableLimit: 150000000,
    contacts: [
      { name: 'David Cohen', role: 'Treasury', phone: '+27 11 286 7000', email: 'david.cohen@investec.co.za' },
    ],
  },
  {
    id: 'CAPITEC',
    name: 'Capitec Bank Holdings Limited',
    shortName: 'Capitec',
    lei: '549300PGMWZ7BWTHPT17',
    swiftCode: 'CABORSJJ',
    creditRating: {
      fitch: 'BBB+',
      moodys: 'Baa1',
      sp: 'BBB',
    },
    country: 'South Africa',
    approvedLimit: 200000000,
    currentExposure: 50000000,
    availableLimit: 150000000,
    contacts: [
      { name: 'Andre Pieterse', role: 'Treasury', phone: '+27 21 809 0900', email: 'andre.pieterse@capitecbank.co.za' },
    ],
  },
];

// Mock MM funds
export const mockMMFunds: MMFund[] = [
  {
    id: 'CASH-MGT-001',
    name: 'Treasury Cash Management Fund',
    aum: 2400000000,
    availableCash: 450000000,
    currentPlacements: 1800000000,
    pendingMaturities: 250000000,
    singleBankLimit: 500000000,
    baseCurrency: 'ZAR',
  },
  {
    id: 'CASH-MGT-002',
    name: 'Short-Term Liquidity Pool',
    aum: 850000000,
    availableCash: 120000000,
    currentPlacements: 680000000,
    pendingMaturities: 95000000,
    singleBankLimit: 200000000,
    baseCurrency: 'ZAR',
  },
  {
    id: 'CASH-MGT-003',
    name: 'Overnight Investment Fund',
    aum: 500000000,
    availableCash: 280000000,
    currentPlacements: 200000000,
    pendingMaturities: 50000000,
    singleBankLimit: 150000000,
    baseCurrency: 'ZAR',
  },
  {
    id: 'USD-CASH-001',
    name: 'USD Cash Management',
    aum: 100000000,
    availableCash: 25000000,
    currentPlacements: 70000000,
    pendingMaturities: 15000000,
    singleBankLimit: 30000000,
    baseCurrency: 'USD',
  },
];

// Mock funding accounts
export const mockFundingAccounts: FundingAccount[] = [
  {
    id: 'ZAR-OPS-632005847',
    name: 'ZAR Operating Account',
    accountNumber: '632005847',
    bank: 'Nedbank',
    currency: 'ZAR',
    balance: 523450000,
    available: 450000000,
  },
  {
    id: 'ZAR-RES-632005848',
    name: 'ZAR Reserve Account',
    accountNumber: '632005848',
    bank: 'Nedbank',
    currency: 'ZAR',
    balance: 125000000,
    available: 125000000,
  },
  {
    id: 'USD-OPS-4078901234',
    name: 'USD Operating Account',
    accountNumber: '4078901234',
    bank: 'Standard Bank',
    currency: 'USD',
    balance: 28500000,
    available: 25000000,
  },
  {
    id: 'EUR-OPS-4078901235',
    name: 'EUR Operating Account',
    accountNumber: '4078901235',
    bank: 'Standard Bank',
    currency: 'EUR',
    balance: 12000000,
    available: 10500000,
  },
];

// Mock MM traders
export const mockMMTraders: MMTrader[] = [
  { id: 'trader-001', name: 'Sarah Thompson' },
  { id: 'trader-002', name: 'Michael van der Berg' },
  { id: 'trader-003', name: 'Lerato Molefe' },
  { id: 'trader-004', name: 'Johan Kruger' },
  { id: 'trader-005', name: 'Nomsa Dlamini' },
];

// Mock reference rates (South African)
export const mockReferenceRates: ReferenceRates = {
  sarb_repo: 8.25,
  prime: 11.75,
  jibar_1m: 8.15,
  jibar_3m: 8.25,
  jibar_6m: 8.35,
  jibar_12m: 8.50,
  asOf: new Date(),
};

// Reference rate options for dropdown
export const referenceRateOptions = [
  { id: 'JIBAR_1M', name: 'JIBAR 1M', value: 8.15 },
  { id: 'JIBAR_3M', name: 'JIBAR 3M', value: 8.25 },
  { id: 'JIBAR_6M', name: 'JIBAR 6M', value: 8.35 },
  { id: 'JIBAR_12M', name: 'JIBAR 12M', value: 8.50 },
  { id: 'SARB_REPO', name: 'SARB Repo Rate', value: 8.25 },
  { id: 'PRIME', name: 'Prime Rate', value: 11.75 },
];

// Mock currencies for MM
export const mockMMCurrencies = [
  { code: 'ZAR', name: 'South African Rand' },
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
];
