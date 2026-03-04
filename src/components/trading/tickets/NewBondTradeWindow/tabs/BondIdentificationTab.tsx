// ============================================
// NewBondTradeWindow/tabs/BondIdentificationTab.tsx
// ============================================

import React, { useCallback, useEffect, useState } from 'react';
import { BondAutocomplete } from '../components/BondAutocomplete';
import { mockBondQuotes } from '@/mocks/bondReferenceData';
import { formatCurrency } from '@/lib/formatters';
import type { BondTradeFormState, BondInstrument, BondQuoteData } from '../types';

interface BondIdentificationTabProps {
  values: Partial<BondTradeFormState>;
  errors: Partial<Record<keyof BondTradeFormState, { message: string }>>;
  touched: Partial<Record<keyof BondTradeFormState, boolean>>;
  setValue: <K extends keyof BondTradeFormState>(field: K, value: BondTradeFormState[K]) => void;
  setTouched: (field: keyof BondTradeFormState) => void;
  validateField: (field: keyof BondTradeFormState) => void;
  onBondSelect: (bond: BondInstrument) => void;
  onQuoteUpdate: (quote: BondQuoteData) => void;
}

export const BondIdentificationTab: React.FC<BondIdentificationTabProps> = ({
  values,
  errors,
  touched,
  setValue,
  setTouched,
  onBondSelect,
  onQuoteUpdate,
}) => {
  const [quote, setQuote] = useState<BondQuoteData | null>(null);

  // Fetch quote when bond is selected
  useEffect(() => {
    if (values.bondIdentifier) {
      const bondQuote = mockBondQuotes[values.bondIdentifier];
      if (bondQuote) {
        setQuote(bondQuote);
        onQuoteUpdate(bondQuote);
      }
    }
  }, [values.bondIdentifier, onQuoteUpdate]);

  const handleBondSelect = useCallback(
    (bond: BondInstrument) => {
      onBondSelect(bond);
    },
    [onBondSelect]
  );

  const handleIdentifierChange = useCallback(
    (value: string) => {
      setValue('bondIdentifier', value);
    },
    [setValue]
  );

  const handleCurrencyChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setValue('currency', e.target.value);
      setTouched('currency');
    },
    [setValue, setTouched]
  );

  const formatOutstanding = (amount: number | undefined) => {
    if (!amount) return 'N/A';
    if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`;
    return formatCurrency(amount, 'USD');
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'N/A';
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="bond-tab bond-tab--identification">
      <div className="bond-tab__section">
        <h3 className="bond-tab__section-title">Bond Identification</h3>

        {/* Trade Reference (readonly) */}
        <div className="form-group">
          <label className="form-label">Trade Reference</label>
          <input
            type="text"
            className="form-input form-input--readonly"
            value={values.tradeReference || 'Auto-generated on submit'}
            readOnly
            disabled
          />
          <span className="form-hint">Auto-generated on submit</span>
        </div>

        {/* Bond Identifier */}
        <div className="form-group">
          <label className="form-label form-label--required">
            Bond Identifier (ISIN/CUSIP)
          </label>
          <BondAutocomplete
            value={values.bondIdentifier || ''}
            onChange={handleIdentifierChange}
            onSelect={handleBondSelect}
            placeholder="Enter ISIN (12 chars) or CUSIP (9 chars)"
            error={touched.bondIdentifier ? errors.bondIdentifier?.message : undefined}
          />
        </div>

        {/* Bond Name */}
        <div className="form-group">
          <label className="form-label">Bond Name / Description</label>
          <input
            type="text"
            className="form-input form-input--readonly"
            value={values.bondName || ''}
            readOnly
            placeholder="Auto-populated from instrument master"
          />
        </div>

        {/* Bond Details Panel */}
        {values.bondDetails && (
          <div className="bond-details-panel">
            <h4 className="bond-details-panel__title">Bond Details</h4>
            <div className="bond-details-panel__grid">
              <div className="bond-details-panel__item">
                <span className="bond-details-panel__label">Issuer</span>
                <span className="bond-details-panel__value">{values.bondDetails.issuer}</span>
              </div>
              <div className="bond-details-panel__item">
                <span className="bond-details-panel__label">Coupon</span>
                <span className="bond-details-panel__value">
                  {values.bondDetails.couponRate}%{' '}
                  {values.bondDetails.couponFrequency === 2 ? 'Semi-Annual' :
                   values.bondDetails.couponFrequency === 4 ? 'Quarterly' : 'Annual'}
                </span>
              </div>
              <div className="bond-details-panel__item">
                <span className="bond-details-panel__label">Maturity</span>
                <span className="bond-details-panel__value">
                  {formatDate(values.bondDetails.maturityDate)}
                </span>
              </div>
              <div className="bond-details-panel__item">
                <span className="bond-details-panel__label">Day Count</span>
                <span className="bond-details-panel__value">
                  {values.bondDetails.dayCountConvention}
                </span>
              </div>
              <div className="bond-details-panel__item">
                <span className="bond-details-panel__label">Issue Date</span>
                <span className="bond-details-panel__value">
                  {formatDate(values.bondDetails.issueDate)}
                </span>
              </div>
              <div className="bond-details-panel__item">
                <span className="bond-details-panel__label">Credit Rating</span>
                <span className="bond-details-panel__value">
                  {values.bondDetails.creditRating || 'N/A'}
                </span>
              </div>
              <div className="bond-details-panel__item">
                <span className="bond-details-panel__label">Outstanding</span>
                <span className="bond-details-panel__value">
                  {formatOutstanding(values.bondDetails.outstandingAmount)}
                </span>
              </div>
              <div className="bond-details-panel__item">
                <span className="bond-details-panel__label">Callable</span>
                <span className="bond-details-panel__value">
                  {values.bondDetails.callable ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Market Quote Panel */}
        {quote && (
          <div className="bond-quote-panel">
            <h4 className="bond-quote-panel__title">Current Market</h4>
            <div className="bond-quote-panel__grid">
              <div className="bond-quote-panel__item">
                <span className="bond-quote-panel__label">Bid</span>
                <span className="bond-quote-panel__value">{quote.bid.toFixed(4)}</span>
              </div>
              <div className="bond-quote-panel__item">
                <span className="bond-quote-panel__label">Ask</span>
                <span className="bond-quote-panel__value">{quote.ask.toFixed(4)}</span>
              </div>
              <div className="bond-quote-panel__item">
                <span className="bond-quote-panel__label">Last</span>
                <span className="bond-quote-panel__value bond-quote-panel__value--highlight">
                  {quote.lastPrice.toFixed(4)}
                </span>
              </div>
              <div className="bond-quote-panel__item">
                <span className="bond-quote-panel__label">Yield</span>
                <span className="bond-quote-panel__value">{quote.lastYield.toFixed(3)}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Currency */}
        <div className="form-group">
          <label className="form-label form-label--required">Currency</label>
          <select
            className="form-select"
            value={values.currency || 'USD'}
            onChange={handleCurrencyChange}
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="JPY">JPY - Japanese Yen</option>
            <option value="CHF">CHF - Swiss Franc</option>
          </select>
          <span className="form-hint">Defaults from instrument</span>
        </div>
      </div>
    </div>
  );
};

export default BondIdentificationTab;
