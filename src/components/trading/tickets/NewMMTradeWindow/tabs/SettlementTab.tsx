// ============================================
// NewMMTradeWindow/tabs/SettlementTab.tsx
// ============================================

import React, { useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { formatCurrency } from '@/lib/formatters';
import { mockFundingAccounts, mockBanks } from '@/mocks/mmReferenceData';
import type { MMTradeFormState, SettlementType } from '../types';

interface SettlementTabProps {
  values: Partial<MMTradeFormState>;
  errors: Partial<Record<keyof MMTradeFormState, { message: string }>>;
  touched: Partial<Record<keyof MMTradeFormState, boolean>>;
  setValue: <K extends keyof MMTradeFormState>(field: K, value: MMTradeFormState[K]) => void;
  setTouched: (field: keyof MMTradeFormState) => void;
  maturityProceeds: number;
}

const SETTLEMENT_TYPES: { value: SettlementType; label: string; desc: string }[] = [
  { value: 'SAME_DAY', label: 'Same Day', desc: 'T+0' },
  { value: 'NEXT_DAY', label: 'Next Day', desc: 'T+1' },
];

export const SettlementTab: React.FC<SettlementTabProps> = ({
  values,
  errors,
  touched,
  setValue,
  setTouched,
  maturityProceeds,
}) => {
  const selectedBank = useMemo(
    () => mockBanks.find((b) => b.id === values.counterpartyBank),
    [values.counterpartyBank]
  );

  const availableAccounts = useMemo(
    () => mockFundingAccounts.filter((acc) => acc.currency === values.currency),
    [values.currency]
  );

  const selectedAccount = useMemo(
    () => mockFundingAccounts.find((acc) => acc.id === values.fundingAccount),
    [values.fundingAccount]
  );

  const handleSettlementTypeChange = useCallback(
    (type: SettlementType) => {
      setValue('settlementType', type);
    },
    [setValue]
  );

  const handleFundingAccountChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setValue('fundingAccount', e.target.value);
      setTouched('fundingAccount');
    },
    [setValue, setTouched]
  );

  const handlePaymentReferenceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue('paymentReference', e.target.value);
    },
    [setValue]
  );

  const handleSpecialInstructionsChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue('specialInstructions', e.target.value);
    },
    [setValue]
  );

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return 'N/A';
    return date.toLocaleDateString('en-ZA', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const currency = values.currency || 'ZAR';

  return (
    <div className="mm-tab mm-tab--settlement">
      <div className="mm-tab__section">
        <h3 className="mm-tab__section-title">Settlement Instructions</h3>

        {/* Settlement Type */}
        <div className="form-group">
          <label className="form-label form-label--required">Settlement Type</label>
          <div className="settlement-type-buttons">
            {SETTLEMENT_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                className={clsx(
                  'settlement-type-btn',
                  values.settlementType === type.value && 'settlement-type-btn--selected'
                )}
                onClick={() => handleSettlementTypeChange(type.value)}
              >
                <span className="settlement-type-btn__label">{type.label}</span>
                <span className="settlement-type-btn__desc">{type.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="form-divider" />

        {/* Funding Account */}
        <div className="form-group">
          <label className="form-label form-label--required">Funding Account</label>
          <select
            className={clsx(
              'form-select',
              touched.fundingAccount && errors.fundingAccount && 'form-select--error'
            )}
            value={values.fundingAccount || ''}
            onChange={handleFundingAccountChange}
          >
            <option value="">Select account...</option>
            {availableAccounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name} - {acc.accountNumber}
              </option>
            ))}
          </select>
          {touched.fundingAccount && errors.fundingAccount && (
            <span className="form-error">{errors.fundingAccount.message}</span>
          )}
        </div>

        {/* Selected Account Details */}
        {selectedAccount && (
          <div className="account-details-panel">
            <h4 className="account-details-panel__title">Account Details</h4>
            <div className="account-details-panel__grid">
              <div className="account-details-panel__item">
                <span className="account-details-panel__label">Account Name</span>
                <span className="account-details-panel__value">{selectedAccount.name}</span>
              </div>
              <div className="account-details-panel__item">
                <span className="account-details-panel__label">Account Number</span>
                <span className="account-details-panel__value account-details-panel__value--mono">
                  {selectedAccount.accountNumber}
                </span>
              </div>
              <div className="account-details-panel__item">
                <span className="account-details-panel__label">Bank</span>
                <span className="account-details-panel__value">{selectedAccount.bank}</span>
              </div>
              <div className="account-details-panel__item">
                <span className="account-details-panel__label">Currency</span>
                <span className="account-details-panel__value">{selectedAccount.currency}</span>
              </div>
              <div className="account-details-panel__item">
                <span className="account-details-panel__label">Available Balance</span>
                <span className="account-details-panel__value">
                  {formatCurrency(selectedAccount.balance, selectedAccount.currency)}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="form-divider" />

        {/* Counterparty Bank Details */}
        {selectedBank && (
          <>
            <h4 className="mm-tab__section-subtitle">Counterparty Bank Settlement</h4>
            <div className="bank-settlement-panel">
              <div className="bank-settlement-panel__grid">
                <div className="bank-settlement-panel__item">
                  <span className="bank-settlement-panel__label">Bank Name</span>
                  <span className="bank-settlement-panel__value">{selectedBank.name}</span>
                </div>
                <div className="bank-settlement-panel__item">
                  <span className="bank-settlement-panel__label">SWIFT Code</span>
                  <span className="bank-settlement-panel__value bank-settlement-panel__value--mono">
                    {selectedBank.swiftCode}
                  </span>
                </div>
                <div className="bank-settlement-panel__item">
                  <span className="bank-settlement-panel__label">LEI</span>
                  <span className="bank-settlement-panel__value bank-settlement-panel__value--mono">
                    {selectedBank.lei}
                  </span>
                </div>
                <div className="bank-settlement-panel__item">
                  <span className="bank-settlement-panel__label">Country</span>
                  <span className="bank-settlement-panel__value">
                    {selectedBank.country}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="form-divider" />

        {/* Payment Reference */}
        <div className="form-group">
          <label className="form-label">Payment Reference</label>
          <input
            type="text"
            className="form-input"
            value={values.paymentReference || ''}
            onChange={handlePaymentReferenceChange}
            placeholder="e.g., MM-2024-001234"
            maxLength={35}
          />
          <span className="form-hint">Max 35 characters for SWIFT</span>
        </div>

        {/* Special Instructions */}
        <div className="form-group">
          <label className="form-label">Special Instructions</label>
          <textarea
            className="form-textarea"
            value={values.specialInstructions || ''}
            onChange={handleSpecialInstructionsChange}
            placeholder="Enter any special settlement instructions..."
            rows={3}
          />
        </div>

        <div className="form-divider" />

        {/* Cash Flow Summary */}
        {values.principalAmount && values.principalAmount > 0 && (
          <div className="cash-flow-panel">
            <h4 className="cash-flow-panel__title">Cash Flow Schedule</h4>
            <div className="cash-flow-panel__flows">
              {/* Initial Flow */}
              <div className="cash-flow-panel__flow">
                <div className="cash-flow-panel__flow-date">
                  <span className="cash-flow-panel__flow-label">Value Date</span>
                  <span className="cash-flow-panel__flow-value">{formatDate(values.valueDate)}</span>
                </div>
                <div
                  className={clsx(
                    'cash-flow-panel__flow-amount',
                    values.direction === 'PLACEMENT'
                      ? 'cash-flow-panel__flow-amount--outflow'
                      : 'cash-flow-panel__flow-amount--inflow'
                  )}
                >
                  <span className="cash-flow-panel__flow-direction">
                    {values.direction === 'PLACEMENT' ? 'PAY' : 'RECEIVE'}
                  </span>
                  <span className="cash-flow-panel__flow-value">
                    {formatCurrency(values.principalAmount || 0, currency)}
                  </span>
                </div>
              </div>

              {/* Maturity Flow - only for FIXED/TERM deposits */}
              {['FIXED', 'TERM'].includes(values.depositType || '') && values.maturityDate && (
                <div className="cash-flow-panel__flow">
                  <div className="cash-flow-panel__flow-date">
                    <span className="cash-flow-panel__flow-label">Maturity Date</span>
                    <span className="cash-flow-panel__flow-value">{formatDate(values.maturityDate)}</span>
                  </div>
                  <div
                    className={clsx(
                      'cash-flow-panel__flow-amount',
                      values.direction === 'PLACEMENT'
                        ? 'cash-flow-panel__flow-amount--inflow'
                        : 'cash-flow-panel__flow-amount--outflow'
                    )}
                  >
                    <span className="cash-flow-panel__flow-direction">
                      {values.direction === 'PLACEMENT' ? 'RECEIVE' : 'PAY'}
                    </span>
                    <span className="cash-flow-panel__flow-value">
                      {formatCurrency(maturityProceeds, currency)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Net Cash Flow */}
            {['FIXED', 'TERM'].includes(values.depositType || '') && (
              <div className="cash-flow-panel__net">
                <span className="cash-flow-panel__net-label">Net Interest</span>
                <span
                  className={clsx(
                    'cash-flow-panel__net-value',
                    values.direction === 'PLACEMENT'
                      ? 'cash-flow-panel__net-value--positive'
                      : 'cash-flow-panel__net-value--negative'
                  )}
                >
                  {values.direction === 'PLACEMENT' ? '+' : '-'}
                  {formatCurrency(maturityProceeds - (values.principalAmount || 0), currency)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SettlementTab;
