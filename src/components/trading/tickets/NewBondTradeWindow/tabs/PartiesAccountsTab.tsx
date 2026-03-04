// ============================================
// NewBondTradeWindow/tabs/PartiesAccountsTab.tsx
// ============================================

import React, { useCallback, useMemo } from 'react';
import { mockFunds, mockCounterparties, mockBondTraders } from '@/mocks/bondReferenceData';
import { formatCurrency } from '@/lib/formatters';
import type { BondTradeFormState } from '../types';

interface PartiesAccountsTabProps {
  values: Partial<BondTradeFormState>;
  errors: Partial<Record<keyof BondTradeFormState, { message: string }>>;
  touched: Partial<Record<keyof BondTradeFormState, boolean>>;
  setValue: <K extends keyof BondTradeFormState>(field: K, value: BondTradeFormState[K]) => void;
  setTouched: (field: keyof BondTradeFormState) => void;
  validateField: (field: keyof BondTradeFormState) => void;
  netSettlement: number;
}

export const PartiesAccountsTab: React.FC<PartiesAccountsTabProps> = ({
  values,
  errors,
  touched,
  setValue,
  setTouched,
  netSettlement,
}) => {
  const selectedFund = useMemo(
    () => mockFunds.find((f) => f.id === values.fundAccountId),
    [values.fundAccountId]
  );

  const selectedCounterparty = useMemo(
    () => mockCounterparties.find((c) => c.id === values.counterparty),
    [values.counterparty]
  );

  const handleFundChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setValue('fundAccountId', e.target.value);
      setTouched('fundAccountId');
    },
    [setValue, setTouched]
  );

  const handleCounterpartyChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setValue('counterparty', e.target.value);
      setTouched('counterparty');
    },
    [setValue, setTouched]
  );

  const handleTraderChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setValue('traderId', e.target.value);
      setTouched('traderId');
    },
    [setValue, setTouched]
  );

  const formatAum = (aum: number) => {
    if (aum >= 1e9) return `$${(aum / 1e9).toFixed(1)}B`;
    if (aum >= 1e6) return `$${(aum / 1e6).toFixed(1)}M`;
    return formatCurrency(aum, 'USD');
  };

  const exposureAfterTrade = selectedCounterparty
    ? (selectedCounterparty.currentExposure || 0) + netSettlement
    : 0;

  const exposurePercentUsed = selectedCounterparty
    ? ((exposureAfterTrade / (selectedCounterparty.exposureLimit || 1)) * 100)
    : 0;

  return (
    <div className="bond-tab bond-tab--parties">
      <div className="bond-tab__section">
        <h3 className="bond-tab__section-title">Parties & Accounts</h3>

        {/* Fund / Account */}
        <div className="form-group">
          <label className="form-label form-label--required">Fund / Account</label>
          <select
            className={`form-select ${touched.fundAccountId && errors.fundAccountId ? 'form-select--error' : ''}`}
            value={values.fundAccountId || ''}
            onChange={handleFundChange}
          >
            <option value="">Select fund...</option>
            {mockFunds.map((fund) => (
              <option key={fund.id} value={fund.id}>
                {fund.id} - {fund.name}
              </option>
            ))}
          </select>
          {touched.fundAccountId && errors.fundAccountId && (
            <span className="form-error">{errors.fundAccountId.message}</span>
          )}
        </div>

        {/* Fund Details Panel */}
        {selectedFund && (
          <div className="fund-details-panel">
            <h4 className="fund-details-panel__title">Fund Details</h4>
            <div className="fund-details-panel__grid">
              <div className="fund-details-panel__item">
                <span className="fund-details-panel__label">AUM</span>
                <span className="fund-details-panel__value">{formatAum(selectedFund.aum)}</span>
              </div>
              <div className="fund-details-panel__item">
                <span className="fund-details-panel__label">Strategy</span>
                <span className="fund-details-panel__value">{selectedFund.strategy}</span>
              </div>
              <div className="fund-details-panel__item">
                <span className="fund-details-panel__label">Duration Target</span>
                <span className="fund-details-panel__value">{selectedFund.durationTarget}</span>
              </div>
              <div className="fund-details-panel__item">
                <span className="fund-details-panel__label">Current Duration</span>
                <span className="fund-details-panel__value">{selectedFund.currentDuration} years</span>
              </div>
              <div className="fund-details-panel__item">
                <span className="fund-details-panel__label">Cash Available</span>
                <span className="fund-details-panel__value">
                  {formatCurrency(selectedFund.cashAvailable, selectedFund.baseCurrency)}{' '}
                  ({((selectedFund.cashAvailable / selectedFund.aum) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Counterparty */}
        <div className="form-group">
          <label className="form-label form-label--required">Counterparty / Broker-Dealer</label>
          <select
            className={`form-select ${touched.counterparty && errors.counterparty ? 'form-select--error' : ''}`}
            value={values.counterparty || ''}
            onChange={handleCounterpartyChange}
          >
            <option value="">Select counterparty...</option>
            {mockCounterparties.map((cp) => (
              <option key={cp.id} value={cp.id}>
                {cp.code} - {cp.name}
              </option>
            ))}
          </select>
          {touched.counterparty && errors.counterparty && (
            <span className="form-error">{errors.counterparty.message}</span>
          )}
          {selectedCounterparty && (
            <span className="form-hint">LEI: {selectedCounterparty.lei}</span>
          )}
        </div>

        {/* Counterparty Exposure Panel */}
        {selectedCounterparty && netSettlement > 0 && (
          <div className="exposure-panel">
            <h4 className="exposure-panel__title">Counterparty Exposure</h4>
            <div className="exposure-panel__grid">
              <div className="exposure-panel__row">
                <span className="exposure-panel__label">Current Exposure ({selectedCounterparty.code})</span>
                <span className="exposure-panel__value">
                  {formatCurrency(selectedCounterparty.currentExposure || 0, 'USD')}
                  {selectedFund && (
                    <span className="exposure-panel__percent">
                      ({(((selectedCounterparty.currentExposure || 0) / selectedFund.aum) * 100).toFixed(1)}% of AUM)
                    </span>
                  )}
                </span>
              </div>
              <div className="exposure-panel__row">
                <span className="exposure-panel__label">After This Trade</span>
                <span className="exposure-panel__value">
                  {formatCurrency(exposureAfterTrade, 'USD')}
                  {selectedFund && (
                    <span className="exposure-panel__percent">
                      ({((exposureAfterTrade / selectedFund.aum) * 100).toFixed(1)}% of AUM)
                    </span>
                  )}
                </span>
              </div>
              <div className="exposure-panel__row">
                <span className="exposure-panel__label">Counterparty Limit</span>
                <span className="exposure-panel__value">
                  {formatCurrency(selectedCounterparty.exposureLimit || 0, 'USD')}
                </span>
              </div>
              <div className="exposure-panel__divider" />
              <div className="exposure-panel__progress">
                <div className="exposure-panel__progress-bar">
                  <div
                    className={`exposure-panel__progress-fill ${exposurePercentUsed > 90 ? 'exposure-panel__progress-fill--warning' : ''}`}
                    style={{ width: `${Math.min(exposurePercentUsed, 100)}%` }}
                  />
                </div>
                <span className="exposure-panel__progress-label">
                  {exposurePercentUsed.toFixed(1)}% of limit used
                </span>
              </div>
              <div className={`exposure-panel__status ${exposurePercentUsed > 100 ? 'exposure-panel__status--error' : 'exposure-panel__status--ok'}`}>
                {exposurePercentUsed > 100 ? (
                  <span>&#9888; Exceeds counterparty limit</span>
                ) : (
                  <span>&#10003; Within counterparty limits</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Trader */}
        <div className="form-group">
          <label className="form-label form-label--required">Trader / Created By</label>
          <select
            className={`form-select ${touched.traderId && errors.traderId ? 'form-select--error' : ''}`}
            value={values.traderId || ''}
            onChange={handleTraderChange}
          >
            <option value="">Select trader...</option>
            {mockBondTraders.map((trader) => (
              <option key={trader.id} value={trader.id}>
                {trader.name}
                {trader.id === 'trader-001' ? ' (Current User)' : ''}
              </option>
            ))}
          </select>
          {touched.traderId && errors.traderId && (
            <span className="form-error">{errors.traderId.message}</span>
          )}
        </div>

        <div className="form-divider" />

        {/* Allocation Section */}
        <div className="allocation-panel">
          <h4 className="allocation-panel__title">Allocation (for block trades)</h4>
          <div className="allocation-panel__options">
            <label className="radio-item">
              <input
                type="radio"
                name="allocation"
                checked={true}
                readOnly
              />
              <span className="radio-label">Single fund allocation (100%)</span>
            </label>
            <label className="radio-item">
              <input
                type="radio"
                name="allocation"
                checked={false}
                disabled
              />
              <span className="radio-label">Multi-fund allocation</span>
            </label>
          </div>
          <button type="button" className="form-btn form-btn--ghost form-btn--sm" disabled>
            + Add Allocation
          </button>
        </div>
      </div>
    </div>
  );
};

export default PartiesAccountsTab;
