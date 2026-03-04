// ============================================
// NewMMTradeWindow/tabs/CounterpartyTab.tsx
// ============================================

import React, { useCallback, useMemo } from 'react';
import { formatCurrency } from '@/lib/formatters';
import { mockBanks, mockMMFunds, mockMMTraders } from '@/mocks/mmReferenceData';
import type { MMTradeFormState, ConfirmationMethod } from '../types';

interface CounterpartyTabProps {
  values: Partial<MMTradeFormState>;
  errors: Partial<Record<keyof MMTradeFormState, { message: string }>>;
  touched: Partial<Record<keyof MMTradeFormState, boolean>>;
  setValue: <K extends keyof MMTradeFormState>(field: K, value: MMTradeFormState[K]) => void;
  setTouched: (field: keyof MMTradeFormState) => void;
}

export const CounterpartyTab: React.FC<CounterpartyTabProps> = ({
  values,
  errors,
  touched,
  setValue,
  setTouched,
}) => {
  const selectedFund = useMemo(
    () => mockMMFunds.find((f) => f.id === values.fundId),
    [values.fundId]
  );

  const selectedBank = useMemo(
    () => mockBanks.find((b) => b.id === values.counterpartyBank),
    [values.counterpartyBank]
  );

  const handleFundChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setValue('fundId', e.target.value);
      setTouched('fundId');
    },
    [setValue, setTouched]
  );

  const handleBankChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const bank = mockBanks.find(b => b.id === e.target.value);
      setValue('counterpartyBank', e.target.value);
      if (bank) {
        setValue('bankSwift', bank.swiftCode);
        setValue('bankContact', bank.contacts[0]?.name);
      }
      setTouched('counterpartyBank');
    },
    [setValue, setTouched]
  );

  const handleDealerChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setValue('dealerBroker', e.target.value);
    },
    [setValue]
  );

  const handleTraderChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setValue('traderId', e.target.value);
      setTouched('traderId');
    },
    [setValue, setTouched]
  );

  const handleConfirmationChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setValue('confirmationMethod', e.target.value as ConfirmationMethod);
    },
    [setValue]
  );

  const formatAum = (amount: number) => {
    if (amount >= 1e9) return `R ${(amount / 1e9).toFixed(1)} Billion`;
    if (amount >= 1e6) return `R ${(amount / 1e6).toFixed(0)} Million`;
    return formatCurrency(amount, 'ZAR');
  };

  const newExposure = selectedBank
    ? selectedBank.currentExposure + (values.principalAmount || 0)
    : 0;

  const exposurePercent = selectedBank
    ? (newExposure / selectedBank.approvedLimit) * 100
    : 0;

  return (
    <div className="mm-tab mm-tab--counterparty">
      <div className="mm-tab__section">
        <h3 className="mm-tab__section-title">Counterparty & Account</h3>

        {/* Fund / Portfolio */}
        <div className="form-group">
          <label className="form-label form-label--required">Fund / Portfolio</label>
          <select
            className={`form-select ${touched.fundId && errors.fundId ? 'form-select--error' : ''}`}
            value={values.fundId || ''}
            onChange={handleFundChange}
          >
            <option value="">Select fund...</option>
            {mockMMFunds.map((fund) => (
              <option key={fund.id} value={fund.id}>
                {fund.id} - {fund.name}
              </option>
            ))}
          </select>
          {touched.fundId && errors.fundId && (
            <span className="form-error">{errors.fundId.message}</span>
          )}
        </div>

        {/* Fund Cash Position Panel */}
        {selectedFund && (
          <div className="fund-position-panel">
            <h4 className="fund-position-panel__title">Fund Cash Position</h4>
            <div className="fund-position-panel__grid">
              <div className="fund-position-panel__item">
                <span className="fund-position-panel__label">Total AUM</span>
                <span className="fund-position-panel__value">{formatAum(selectedFund.aum)}</span>
              </div>
              <div className="fund-position-panel__item">
                <span className="fund-position-panel__label">Available Cash</span>
                <span className="fund-position-panel__value">{formatAum(selectedFund.availableCash)}</span>
              </div>
              <div className="fund-position-panel__item">
                <span className="fund-position-panel__label">Current Placements</span>
                <span className="fund-position-panel__value">{formatAum(selectedFund.currentPlacements)}</span>
              </div>
              <div className="fund-position-panel__item">
                <span className="fund-position-panel__label">Pending Maturities</span>
                <span className="fund-position-panel__value">{formatAum(selectedFund.pendingMaturities)} (next 7 days)</span>
              </div>
            </div>
            <div className="fund-position-panel__limits">
              <div className="fund-position-panel__limit-item">
                Single Bank: {formatAum(selectedFund.singleBankLimit)} (max 25% of AUM)
              </div>
              {selectedBank && (
                <div className="fund-position-panel__limit-item">
                  Current with {selectedBank.shortName}: {formatCurrency(selectedBank.currentExposure, 'ZAR')} ({((selectedBank.currentExposure / selectedFund.singleBankLimit) * 100).toFixed(0)}% of limit)
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bank / Counterparty */}
        <div className="form-group">
          <label className="form-label form-label--required">Bank / Counterparty</label>
          <select
            className={`form-select ${touched.counterpartyBank && errors.counterpartyBank ? 'form-select--error' : ''}`}
            value={values.counterpartyBank || ''}
            onChange={handleBankChange}
          >
            <option value="">Select bank...</option>
            {mockBanks.map((bank) => (
              <option key={bank.id} value={bank.id}>
                {bank.shortName} - {bank.name}
              </option>
            ))}
          </select>
          {touched.counterpartyBank && errors.counterpartyBank && (
            <span className="form-error">{errors.counterpartyBank.message}</span>
          )}
        </div>

        {/* Bank Details Panel */}
        {selectedBank && (
          <div className="bank-details-panel">
            <h4 className="bank-details-panel__title">Bank Details</h4>
            <div className="bank-details-panel__grid">
              <div className="bank-details-panel__item">
                <span className="bank-details-panel__label">Legal Name</span>
                <span className="bank-details-panel__value">{selectedBank.name}</span>
              </div>
              <div className="bank-details-panel__item">
                <span className="bank-details-panel__label">LEI</span>
                <span className="bank-details-panel__value bank-details-panel__value--mono">{selectedBank.lei}</span>
              </div>
              <div className="bank-details-panel__item">
                <span className="bank-details-panel__label">Credit Rating</span>
                <span className="bank-details-panel__value">
                  {selectedBank.creditRating.fitch && `${selectedBank.creditRating.fitch} (Fitch)`}
                  {selectedBank.creditRating.moodys && ` / ${selectedBank.creditRating.moodys} (Moody's)`}
                </span>
              </div>
              <div className="bank-details-panel__item">
                <span className="bank-details-panel__label">Country</span>
                <span className="bank-details-panel__value">{selectedBank.country}</span>
              </div>
              <div className="bank-details-panel__item">
                <span className="bank-details-panel__label">Approved Limit</span>
                <span className="bank-details-panel__value">{formatCurrency(selectedBank.approvedLimit, 'ZAR')}</span>
              </div>
              <div className="bank-details-panel__item">
                <span className="bank-details-panel__label">Current Exposure</span>
                <span className="bank-details-panel__value">{formatCurrency(selectedBank.currentExposure, 'ZAR')}</span>
              </div>
              <div className="bank-details-panel__item">
                <span className="bank-details-panel__label">Available</span>
                <span className="bank-details-panel__value">{formatCurrency(selectedBank.availableLimit, 'ZAR')}</span>
              </div>
            </div>
            {values.principalAmount && values.principalAmount > 0 && (
              <div className={`bank-details-panel__exposure-warning ${exposurePercent > 80 ? 'bank-details-panel__exposure-warning--high' : ''}`}>
                This trade: {formatCurrency(values.principalAmount, 'ZAR')} → New Exposure: {formatCurrency(newExposure, 'ZAR')} ({exposurePercent.toFixed(0)}% of limit)
              </div>
            )}
          </div>
        )}

        <div className="form-divider" />

        {/* Dealer/Broker & Trader */}
        <div className="form-row">
          <div className="form-group form-group--flex-1">
            <label className="form-label">Dealer / Broker (if applicable)</label>
            <select
              className="form-select"
              value={values.dealerBroker || 'DIRECT'}
              onChange={handleDealerChange}
            >
              <option value="DIRECT">Direct with Bank</option>
              <option value="BROKER">Via Money Broker</option>
            </select>
            <span className="form-hint">Direct or via money broker</span>
          </div>

          <div className="form-group form-group--flex-1">
            <label className="form-label form-label--required">Trader</label>
            <select
              className={`form-select ${touched.traderId && errors.traderId ? 'form-select--error' : ''}`}
              value={values.traderId || ''}
              onChange={handleTraderChange}
            >
              <option value="">Select trader...</option>
              {mockMMTraders.map((trader) => (
                <option key={trader.id} value={trader.id}>
                  {trader.name}
                  {trader.id === 'trader-001' ? ' (Current User)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bank Contact & Confirmation */}
        <div className="form-row">
          <div className="form-group form-group--flex-1">
            <label className="form-label">Bank Contact</label>
            {selectedBank && selectedBank.contacts && selectedBank.contacts.length > 0 ? (
              <div className="bank-contact-display">
                <div className="bank-contact-display__name">{selectedBank.contacts[0]?.name}</div>
                <div className="bank-contact-display__role">{selectedBank.contacts[0]?.role}</div>
                <div className="bank-contact-display__phone">{selectedBank.contacts[0]?.phone}</div>
                <div className="bank-contact-display__email">{selectedBank.contacts[0]?.email}</div>
              </div>
            ) : (
              <input
                type="text"
                className="form-input form-input--readonly"
                value="Select bank to view contact"
                readOnly
              />
            )}
          </div>

          <div className="form-group form-group--flex-1">
            <label className="form-label">Confirmation Method</label>
            <select
              className="form-select"
              value={values.confirmationMethod || 'SWIFT_MT320'}
              onChange={handleConfirmationChange}
            >
              <option value="SWIFT_MT320">SWIFT MT320</option>
              <option value="EMAIL">Email</option>
              <option value="FAX">Fax</option>
            </select>
            <span className="form-hint">Confirmation type</span>
          </div>
        </div>

        {/* Booking Summary Panel */}
        {selectedFund && selectedBank && values.traderId && (
          <div className="booking-summary-panel">
            <h4 className="booking-summary-panel__title">Booking Summary</h4>
            <div className="booking-summary-panel__grid">
              <div className="booking-summary-panel__item">
                <span className="booking-summary-panel__label">Fund:</span>
                <span className="booking-summary-panel__value">{selectedFund.id} ({selectedFund.name})</span>
              </div>
              <div className="booking-summary-panel__item">
                <span className="booking-summary-panel__label">Bank:</span>
                <span className="booking-summary-panel__value">{selectedBank.name}</span>
              </div>
              <div className="booking-summary-panel__item">
                <span className="booking-summary-panel__label">Trader:</span>
                <span className="booking-summary-panel__value">
                  {mockMMTraders.find(t => t.id === values.traderId)?.name || values.traderId}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CounterpartyTab;
