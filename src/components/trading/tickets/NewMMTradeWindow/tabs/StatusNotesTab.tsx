// ============================================
// NewMMTradeWindow/tabs/StatusNotesTab.tsx
// ============================================

import React, { useCallback, useMemo } from 'react';
import clsx from 'clsx';
import type { MMTradeFormState, MMTradeStatus } from '../types';

interface StatusNotesTabProps {
  values: Partial<MMTradeFormState>;
  errors: Partial<Record<keyof MMTradeFormState, { message: string }>>;
  touched: Partial<Record<keyof MMTradeFormState, boolean>>;
  setValue: <K extends keyof MMTradeFormState>(field: K, value: MMTradeFormState[K]) => void;
  setTouched: (field: keyof MMTradeFormState) => void;
  validationWarnings: Array<{ field: string; message: string }>;
}

const TRADE_STATUSES: { value: MMTradeStatus; label: string; desc: string }[] = [
  { value: 'DRAFT', label: 'Draft', desc: 'Not submitted' },
  { value: 'PENDING', label: 'Pending', desc: 'Awaiting approval' },
  { value: 'CONFIRMED', label: 'Confirmed', desc: 'Trade confirmed' },
  { value: 'ACTIVE', label: 'Active', desc: 'In progress' },
];

const COMPLIANCE_CHECKS = [
  { id: 'limit_check', label: 'Counterparty Limit Check', status: 'passed' },
  { id: 'tenor_policy', label: 'Tenor Policy Compliance', status: 'passed' },
  { id: 'rate_benchmark', label: 'Rate Benchmark Validation', status: 'warning' },
  { id: 'kyc_aml', label: 'KYC/AML Status', status: 'passed' },
  { id: 'mandate_check', label: 'Investment Mandate Check', status: 'passed' },
];

