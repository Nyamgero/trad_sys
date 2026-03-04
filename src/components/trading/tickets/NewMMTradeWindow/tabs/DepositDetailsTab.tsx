// ============================================
// NewMMTradeWindow/tabs/DepositDetailsTab.tsx
// ============================================

import React, { useCallback } from 'react';
import clsx from 'clsx';
import { formatCurrency } from '@/lib/formatters';
import { mockMMCurrencies } from '@/mocks/mmReferenceData';
import type {
  MMTradeFormState,
  MMDirection,
  DepositType,
  TenorPreset,
} from '../types';

interface DepositDetailsTabProps {
  values: Partial<MMTradeFormState>;
  errors: Partial<Record<keyof MMTradeFormState, { message: string }>>;
  touched: Partial<Record<keyof MMTradeFormState, boolean>>;
  setValue: <K extends keyof MMTradeFormState>(field: K, value: MMTradeFormState[K]) => void;
  setTouched: (field: keyof MMTradeFormState) => void;
  onDirectionChange: (direction: MMDirection) => void;
  onDepositTypeChange: (type: DepositType) => void;
  onTenorChange: (tenor: TenorPreset) => void;
  interestAmount: number;
  maturityProceeds: number;
}

const TENOR_CHIPS: TenorPreset[] = ['O/N', '1W', '1M', '3M', '6M', '9M', '12M'];
const DEPOSIT_TYPES: DepositType[] = ['CALL', 'NOTICE', 'FIXED', 'TERM'];

