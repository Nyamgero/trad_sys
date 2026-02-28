// ============================================
// mocks/referenceData.ts - Mock Reference Data
// ============================================

import type {
  Security,
  QuoteData,
  Portfolio,
  Trader,
  Broker,
  Custodian,
} from '@/components/trading/tickets/NewEquityTradeWindow/types';

// Mock securities database
export const mockSecurities: Security[] = [
  {
    ticker: 'AGL',
    isin: 'ZAE000013181',
    name: 'Anglo American Plc',
    primaryExchange: 'XJSE',
    tradingCurrency: 'ZAR',
    tickSize: 1,
  },
  {
    ticker: 'SOL',
    isin: 'ZAE000151617',
    name: 'Sasol Limited',
    primaryExchange: 'XJSE',
    tradingCurrency: 'ZAR',
    tickSize: 1,
  },
  {
    ticker: 'NPN',
    isin: 'ZAE000015889',
    name: 'Naspers Limited',
    primaryExchange: 'XJSE',
    tradingCurrency: 'ZAR',
    tickSize: 1,
  },
  {
    ticker: 'SBK',
    isin: 'ZAE000109815',
    name: 'Standard Bank Group Ltd',
    primaryExchange: 'XJSE',
    tradingCurrency: 'ZAR',
    tickSize: 1,
  },
  {
    ticker: 'FSR',
    isin: 'ZAE000066304',
    name: 'FirstRand Limited',
    primaryExchange: 'XJSE',
    tradingCurrency: 'ZAR',
    tickSize: 1,
  },
  {
    ticker: 'MTN',
    isin: 'ZAE000042164',
    name: 'MTN Group Limited',
    primaryExchange: 'XJSE',
    tradingCurrency: 'ZAR',
    tickSize: 1,
  },
  {
    ticker: 'BHP',
    isin: 'AU000000BHP4',
    name: 'BHP Group Limited',
    primaryExchange: 'XASX',
    tradingCurrency: 'AUD',
    tickSize: 0.01,
  },
  {
    ticker: 'VOD',
    isin: 'ZAE000132577',
    name: 'Vodacom Group Limited',
    primaryExchange: 'XJSE',
    tradingCurrency: 'ZAR',
    tickSize: 1,
  },
  {
    ticker: 'ABG',
    isin: 'ZAE000067211',
    name: 'Absa Group Limited',
    primaryExchange: 'XJSE',
    tradingCurrency: 'ZAR',
    tickSize: 1,
  },
  {
    ticker: 'SHP',
    isin: 'ZAE000012084',
    name: 'Shoprite Holdings Limited',
    primaryExchange: 'XJSE',
    tradingCurrency: 'ZAR',
    tickSize: 1,
  },
];

// Mock quotes with realistic data
export const mockQuotes: Record<string, QuoteData> = {
  'ZAE000013181': { // AGL
    last: 52450,
    bid: 52420,
    ask: 52480,
    volume: 1245000,
    change: 1234,
    changePercent: 2.35,
  },
  'ZAE000151617': { // SOL
    last: 18520,
    bid: 18500,
    ask: 18540,
    volume: 892000,
    change: -320,
    changePercent: -1.7,
  },
  'ZAE000015889': { // NPN
    last: 324500,
    bid: 324400,
    ask: 324600,
    volume: 156000,
    change: 5200,
    changePercent: 1.62,
  },
  'ZAE000109815': { // SBK
    last: 18750,
    bid: 18740,
    ask: 18760,
    volume: 2145000,
    change: 125,
    changePercent: 0.67,
  },
  'ZAE000066304': { // FSR
    last: 6824,
    bid: 6820,
    ask: 6828,
    volume: 3890000,
    change: -56,
    changePercent: -0.81,
  },
  'ZAE000042164': { // MTN
    last: 8956,
    bid: 8950,
    ask: 8962,
    volume: 1567000,
    change: 78,
    changePercent: 0.88,
  },
  'AU000000BHP4': { // BHP
    last: 45.23,
    bid: 45.20,
    ask: 45.26,
    volume: 5420000,
    change: 0.67,
    changePercent: 1.5,
  },
  'ZAE000132577': { // VOD
    last: 9234,
    bid: 9230,
    ask: 9238,
    volume: 876000,
    change: 34,
    changePercent: 0.37,
  },
  'ZAE000067211': { // ABG
    last: 16890,
    bid: 16880,
    ask: 16900,
    volume: 1234000,
    change: -210,
    changePercent: -1.23,
  },
  'ZAE000012084': { // SHP
    last: 24560,
    bid: 24550,
    ask: 24570,
    volume: 654000,
    change: 340,
    changePercent: 1.4,
  },
};

