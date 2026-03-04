// ============================================
// NewMMTradeWindow/tabs/PricingInterestTab.tsx
// ============================================

import React, { useCallback } from 'react';
import clsx from 'clsx';
import { formatCurrency } from '@/lib/formatters';
import { referenceRateOptions, mockReferenceRates } from '@/mocks/mmReferenceData';
import type {
  MMTradeFormState,
  RateType,
  MMDayCountConvention,
  InterestFrequency,
  CompoundingType,
} from '../types';

interface PricingInterestTabProps {
  values: Partial<MMTradeFormState>;
  errors: Partial<Record<keyof MMTradeFormState, { message: string }>>;
  touched: Partial<Record<keyof MMTradeFormState, boolean>>;
  setValue: <K extends keyof MMTradeFormState>(field: K, value: MMTradeFormState[K]) => void;
  setTouched: (field: keyof MMTradeFormState) => void;
  onRateTypeChange: (type: RateType) => void;
  interestAmount: number;
  maturityProceeds: number;
  annualizedReturn: number;
}

export const PricingInterestTab: React.FC<PricingInterestTabProps> = ({
  values,
  errors,
  touched,
  setValue,
  setTouched,
  onRateTypeChange,
  interestAmount,
  maturityProceeds,
  annualizedReturn: _annualizedReturn,
}) => {
  const handleInterestRateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[^0-9.]/g, '');
      const numValue = value ? parseFloat(value) : null;
      setValue('interestRate', numValue);
    },
    [setValue]
  );

  const handleDayCountChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setValue('dayCountConvention', e.target.value as MMDayCountConvention);
    },
    [setValue]
  );

  const handleReferenceRateChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const refRate = referenceRateOptions.find(r => r.id === e.target.value);
      setValue('referenceRate', e.target.value);
      if (refRate) {
        setValue('currentReference', refRate.value);
      }
    },
    [setValue]
  );

  const handleSpreadChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[^0-9-]/g, '');
      const numValue = value ? parseInt(value, 10) : undefined;
      setValue('spreadBps', numValue);
    },
    [setValue]
  );

  const handleFrequencyChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setValue('interestFrequency', e.target.value as InterestFrequency);
    },
    [setValue]
  );

  const handleCompoundingChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setValue('compounding', e.target.value as CompoundingType);
    },
    [setValue]
  );

  const handleAutoRolloverChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue('autoRollover', e.target.checked);
    },
    [setValue]
  );

  const handleCapitalizeInterestChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue('capitalizeInterest', e.target.checked);
    },
    [setValue]
  );

  const currency = values.currency || 'ZAR';
  const displayRate = values.rateType === 'FLOATING'
    ? values.allInRate
    : values.interestRate;

  return (
    <div className="mm-tab mm-tab--pricing">
      <div className="mm-tab__section">
        <h3 className="mm-tab__section-title">Pricing & Interest</h3>

        {/* Rate Type Toggle */}
        <div className="form-group">
          <label className="form-label form-label--required">Rate Type</label>
          <div className="rate-type-toggle">
            <button
              type="button"
              className={clsx(
                'rate-type-btn',
                values.rateType === 'FIXED' && 'rate-type-btn--selected'
              )}
              onClick={() => onRateTypeChange('FIXED')}
            >
              <span className="rate-type-btn__label">FIXED RATE</span>
              <span className="rate-type-btn__desc">Locked for term</span>
            </button>
            <button
              type="button"
              className={clsx(
                'rate-type-btn',
                values.rateType === 'FLOATING' && 'rate-type-btn--selected'
              )}
              onClick={() => onRateTypeChange('FLOATING')}
            >
              <span className="rate-type-btn__label">FLOATING RATE</span>
              <span className="rate-type-btn__desc">Reference + Spread</span>
            </button>
          </div>
        </div>

        <div className="form-divider" />

        {/* Fixed Rate Section */}
        {values.rateType === 'FIXED' && (
          <div className="rate-section">
            <div className="rate-section__header">FIXED RATE</div>
            <div className="form-row">
              <div className="form-group form-group--flex-2">
                <label className="form-label form-label--required">Interest Rate (per annum)</label>
                <div className="input-with-suffix">
                  <input
                    type="text"
                    className={clsx(
                      'form-input',
                      touched.interestRate && errors.interestRate && 'form-input--error'
                    )}
                    value={values.interestRate !== null ? values.interestRate : ''}
                    onChange={handleInterestRateChange}
                    onBlur={() => setTouched('interestRate')}
                    placeholder="5.5000"
                  />
                  <span className="input-suffix">%</span>
                </div>
                {touched.interestRate && errors.interestRate && (
                  <span className="form-error">{errors.interestRate.message}</span>
                )}
                <span className="form-hint">Annual rate</span>
              </div>

              <div className="form-group form-group--flex-1">
                <label className="form-label">Day Count Convention</label>
                <select
                  className="form-select"
                  value={values.dayCountConvention || 'ACT/365'}
                  onChange={handleDayCountChange}
                >
                  <option value="ACT/365">ACT/365</option>
                  <option value="ACT/360">ACT/360</option>
                  <option value="30/360">30/360</option>
                </select>
                <span className="form-hint">South African convention</span>
              </div>
            </div>
          </div>
        )}

        {/* Floating Rate Section */}
        {values.rateType === 'FLOATING' && (
          <div className="rate-section">
            <div className="rate-section__header">FLOATING RATE</div>
            <div className="form-row">
              <div className="form-group form-group--flex-1">
                <label className="form-label form-label--required">Reference Rate</label>
                <select
                  className="form-select"
                  value={values.referenceRate || ''}
                  onChange={handleReferenceRateChange}
                >
                  <option value="">Select reference...</option>
                  {referenceRateOptions.map((rate) => (
                    <option key={rate.id} value={rate.id}>
                      {rate.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group form-group--flex-1">
                <label className="form-label">Current Reference</label>
                <div className="input-with-suffix">
                  <input
                    type="text"
                    className="form-input form-input--readonly"
                    value={values.currentReference?.toFixed(4) || '--'}
                    readOnly
                  />
                  <span className="input-suffix">%</span>
                </div>
                <span className="form-hint">As of today</span>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group form-group--flex-1">
                <label className="form-label">Spread</label>
                <div className="input-with-suffix">
                  <input
                    type="text"
                    className="form-input"
                    value={values.spreadBps !== undefined ? values.spreadBps : ''}
                    onChange={handleSpreadChange}
                    placeholder="+25"
                  />
                  <span className="input-suffix">bps</span>
                </div>
                <span className="form-hint">Added to reference</span>
              </div>

              <div className="form-group form-group--flex-1">
                <label className="form-label">All-in Rate</label>
                <div className="input-with-suffix">
                  <input
                    type="text"
                    className="form-input form-input--readonly form-input--highlight"
                    value={values.allInRate?.toFixed(4) || '--'}
                    readOnly
                  />
                  <span className="input-suffix">%</span>
                </div>
                <span className="form-hint">Reference + Spread</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Day Count Convention</label>
              <select
                className="form-select"
                value={values.dayCountConvention || 'ACT/365'}
                onChange={handleDayCountChange}
                style={{ maxWidth: '250px' }}
              >
                <option value="ACT/365">ACT/365</option>
                <option value="ACT/360">ACT/360</option>
                <option value="30/360">30/360</option>
              </select>
            </div>
          </div>
        )}

        <div className="form-divider" />

        {/* Interest Payment Options */}
        <div className="form-row">
          <div className="form-group form-group--flex-1">
            <label className="form-label">Interest Payment Frequency</label>
            <select
              className="form-select"
              value={values.interestFrequency || 'AT_MATURITY'}
              onChange={handleFrequencyChange}
            >
              <option value="MONTHLY">Monthly</option>
              <option value="QUARTERLY">Quarterly</option>
              <option value="SEMI_ANNUAL">Semi-Annual</option>
              <option value="AT_MATURITY">At Maturity</option>
            </select>
          </div>

          <div className="form-group form-group--flex-1">
            <label className="form-label">Compounding</label>
            <select
              className="form-select"
              value={values.compounding || 'SIMPLE'}
              onChange={handleCompoundingChange}
            >
              <option value="SIMPLE">Simple Interest</option>
              <option value="COMPOUND">Compound Interest</option>
            </select>
          </div>
        </div>

        <div className="form-divider" />

        {/* Interest Calculation Panel */}
        {values.principalAmount && values.principalAmount > 0 && displayRate && (
          <div className="interest-calc-panel">
            <h4 className="interest-calc-panel__title">Interest Calculation</h4>
            <div className="interest-calc-panel__breakdown">
              <div className="interest-calc-panel__row">
                <span>Principal Amount</span>
                <span>{formatCurrency(values.principalAmount, currency)}</span>
              </div>
              <div className="interest-calc-panel__row">
                <span>Interest Rate</span>
                <span>{displayRate?.toFixed(2)}% p.a.</span>
              </div>
              <div className="interest-calc-panel__row">
                <span>Tenor</span>
                <span>{values.days || 0} days</span>
              </div>
              <div className="interest-calc-panel__row">
                <span>Day Count</span>
                <span>{values.dayCountConvention || 'ACT/365'}</span>
              </div>
              <div className="interest-calc-panel__divider" />
              <div className="interest-calc-panel__formula">
                {currency} {(values.principalAmount || 0).toLocaleString()} × {displayRate?.toFixed(2)}% × ({values.days || 0} / {values.dayCountConvention === 'ACT/360' || values.dayCountConvention === '30/360' ? 360 : 365})
              </div>
              <div className="interest-calc-panel__divider" />
              <div className="interest-calc-panel__result">
                <span>INTEREST AMOUNT</span>
                <span className="interest-calc-panel__result-value">
                  {formatCurrency(interestAmount, currency)}
                </span>
              </div>
              <div className="interest-calc-panel__divider" />
              <div className="interest-calc-panel__result">
                <span>MATURITY PROCEEDS</span>
                <span className="interest-calc-panel__result-value interest-calc-panel__result-value--highlight">
                  {formatCurrency(maturityProceeds, currency)}
                </span>
                <span className="interest-calc-panel__result-note">(Principal + Interest)</span>
              </div>
            </div>
          </div>
        )}

        {/* Rate Comparison Panel */}
        <div className="rate-comparison-panel">
          <h4 className="rate-comparison-panel__title">Rate Comparison</h4>
          <div className="rate-comparison-panel__grid">
            <div className="rate-comparison-panel__item">
              <span className="rate-comparison-panel__label">Your Rate</span>
              <span className="rate-comparison-panel__value">{displayRate?.toFixed(2) || '--'}%</span>
            </div>
            <div className="rate-comparison-panel__item">
              <span className="rate-comparison-panel__label">JIBAR 3M</span>
              <span className="rate-comparison-panel__value">{mockReferenceRates.jibar_3m.toFixed(2)}%</span>
            </div>
            <div className="rate-comparison-panel__item">
              <span className="rate-comparison-panel__label">Repo Rate</span>
              <span className="rate-comparison-panel__value">{mockReferenceRates.sarb_repo.toFixed(2)}%</span>
            </div>
            <div className="rate-comparison-panel__item">
              <span className="rate-comparison-panel__label">Prime</span>
              <span className="rate-comparison-panel__value">{mockReferenceRates.prime.toFixed(2)}%</span>
            </div>
          </div>
          {displayRate && (
            <div className="rate-comparison-panel__diff">
              vs JIBAR: {((displayRate - mockReferenceRates.jibar_3m) * 100).toFixed(0)} bps |
              vs Repo: {((displayRate - mockReferenceRates.sarb_repo) * 100).toFixed(0)} bps
            </div>
          )}
        </div>

        <div className="form-divider" />

        {/* Rollover Instructions */}
        <div className="rollover-panel">
          <h4 className="rollover-panel__title">Rollover Instructions</h4>
          <div className="rollover-panel__options">
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={values.autoRollover || false}
                onChange={handleAutoRolloverChange}
              />
              <span className="checkbox-label">Auto-rollover at maturity</span>
            </label>
            {values.autoRollover && (
              <div className="rollover-panel__sub-options">
                <select className="form-select form-select--sm" disabled>
                  <option>Same tenor</option>
                </select>
                <select className="form-select form-select--sm" disabled>
                  <option>Prevailing rate</option>
                </select>
              </div>
            )}
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={values.capitalizeInterest || false}
                onChange={handleCapitalizeInterestChange}
              />
              <span className="checkbox-label">Capitalize interest (add to principal on rollover)</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingInterestTab;