export const DepositDetailsTab: React.FC<DepositDetailsTabProps> = ({
  values,
  errors,
  touched,
  setValue,
  setTouched,
  onDirectionChange,
  onDepositTypeChange,
  onTenorChange,
  interestAmount,
  maturityProceeds,
}) => {
  const handlePrincipalChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[^0-9]/g, '');
      const numValue = value ? parseInt(value, 10) : null;
      setValue('principalAmount', numValue);
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

  const handleTradeDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const date = new Date(e.target.value);
      if (!isNaN(date.getTime())) {
        setValue('tradeDate', date);
        setTouched('tradeDate');
      }
    },
    [setValue, setTouched]
  );

  const handleValueDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const date = new Date(e.target.value);
      if (!isNaN(date.getTime())) {
        setValue('valueDate', date);
        setTouched('valueDate');
      }
    },
    [setValue, setTouched]
  );

  const handleMaturityDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const date = new Date(e.target.value);
      if (!isNaN(date.getTime())) {
        setValue('maturityDate', date);
        setValue('tenor', 'CUSTOM');
        setTouched('maturityDate');
      }
    },
    [setValue, setTouched]
  );

  const handleNoticePeriodChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setValue('noticePeriod', parseInt(e.target.value, 10));
    },
    [setValue]
  );

  const formatDateForInput = (date: Date | null | undefined) => {
    if (!date) return '';
    return date.toISOString().split('T')[0] ?? '';
  };

  const formatPrincipal = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '';
    return value.toLocaleString();
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return 'N/A';
    return date.toLocaleDateString('en-ZA', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const showMaturityFields = ['FIXED', 'TERM'].includes(values.depositType || 'FIXED');
  const showNoticePeriod = values.depositType === 'NOTICE';

  return (
    <div className="mm-tab mm-tab--deposit-details">
      <div className="mm-tab__section">
        <h3 className="mm-tab__section-title">Deposit Details</h3>

        {/* Trade Reference */}
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

        {/* Direction */}
        <div className="form-group">
          <label className="form-label form-label--required">Direction</label>
          <div className="direction-buttons">
            <button
              type="button"
              className={clsx(
                'direction-button direction-button--placement',
                values.direction === 'PLACEMENT' && 'direction-button--selected'
              )}
              onClick={() => onDirectionChange('PLACEMENT')}
            >
              <span className="direction-button__label">PLACEMENT</span>
              <span className="direction-button__desc">Place funds (Lend)</span>
            </button>
            <button
              type="button"
              className={clsx(
                'direction-button direction-button--borrowing',
                values.direction === 'BORROWING' && 'direction-button--selected'
              )}
              onClick={() => onDirectionChange('BORROWING')}
            >
              <span className="direction-button__label">BORROWING</span>
              <span className="direction-button__desc">Take funds (Borrow)</span>
            </button>
          </div>
        </div>

        {/* Deposit Type */}
        <div className="form-group">
          <label className="form-label form-label--required">Deposit Type</label>
          <div className="deposit-type-chips">
            {DEPOSIT_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                className={clsx(
                  'deposit-type-chip',
                  values.depositType === type && 'deposit-type-chip--selected'
                )}
                onClick={() => onDepositTypeChange(type)}
              >
                <span className="deposit-type-chip__label">{type}</span>
                <span className="deposit-type-chip__desc">
                  {type === 'CALL' && '(O/N)'}
                  {type === 'NOTICE' && '(7/32d)'}
                  {type === 'FIXED' && '(≤12M)'}
                  {type === 'TERM' && '(>12M)'}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="form-divider" />

        {/* Principal & Currency */}
        <div className="form-row">
          <div className="form-group form-group--flex-2">
            <label className="form-label form-label--required">Principal Amount</label>
            <div className="input-with-currency">
              <span className="input-currency">{values.currency || 'ZAR'}</span>
              <input
                type="text"
                className={clsx(
                  'form-input',
                  touched.principalAmount && errors.principalAmount && 'form-input--error'
                )}
                value={formatPrincipal(values.principalAmount)}
                onChange={handlePrincipalChange}
                onBlur={() => setTouched('principalAmount')}
                placeholder="50,000,000"
              />
            </div>
            {touched.principalAmount && errors.principalAmount && (
              <span className="form-error">{errors.principalAmount.message}</span>
            )}
            <span className="form-hint">Minimum: {values.currency || 'ZAR'} 1,000,000</span>
          </div>

          <div className="form-group form-group--flex-1">
            <label className="form-label form-label--required">Currency</label>
            <select
              className="form-select"
              value={values.currency || 'ZAR'}
              onChange={handleCurrencyChange}
            >
              {mockMMCurrencies.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.code} - {curr.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-divider" />

        {/* Trade Date & Value Date */}
        <div className="form-row">
          <div className="form-group form-group--flex-1">
            <label className="form-label form-label--required">Trade Date</label>
            <input
              type="date"
              className="form-input"
              value={formatDateForInput(values.tradeDate)}
              onChange={handleTradeDateChange}
            />
            <span className="form-hint">Defaults to today</span>
          </div>

          <div className="form-group form-group--flex-1">
            <label className="form-label form-label--required">Value Date</label>
            <input
              type="date"
              className="form-input"
              value={formatDateForInput(values.valueDate)}
              onChange={handleValueDateChange}
            />
            <span className="form-hint">When funds are placed</span>
          </div>
        </div>

        {/* Tenor & Maturity */}
        {showMaturityFields && (
          <>
            <div className="form-row">
              <div className="form-group form-group--flex-1">
                <label className="form-label">Tenor</label>
                <div className="tenor-chips">
                  {TENOR_CHIPS.map((tenor) => (
                    <button
                      key={tenor}
                      type="button"
                      className={clsx(
                        'tenor-chip',
                        values.tenor === tenor && 'tenor-chip--selected'
                      )}
                      onClick={() => onTenorChange(tenor)}
                    >
                      {tenor}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group form-group--flex-1">
                <label className="form-label form-label--required">Maturity Date</label>
                <input
                  type="date"
                  className={clsx(
                    'form-input',
                    touched.maturityDate && errors.maturityDate && 'form-input--error'
                  )}
                  value={formatDateForInput(values.maturityDate)}
                  onChange={handleMaturityDateChange}
                />
                <span className="form-hint">Auto-calculated from tenor</span>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group form-group--flex-1">
                <label className="form-label">Days</label>
                <input
                  type="text"
                  className="form-input form-input--readonly"
                  value={`${values.days || 0} days`}
                  readOnly
                />
              </div>
              <div className="form-group form-group--flex-1">
                {/* Spacer */}
              </div>
            </div>
          </>
        )}

        {/* Notice Period */}
        {showNoticePeriod && (
          <div className="form-group">
            <label className="form-label form-label--required">Notice Period</label>
            <select
              className="form-select"
              value={values.noticePeriod || 32}
              onChange={handleNoticePeriodChange}
            >
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={32}>32 days</option>
            </select>
          </div>
        )}

        {/* Deposit Timeline Panel */}
        {values.principalAmount && values.principalAmount > 0 && showMaturityFields && (
          <div className="deposit-timeline-panel">
            <h4 className="deposit-timeline-panel__title">Deposit Timeline</h4>
            <div className="deposit-timeline-panel__content">
              <div className="deposit-timeline-panel__dates">
                <div className="deposit-timeline-panel__date">
                  <span className="deposit-timeline-panel__date-label">Value Date</span>
                  <span className="deposit-timeline-panel__date-value">{formatDate(values.valueDate)}</span>
                </div>
                <div className="deposit-timeline-panel__arrow">→</div>
                <div className="deposit-timeline-panel__date">
                  <span className="deposit-timeline-panel__date-label">Maturity</span>
                  <span className="deposit-timeline-panel__date-value">{formatDate(values.maturityDate)}</span>
                </div>
              </div>
              <div className="deposit-timeline-panel__bar">
                <div className="deposit-timeline-panel__bar-fill" />
              </div>
              <div className="deposit-timeline-panel__amounts">
                <div className="deposit-timeline-panel__amount">
                  <span className="deposit-timeline-panel__amount-label">
                    {values.direction === 'PLACEMENT' ? 'Place' : 'Receive'}
                  </span>
                  <span className="deposit-timeline-panel__amount-value deposit-timeline-panel__amount-value--outflow">
                    {formatCurrency(values.principalAmount || 0, values.currency || 'ZAR')}
                  </span>
                  <span className="deposit-timeline-panel__amount-note">(Principal)</span>
                </div>
                <div className="deposit-timeline-panel__amount">
                  <span className="deposit-timeline-panel__amount-label">
                    {values.direction === 'PLACEMENT' ? 'Receive' : 'Repay'}
                  </span>
                  <span className="deposit-timeline-panel__amount-value deposit-timeline-panel__amount-value--inflow">
                    {formatCurrency(maturityProceeds, values.currency || 'ZAR')}
                  </span>
                  <span className="deposit-timeline-panel__amount-note">(Principal + Interest)</span>
                </div>
              </div>
              <div className="deposit-timeline-panel__summary">
                <span>Term: {values.days || 0} days</span>
                <span>|</span>
                <span>Interest: {formatCurrency(interestAmount, values.currency || 'ZAR')}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepositDetailsTab;
