// ============================================
// pages/PortfolioPage.tsx
// ============================================

import React, { useState } from 'react';
import {
  PortfolioOverview,
  RiskAnalytics,
  PerformanceAttribution,
  ComplianceView,
  TopHoldings,
} from '@/features/portfolio';
import type { PortfolioSummary } from '@/features/portfolio';

type TabId = 'overview' | 'risk' | 'performance' | 'compliance' | 'holdings';

// Placeholder data
const usePortfolioData = (): { data: PortfolioSummary; isLoading: boolean } => {
  const data: PortfolioSummary = {
    overview: {
      totalAum: 125450000,
      cashEquivalents: 8250000,
      cashPercent: 0.066,
      investedCapital: 117200000,
      investedPercent: 0.934,
      accruedFees: -125000,
      nav: 125325000,
      assetAllocation: [
        { assetClass: 'Equities', marketValue: 45250000, weight: 0.361, targetWeight: 0.35, deviation: 0.011, status: 'overweight' },
        { assetClass: 'ETFs', marketValue: 28500000, weight: 0.227, targetWeight: 0.25, deviation: -0.023, status: 'underweight' },
        { assetClass: 'Bonds', marketValue: 35200000, weight: 0.281, targetWeight: 0.30, deviation: -0.019, status: 'underweight' },
        { assetClass: 'FX (Net)', marketValue: 0, weight: 0, targetWeight: 0, deviation: 0, status: 'on_target' },
        { assetClass: 'Cash', marketValue: 8250000, weight: 0.066, targetWeight: 0.05, deviation: 0.016, status: 'overweight' },
        { assetClass: 'Alternatives', marketValue: 8250000, weight: 0.065, targetWeight: 0.05, deviation: 0.015, status: 'overweight' },
      ],
    },
    geographicAllocation: [
      { region: 'North America', marketValue: 52500000, weight: 0.419, benchmarkWeight: 0.45, activeWeight: -0.031 },
      { region: 'Europe', marketValue: 28750000, weight: 0.229, benchmarkWeight: 0.20, activeWeight: 0.029 },
      { region: 'Africa (ex-SA)', marketValue: 18500000, weight: 0.147, benchmarkWeight: 0.10, activeWeight: 0.047 },
      { region: 'South Africa', marketValue: 15200000, weight: 0.121, benchmarkWeight: 0.15, activeWeight: -0.029 },
      { region: 'Asia Pacific', marketValue: 10500000, weight: 0.084, benchmarkWeight: 0.10, activeWeight: -0.016 },
    ],
    sectorAllocation: [
      { sector: 'Technology', marketValue: 18500000, weight: 0.251, benchmarkWeight: 0.28, activeWeight: -0.029 },
      { sector: 'Financials', marketValue: 14200000, weight: 0.192, benchmarkWeight: 0.15, activeWeight: 0.042 },
      { sector: 'Energy', marketValue: 11800000, weight: 0.160, benchmarkWeight: 0.12, activeWeight: 0.040 },
      { sector: 'Healthcare', marketValue: 9500000, weight: 0.129, benchmarkWeight: 0.14, activeWeight: -0.011 },
      { sector: 'Consumer', marketValue: 8200000, weight: 0.111, benchmarkWeight: 0.12, activeWeight: -0.009 },
      { sector: 'Industrials', marketValue: 7500000, weight: 0.102, benchmarkWeight: 0.10, activeWeight: 0.002 },
      { sector: 'Other', marketValue: 4050000, weight: 0.055, benchmarkWeight: 0.09, activeWeight: -0.035 },
    ],
    riskMetrics: {
      portfolioBeta: 1.05,
      benchmarkBeta: 1.00,
      volatilityAnnualized: 0.142,
      benchmarkVolatility: 0.125,
      sharpeRatio: 1.25,
      benchmarkSharpe: 1.10,
      sortinoRatio: 1.85,
      benchmarkSortino: 1.45,
      maxDrawdownYtd: -0.085,
      benchmarkMaxDrawdown: -0.102,
      var95_1day: 1875000,
      varPercent: 0.015,
      cvar95_1day: 2450000,
      cvarPercent: 0.0195,
    },
    durationRisk: {
      portfolioDuration: 5.2,
      modifiedDuration: 4.9,
      dv01Total: 172500,
      convexity: 28.5,
      keyRateDv01: [
        { tenor: '2Y', value: 25000 },
        { tenor: '5Y', value: 85000 },
        { tenor: '10Y', value: 62500 },
      ],
    },
    currencyExposure: [
      { currency: 'USD', grossExposure: 85000000, netExposure: 55000000, hedgeRatio: 0.35, unhedgedRisk: 55000000 },
      { currency: 'ZAR', grossExposure: 48000000, netExposure: 48000000, hedgeRatio: 0, unhedgedRisk: 48000000 },
      { currency: 'EUR', grossExposure: 12500000, netExposure: 8500000, hedgeRatio: 0.32, unhedgedRisk: 8500000 },
      { currency: 'GBP', grossExposure: 8500000, netExposure: 0, hedgeRatio: 1.0, unhedgedRisk: 0 },
      { currency: 'KES', grossExposure: 5200000, netExposure: 5200000, hedgeRatio: 0, unhedgedRisk: 5200000 },
    ],
    performanceAttribution: {
      totalReturn: 0.0825,
      assetAllocationReturn: 0.0185,
      securitySelectionReturn: 0.032,
      currencyEffect: 0.0045,
      interactionEffect: 0.0025,
      residual: 0.025,
    },
    assetClassPerformance: [
      { assetClass: 'Equities', weight: 0.361, return: 0.125, contribution: 0.0451, vsBenchmark: 0.0125 },
      { assetClass: 'ETFs', weight: 0.227, return: 0.082, contribution: 0.0186, vsBenchmark: -0.0035 },
      { assetClass: 'Bonds', weight: 0.281, return: 0.045, contribution: 0.0126, vsBenchmark: 0.0015 },
      { assetClass: 'FX', weight: 0, return: 0, contribution: 0.0045, vsBenchmark: 0.0045 },
      { assetClass: 'Cash', weight: 0.066, return: 0.025, contribution: 0.0017, vsBenchmark: -0.0005 },
      { assetClass: 'Alternatives', weight: 0.065, return: 0, contribution: 0, vsBenchmark: -0.0085 },
    ],
    complianceLimits: [
      { name: 'Single Security', current: 0.048, maximum: 0.05, utilization: 96, status: 'warning' },
      { name: 'Single Issuer', current: 0.082, maximum: 0.10, utilization: 82, status: 'ok' },
      { name: 'Single Sector', current: 0.251, maximum: 0.30, utilization: 84, status: 'ok' },
      { name: 'Single Country', current: 0.419, maximum: 0.50, utilization: 84, status: 'ok' },
      { name: 'Illiquid Assets', current: 0.035, maximum: 0.10, utilization: 35, status: 'ok' },
      { name: 'Leverage', current: 0, maximum: 0, utilization: 0, status: 'ok' },
      { name: 'Cash Minimum', current: 0.066, maximum: 0.02, utilization: 0, status: 'ok' },
    ],
    policyCompliance: [
      { policy: 'Min Credit Rating', rule: 'BBB-', current: 'BB+ (1 position)', status: 'breach' },
      { policy: 'Max Duration', rule: '8.0 years', current: '5.2 years', status: 'ok' },
      { policy: 'Min Positions', rule: '20', current: '16', status: 'warning' },
      { policy: 'Max Cash', rule: '10%', current: '6.6%', status: 'ok' },
      { policy: 'Dividend Yield Min', rule: '1.5%', current: '2.1%', status: 'ok' },
    ],
    topHoldings: [
      { rank: 1, asset: 'R2030 8.0%', type: 'bond', marketValue: 2782620, weight: 0.0222, pnlYtd: 285000, pnlYtdPercent: 0.114 },
      { rank: 2, asset: 'SABMiller', type: 'equity', marketValue: 2437433, weight: 0.0194, pnlYtd: 162500, pnlYtdPercent: 0.071 },
      { rank: 3, asset: 'SPY', type: 'etf', marketValue: 2279000, weight: 0.0182, pnlYtd: 53000, pnlYtdPercent: 0.024 },
      { rank: 4, asset: 'Sasol 5.5% 2031', type: 'bond', marketValue: 1904000, weight: 0.0152, pnlYtd: 38000, pnlYtdPercent: 0.020 },
      { rank: 5, asset: 'Apple Inc', type: 'equity', marketValue: 1852500, weight: 0.0148, pnlYtd: 92500, pnlYtdPercent: 0.053 },
      { rank: 6, asset: 'Safran SA', type: 'equity', marketValue: 1385608, weight: 0.0110, pnlYtd: 52800, pnlYtdPercent: 0.040 },
      { rank: 7, asset: 'iShares Japan', type: 'etf', marketValue: 1068750, weight: 0.0085, pnlYtd: 43450, pnlYtdPercent: 0.042 },
      { rank: 8, asset: 'Shell PLC', type: 'equity', marketValue: 807531, weight: 0.0064, pnlYtd: 7750, pnlYtdPercent: 0.010 },
      { rank: 9, asset: 'FXD1/2024/10', type: 'bond', marketValue: 776357, weight: 0.0062, pnlYtd: 835000, pnlYtdPercent: 1.076 },
      { rank: 10, asset: 'Vanguard Intl', type: 'etf', marketValue: 481200, weight: 0.0038, pnlYtd: 14000, pnlYtdPercent: 0.030 },
    ],
  };

  return { data, isLoading: false };
};