// Mock portfolios
export const mockPortfolios: Portfolio[] = [
  {
    id: 'MAIN-EQ-001',
    name: 'Main Equity Fund',
    aum: 2400000000,
    strategy: 'Long/Short Equity',
    baseCurrency: 'ZAR',
  },
  {
    id: 'GROWTH-001',
    name: 'Growth Opportunities Fund',
    aum: 850000000,
    strategy: 'Long Only Growth',
    baseCurrency: 'ZAR',
  },
  {
    id: 'VALUE-001',
    name: 'Deep Value Fund',
    aum: 1200000000,
    strategy: 'Value Investing',
    baseCurrency: 'ZAR',
  },
  {
    id: 'PENSION-001',
    name: 'Pension Fund Allocation',
    aum: 4500000000,
    strategy: 'Balanced',
    baseCurrency: 'ZAR',
  },
  {
    id: 'HEDGE-001',
    name: 'Absolute Return Fund',
    aum: 650000000,
    strategy: 'Market Neutral',
    baseCurrency: 'USD',
  },
];

// Mock traders
export const mockTraders: Trader[] = [
  { id: 'trader-001', name: 'John Smith' },
  { id: 'trader-002', name: 'Sarah Johnson' },
  { id: 'trader-003', name: 'Mike Williams' },
  { id: 'trader-004', name: 'Emily Brown' },
  { id: 'trader-005', name: 'David Lee' },
];

// Mock brokers
export const mockBrokers: Broker[] = [
  { id: 'JPMS', code: 'JPMS', name: 'JP Morgan Securities', lei: '549300EX04Z4P9XVJM72' },
  { id: 'MLCO', code: 'MLCO', name: 'Merrill Lynch', lei: '549300GKFG0RYRRQ1414' },
  { id: 'GSCO', code: 'GSCO', name: 'Goldman Sachs', lei: '549300WL2QX7P9YI9435' },
  { id: 'MSCO', code: 'MSCO', name: 'Morgan Stanley', lei: '549300HXMCI7P5D7GL43' },
  { id: 'UBSS', code: 'UBSS', name: 'UBS Securities', lei: '549300SZK83FQRB6P112' },
  { id: 'CITI', code: 'CITI', name: 'Citigroup Global Markets', lei: '549300SJLYL06Z1ESN28' },
  { id: 'SBZA', code: 'SBZA', name: 'Standard Bank South Africa', lei: '5493004KZVBM5K1N4E34' },
  { id: 'ABSA', code: 'ABSA', name: 'Absa Securities', lei: '549300IFFB7FTRW2T823' },
];

// Mock custodians
export const mockCustodians: Custodian[] = [
  { id: 'STRATE', code: 'STRATE', name: 'Strate Pty Ltd' },
  { id: 'EUROCLEAR', code: 'ECLR', name: 'Euroclear Bank' },
  { id: 'DTCC', code: 'DTCC', name: 'Depository Trust Company' },
  { id: 'CLEARSTREAM', code: 'CLST', name: 'Clearstream Banking' },
];

// Mock exchanges
export const mockExchanges = [
  { mic: 'XJSE', name: 'JSE Limited', country: 'ZA' },
  { mic: 'XLON', name: 'London Stock Exchange', country: 'GB' },
  { mic: 'XNYS', name: 'New York Stock Exchange', country: 'US' },
  { mic: 'XNAS', name: 'NASDAQ', country: 'US' },
  { mic: 'XASX', name: 'Australian Securities Exchange', country: 'AU' },
];

// Mock currencies
export const mockCurrencies = [
  { code: 'ZAR', name: 'South African Rand' },
  { code: 'USD', name: 'US Dollar' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'EUR', name: 'Euro' },
  { code: 'AUD', name: 'Australian Dollar' },
];
