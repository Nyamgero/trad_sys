// ============================================
// features/portfolio/types.ts
// ============================================

import { Currency, MoneyValue } from '@/types/common';

// Asset Allocation
export interface AssetAllocation {
  assetClass: string;
  marketValue: number;
  weight: number;
  targetWeight: number;
  deviation: number;
  status: 'on_target' | 'overweight' | 'underweight';
}

// Geographic Allocation
export interface GeographicAllocation {
  region: string;
  marketValue: number;
  weight: number;
  benchmarkWeight: number;
  activeWeight: number;
}

// Sector Allocation
export interface SectorAllocation {
  sector: string;
  marketValue: number;
  weight: number;
  benchmarkWeight: number;
  activeWeight: number;
}

// Portfolio Overview
export interface PortfolioOverview {
  totalAum: number;
  cashEquivalents: number;
  cashPercent: number;
  investedCapital: number;
  investedPercent: number;
  accruedFees: number;
  nav: number;
  assetAllocation: AssetAllocation[];
}

// Risk Metrics
export interface RiskMetrics {
  portfolioBeta: number;
  benchmarkBeta: number;
  volatilityAnnualized: number;
  benchmarkVolatility: number;
  sharpeRatio: number;
  benchmarkSharpe: number;
  sortinoRatio: number;
  benchmarkSortino: number;
  maxDrawdownYtd: number;
  benchmarkMaxDrawdown: number;
  var95_1day: number;
  varPercent: number;
  cvar95_1day: number;
  cvarPercent: number;
}

// Duration & Interest Rate Risk
export interface DurationRisk {
  portfolioDuration: number;
  modifiedDuration: number;
  dv01Total: number;
  convexity: number;
  keyRateDv01: {
    tenor: string;
    value: number;
  }[];
}

// Currency Exposure
export interface CurrencyExposure {
  currency: Currency;
  grossExposure: number;
  netExposure: number;
  hedgeRatio: number;
  unhedgedRisk: number;
}

// Performance Attribution
export interface PerformanceAttribution {
  totalReturn: number;
  assetAllocationReturn: number;
  securitySelectionReturn: number;
  currencyEffect: number;
  interactionEffect: number;
  residual: number;
}

export interface AssetClassPerformance {
  assetClass: string;
  weight: number;
  return: number;
  contribution: number;
  vsBenchmark: number;
}

// Compliance
export interface ComplianceLimit {
  name: string;
  current: number;
  maximum: number;
  utilization: number;
  status: 'ok' | 'warning' | 'breach';
}

export interface PolicyCompliance {
  policy: string;
  rule: string;
  current: string;
  status: 'ok' | 'warning' | 'breach';
}

// Top Holdings
export interface TopHolding {
  rank: number;
  asset: string;
  type: 'equity' | 'etf' | 'fx' | 'bond';
  marketValue: number;
  weight: number;
  pnlYtd: number;
  pnlYtdPercent: number;
}

// Full Portfolio Summary
export interface PortfolioSummary {
  overview: PortfolioOverview;
  geographicAllocation: GeographicAllocation[];
  sectorAllocation: SectorAllocation[];
  riskMetrics: RiskMetrics;
  durationRisk: DurationRisk;
  currencyExposure: CurrencyExposure[];
  performanceAttribution: PerformanceAttribution;
  assetClassPerformance: AssetClassPerformance[];
  complianceLimits: ComplianceLimit[];
  policyCompliance: PolicyCompliance[];
  topHoldings: TopHolding[];
}