export const PortfolioPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const { data, isLoading } = usePortfolioData();

  if (isLoading) {
    return <div className="page-loading">Loading...</div>;
  }

  const tabs: { id: TabId; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'risk', label: 'Risk Analytics' },
    { id: 'performance', label: 'Performance' },
    { id: 'compliance', label: 'Compliance' },
    { id: 'holdings', label: 'Top Holdings' },
  ];

  return (
    <div className="portfolio-page">
      {/* Tab Navigation */}
      <div className="portfolio-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`portfolio-tab ${activeTab === tab.id ? 'portfolio-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="portfolio-content">
        {activeTab === 'overview' && (
          <PortfolioOverview data={data.overview} />
        )}
        {activeTab === 'risk' && (
          <RiskAnalytics
            riskMetrics={data.riskMetrics}
            durationRisk={data.durationRisk}
            currencyExposure={data.currencyExposure}
          />
        )}
        {activeTab === 'performance' && (
          <PerformanceAttribution
            attribution={data.performanceAttribution}
            assetClassPerformance={data.assetClassPerformance}
          />
        )}
        {activeTab === 'compliance' && (
          <ComplianceView
            limits={data.complianceLimits}
            policies={data.policyCompliance}
          />
        )}
        {activeTab === 'holdings' && (
          <TopHoldings holdings={data.topHoldings} />
        )}
      </div>
    </div>
  );
};

export default PortfolioPage;