export const StatusNotesTab: React.FC<StatusNotesTabProps> = ({
  values,
  errors: _errors,
  touched: _touched,
  setValue,
  setTouched: _setTouched,
  validationWarnings,
}) => {
  const handleStatusChange = useCallback(
    (status: MMTradeStatus) => {
      setValue('tradeStatus', status);
    },
    [setValue]
  );

  const handleNotesChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue('notes', e.target.value);
    },
    [setValue]
  );

  const handleInternalRefChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue('internalReference', e.target.value);
    },
    [setValue]
  );

  const handleExternalRefChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue('externalReference', e.target.value);
    },
    [setValue]
  );

  // Determine approval workflow based on principal amount
  const approvalWorkflow = useMemo(() => {
    const amount = values.principalAmount || 0;
    if (amount >= 500000000) {
      return {
        level: 'SENIOR_MANAGEMENT',
        label: 'Senior Management Approval Required',
        threshold: 'R 500M+',
      };
    } else if (amount >= 100000000) {
      return {
        level: 'HEAD_OF_TRADING',
        label: 'Head of Trading Approval Required',
        threshold: 'R 100M - 500M',
      };
    } else if (amount >= 50000000) {
      return {
        level: 'TEAM_LEAD',
        label: 'Team Lead Approval Required',
        threshold: 'R 50M - 100M',
      };
    } else {
      return {
        level: 'AUTO_APPROVE',
        label: 'Auto-Approved (Within Trader Limits)',
        threshold: 'Under R 50M',
      };
    }
  }, [values.principalAmount]);

  const getCheckStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return '✓';
      case 'warning':
        return '⚠';
      case 'failed':
        return '✕';
      default:
        return '○';
    }
  };

  const getCheckStatusClass = (status: string) => {
    switch (status) {
      case 'passed':
        return 'compliance-check--passed';
      case 'warning':
        return 'compliance-check--warning';
      case 'failed':
        return 'compliance-check--failed';
      default:
        return 'compliance-check--pending';
    }
  };

  return (
    <div className="mm-tab mm-tab--status">
      <div className="mm-tab__section">
        <h3 className="mm-tab__section-title">Status & Workflow</h3>

        {/* Trade Status */}
        <div className="form-group">
          <label className="form-label">Trade Status</label>
          <div className="status-workflow">
            {TRADE_STATUSES.map((status, index) => (
              <React.Fragment key={status.value}>
                <button
                  type="button"
                  className={clsx(
                    'status-step',
                    values.tradeStatus === status.value && 'status-step--active',
                    TRADE_STATUSES.findIndex((s) => s.value === values.tradeStatus) > index &&
                      'status-step--completed'
                  )}
                  onClick={() => handleStatusChange(status.value)}
                >
                  <span className="status-step__indicator">{index + 1}</span>
                  <span className="status-step__label">{status.label}</span>
                  <span className="status-step__desc">{status.desc}</span>
                </button>
                {index < TRADE_STATUSES.length - 1 && (
                  <div
                    className={clsx(
                      'status-connector',
                      TRADE_STATUSES.findIndex((s) => s.value === values.tradeStatus) > index &&
                        'status-connector--completed'
                    )}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="form-divider" />

        {/* Approval Workflow */}
        <div className="approval-workflow-panel">
          <h4 className="approval-workflow-panel__title">Approval Workflow</h4>
          <div className="approval-workflow-panel__content">
            <div
              className={clsx(
                'approval-workflow-panel__level',
                `approval-workflow-panel__level--${approvalWorkflow.level.toLowerCase()}`
              )}
            >
              <span className="approval-workflow-panel__level-label">{approvalWorkflow.label}</span>
              <span className="approval-workflow-panel__level-threshold">
                Threshold: {approvalWorkflow.threshold}
              </span>
            </div>
            {approvalWorkflow.level !== 'AUTO_APPROVE' && (
              <div className="approval-workflow-panel__approvers">
                <span className="approval-workflow-panel__approvers-label">Pending Approvers:</span>
                <div className="approval-workflow-panel__approver-list">
                  <span className="approval-workflow-panel__approver">John Smith (Head of MM)</span>
                  {approvalWorkflow.level === 'SENIOR_MANAGEMENT' && (
                    <span className="approval-workflow-panel__approver">Sarah Johnson (CIO)</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="form-divider" />

        {/* Compliance Checks */}
        <div className="compliance-panel">
          <h4 className="compliance-panel__title">Compliance Checks</h4>
          <div className="compliance-panel__checks">
            {COMPLIANCE_CHECKS.map((check) => (
              <div
                key={check.id}
                className={clsx('compliance-check', getCheckStatusClass(check.status))}
              >
                <span className="compliance-check__icon">{getCheckStatusIcon(check.status)}</span>
                <span className="compliance-check__label">{check.label}</span>
                <span className="compliance-check__status">{check.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Validation Warnings */}
        {validationWarnings.length > 0 && (
          <>
            <div className="form-divider" />
            <div className="validation-warnings-panel">
              <h4 className="validation-warnings-panel__title">Warnings</h4>
              <div className="validation-warnings-panel__list">
                {validationWarnings.map((warning, index) => (
                  <div key={index} className="validation-warning">
                    <span className="validation-warning__icon">⚠</span>
                    <span className="validation-warning__field">{warning.field}:</span>
                    <span className="validation-warning__message">{warning.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="form-divider" />

        {/* References */}
        <h4 className="mm-tab__section-subtitle">References</h4>
        <div className="form-row">
          <div className="form-group form-group--flex-1">
            <label className="form-label">Internal Reference</label>
            <input
              type="text"
              className="form-input"
              value={values.internalReference || ''}
              onChange={handleInternalRefChange}
              placeholder="e.g., DEPT-2024-001"
            />
            <span className="form-hint">Your department reference</span>
          </div>

          <div className="form-group form-group--flex-1">
            <label className="form-label">External Reference</label>
            <input
              type="text"
              className="form-input"
              value={values.externalReference || ''}
              onChange={handleExternalRefChange}
              placeholder="e.g., Bank ref number"
            />
            <span className="form-hint">Counterparty reference</span>
          </div>
        </div>

        <div className="form-divider" />

        {/* Notes */}
        <div className="form-group">
          <label className="form-label">Trade Notes</label>
          <textarea
            className="form-textarea form-textarea--large"
            value={values.notes || ''}
            onChange={handleNotesChange}
            placeholder="Enter any additional notes or comments about this trade..."
            rows={5}
          />
          <span className="form-hint">
            These notes will be visible to all users with access to this trade
          </span>
        </div>

        {/* Audit Trail Preview */}
        <div className="audit-trail-panel">
          <h4 className="audit-trail-panel__title">Audit Trail</h4>
          <div className="audit-trail-panel__entries">
            <div className="audit-trail-entry">
              <span className="audit-trail-entry__time">
                {new Date().toLocaleString('en-ZA', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <span className="audit-trail-entry__action">Trade created</span>
              <span className="audit-trail-entry__user">Current User</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusNotesTab;
