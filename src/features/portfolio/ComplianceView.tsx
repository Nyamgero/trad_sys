// ============================================
// features/portfolio/ComplianceView.tsx
// ============================================

import React from 'react';
import { formatPercent } from '@/lib/formatters';
import type { ComplianceLimit, PolicyCompliance } from './types';

interface ComplianceViewProps {
  limits: ComplianceLimit[];
  policies: PolicyCompliance[];
  className?: string;
}

export const ComplianceView: React.FC<ComplianceViewProps> = ({
  limits,
  policies,
  className = '',
}) => {
  const getStatusIcon = (status: 'ok' | 'warning' | 'breach') => {
    switch (status) {
      case 'ok':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'breach':
        return '🔴';
    }
  };

  const getStatusClass = (status: 'ok' | 'warning' | 'breach') => {
    switch (status) {
      case 'ok':
        return 'compliance-status--ok';
      case 'warning':
        return 'compliance-status--warning';
      case 'breach':
        return 'compliance-status--breach';
    }
  };

  const getUtilizationClass = (utilization: number) => {
    if (utilization >= 95) return 'utilization--critical';
    if (utilization >= 80) return 'utilization--warning';
    return 'utilization--ok';
  };

  return (
    <div className={`compliance-view ${className}`}>
      {/* Regulatory Limits */}
      <section className="portfolio-section">
        <h2 className="portfolio-section__title">Regulatory Limits</h2>
        <div className="compliance-table">
          <div className="compliance-header">
            <span>Limit</span>
            <span>Current</span>
            <span>Maximum</span>
            <span>Utilization</span>
            <span>Status</span>
          </div>
          {limits.map((limit) => (
            <div key={limit.name} className="compliance-row">
              <span className="compliance-row__name">{limit.name}</span>
              <span className="compliance-row__value">{formatPercent(limit.current)}</span>
              <span className="compliance-row__value">{formatPercent(limit.maximum)}</span>
              <span className="compliance-row__utilization">
                <div className="utilization-bar">
                  <div
                    className={`utilization-bar__fill ${getUtilizationClass(limit.utilization)}`}
                    style={{ width: `${Math.min(limit.utilization, 100)}%` }}
                  />
                </div>
                <span className={`utilization-text ${getUtilizationClass(limit.utilization)}`}>
                  {limit.utilization.toFixed(0)}%
                </span>
              </span>
              <span className={`compliance-row__status ${getStatusClass(limit.status)}`}>
                {getStatusIcon(limit.status)} {limit.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Investment Policy Compliance */}
      <section className="portfolio-section">
        <h2 className="portfolio-section__title">Investment Policy Compliance</h2>
        <div className="policy-table">
          <div className="policy-header">
            <span>Policy</span>
            <span>Rule</span>
            <span>Current</span>
            <span>Status</span>
          </div>
          {policies.map((policy, index) => (
            <div key={index} className="policy-row">
              <span className="policy-row__name">{policy.policy}</span>
              <span className="policy-row__rule">{policy.rule}</span>
              <span className="policy-row__current">{policy.current}</span>
              <span className={`policy-row__status ${getStatusClass(policy.status)}`}>
                {getStatusIcon(policy.status)} {policy.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Summary Stats */}
      <div className="compliance-summary">
        <div className="compliance-summary__item compliance-summary__item--ok">
          <span className="compliance-summary__count">
            {limits.filter((l) => l.status === 'ok').length + policies.filter((p) => p.status === 'ok').length}
          </span>
          <span className="compliance-summary__label">Compliant</span>
        </div>
        <div className="compliance-summary__item compliance-summary__item--warning">
          <span className="compliance-summary__count">
            {limits.filter((l) => l.status === 'warning').length + policies.filter((p) => p.status === 'warning').length}
          </span>
          <span className="compliance-summary__label">Warnings</span>
        </div>
        <div className="compliance-summary__item compliance-summary__item--breach">
          <span className="compliance-summary__count">
            {limits.filter((l) => l.status === 'breach').length + policies.filter((p) => p.status === 'breach').length}
          </span>
          <span className="compliance-summary__label">Breaches</span>
        </div>
      </div>
    </div>
  );
};

export default ComplianceView;
