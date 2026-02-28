// ============================================
// services/api/referenceData.ts - Reference Data API Service
// ============================================

import type {
  Security,
  QuoteData,
  Portfolio,
  Trader,
  Broker,
  Custodian,
} from '@/components/trading/tickets/NewEquityTradeWindow/types';

import {
  mockSecurities,
  mockQuotes,
  mockPortfolios,
  mockTraders,
  mockBrokers,
  mockCustodians,
  mockExchanges,
  mockCurrencies,
} from '@/mocks/referenceData';

// Simulated network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Search securities by ticker or name
export async function searchSecurities(query: string, limit = 10): Promise<Security[]> {
  await delay(150); // Simulate network latency

  const upperQuery = query.toUpperCase();
  return mockSecurities
    .filter(s =>
      s.ticker.includes(upperQuery) ||
      s.name.toUpperCase().includes(upperQuery) ||
      s.isin.includes(upperQuery)
    )
    .slice(0, limit);
}

// Get security by ISIN
export async function getSecurityByIsin(isin: string): Promise<Security | null> {
  await delay(100);
  return mockSecurities.find(s => s.isin === isin) || null;
}

// Get security by ticker
export async function getSecurityByTicker(ticker: string): Promise<Security | null> {
  await delay(100);
  return mockSecurities.find(s => s.ticker === ticker.toUpperCase()) || null;
}

// Get live quote for security
export async function getQuote(isin: string): Promise<QuoteData | null> {
  await delay(80);
  return mockQuotes[isin] || null;
}

// Get all portfolios
export async function getPortfolios(): Promise<Portfolio[]> {
  await delay(100);
  return [...mockPortfolios];
}

// Get portfolio by ID
export async function getPortfolioById(id: string): Promise<Portfolio | null> {
  await delay(50);
  return mockPortfolios.find(p => p.id === id) || null;
}

// Get all traders
export async function getTraders(): Promise<Trader[]> {
  await delay(50);
  return [...mockTraders];
}

// Get all brokers
export async function getBrokers(): Promise<Broker[]> {
  await delay(100);
  return [...mockBrokers];
}

// Get broker by ID
export async function getBrokerById(id: string): Promise<Broker | null> {
  await delay(50);
  return mockBrokers.find(b => b.id === id) || null;
}

// Get all custodians
export async function getCustodians(): Promise<Custodian[]> {
  await delay(50);
  return [...mockCustodians];
}

// Get exchanges
export async function getExchanges(): Promise<typeof mockExchanges> {
  await delay(50);
  return [...mockExchanges];
}

// Get currencies
export async function getCurrencies(): Promise<typeof mockCurrencies> {
  await delay(50);
  return [...mockCurrencies];
}

// Validate security exists
export async function securityExists(ticker: string): Promise<boolean> {
  await delay(50);
  return mockSecurities.some(s => s.ticker === ticker.toUpperCase());
}

// Validate MIC code exists
export async function micExists(mic: string): Promise<boolean> {
  await delay(50);
  return mockExchanges.some(e => e.mic === mic.toUpperCase());
}

// Submit trade (mock implementation)
export interface TradeSubmitResult {
  success: boolean;
  tradeId?: string;
  confirmationNumber?: string;
  error?: string;
}

export async function submitTrade(tradeData: unknown): Promise<TradeSubmitResult> {
  await delay(500); // Simulate processing time

  // Generate mock trade ID
  const tradeId = `TRD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  const confirmationNumber = `CONF-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

  console.log('Trade submitted:', tradeData);

  return {
    success: true,
    tradeId,
    confirmationNumber,
  };
}

// Validate trade (mock implementation)
export interface TradeValidationResult {
  valid: boolean;
  errors: Array<{ field: string; message: string }>;
  warnings: Array<{ field: string; message: string }>;
}

export async function validateTrade(_tradeData: unknown): Promise<TradeValidationResult> {
  await delay(200);

  // Mock validation - would typically call backend
  return {
    valid: true,
    errors: [],
    warnings: [],
  };
}
