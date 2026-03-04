// ============================================
// NewBondTradeWindow/tabs/TransactionDetailsTab.tsx
// ============================================

import React, { useCallback } from 'react';
import clsx from 'clsx';
import { mockExecutionVenues } from '@/mocks/bondReferenceData';
import { formatCurrency } from '@/lib/formatters';
import type { BondTradeFormState, BondDirection, BondCapacity, SpecialCondition } from '../types';

interface TransactionDetailsTabProps {
  values: Partial<BondTradeFormState>;
  errors: Partial<Record<keyof BondTradeFormState, { message: string }>>;
  touched: Partial<Record<keyof BondTradeFormState, boolean>>;
  setValue: <K extends keyof BondTradeFormState>(field: K, value: BondTradeFormState[K]) => void;
  setTouched: (field: keyof BondTradeFormState) => void;
  validateField: (field: keyof BondTradeFormState) => void;
  onDirectionChange: (direction: BondDirection) => void;
  principalValue: number;
}

export const TransactionDetailsTab: React.FC<TransactionDetailsTabProps> = ({
  values,
  errors,
  touched,
  setValue,
  setTouched,
  onDirectionChange,
  principalValue,
}) => {
  const handleDirectionClick = useCallback(
    (direction: BondDirection) => {
      onDirectionChange(direction);
      setTouched('direction');
    },
    [onDirectionChange, setTouched]
  );

  const handleFaceValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[^0-9]/g, '');
      const numValue = value ? parseInt(value, 10) : null;
      setValue('faceValue', numValue);
    },
    [setValue]
  );

  const handleFaceValueBlur = useCallback(() => {
    setTouched('faceValue');
  }, [setTouched]);

  const handleVenueChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setValue('executionVenue', e.target.value);
      setTouched('executionVenue');
    },
    [setValue, setTouched]
  );

  const handleCapacityChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setValue('capacity', e.target.value as BondCapacity);
      setTouched('capacity');
    },
    [setValue, setTouched]
  );

  const handleConditionToggle = useCallback(
    (condition: SpecialCondition) => {
      const current = values.specialConditions || [];
      const updated = current.includes(condition)
        ? current.filter((c) => c !== condition)
        : [...current, condition];
      setValue('specialConditions', updated);
    },
    [values.specialConditions, setValue]
  );

  const formatFaceValue = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '';
    return value.toLocaleString();
  };

  return (
    <div className="bond-tab bond-tab--transaction">
      <div className="bond-tab__section">
        <h3 className="bond-tab__section-title">Transaction Details</h3>

        {/* Direction Selection */}
        <div className="form-group">
          <label className="form-label form-label--required">Direction</label>
          <div className="direction-buttons">
            <button
              type="button"
              className={clsx(
                'direction-button direction-button--buy',
                values.direction === 'BUY' && 'direction-button--selected'
              )}
              onClick={() => handleDirectionClick('BUY')}
            >
              <span className="direction-button__label">BUY</span>
              <span className="direction-button__desc">Purchase bonds</span>
            </button>
            <button
              type="button"
              className={clsx(
                'direction-button direction-button--sell',
                values.direction === 'SELL' && 'direction-button--selected'
              )}
              onClick={() => handleDirectionClick('SELL')}
            >
              <span className="direction-button__label">SELL</span>
              <span className="direction-button__desc">Dispose bonds</span>
            </button>
          </div>
        </div>

        {/* Face Value */}
        <div className="form-row">
          <div className="form-group form-group--flex-2">
            <label className="form-label form-label--required">
              Face Value / Par Amount
            </label>
            <div className="input-with-currency">
              <span className="input-currency">{values.currency || 'USD'}</span>
              <input
                type="text"
                className={clsx(
                  'form-input',
                  touched.faceValue && errors.faceValue && 'form-input--error'
                )}
                value={formatFaceValue(values.faceValue)}
                onChange={handleFaceValueChange}
                onBlur={handleFaceValueBlur}
                placeholder="1,000,000"
              />
            </div>
            {touched.faceValue && errors.faceValue && (
              <span className="form-error">{errors.faceValue.message}</span>
            )}
            <span className="form-hint">Principal amount in currency units</span>
          </div>

          <div className="form-group form-group--flex-1">
            <label className="form-label">Minimum Lot</label>
            <input
              type="text"
              className="form-input form-input--readonly"
              value={`${values.currency || 'USD'} ${(values.bondDetails?.minimumLotSize || 1000).toLocaleString()}`}
              readOnly
              disabled
            />
          </div>
        </div>

        <div className="form-divider" />

        {/* Execution Venue & Capacity */}
        <div className="form-row">
          <div className="form-group form-group--flex-1">
            <label className="form-label form-label--required">Execution Venue</label>
            <select
              className="form-select"
              value={values.executionVenue || 'TRACE'}
              onChange={handleVenueChange}
            >
              {mockExecutionVenues.map((venue) => (
                <option key={venue.id} value={venue.id}>
                  {venue.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group form-group--flex-1">
            <label className="form-label form-label--required">Capacity</label>
            <select
              className="form-select"
              value={values.capacity || 'PRINCIPAL'}
              onChange={handleCapacityChange}
            >
              <option value="PRINCIPAL">PRINCIPAL</option>
              <option value="AGENCY">AGENCY</option>
            </select>
          </div>
        </div>

        {/* Special Conditions */}
        <div className="form-group">
          <label className="form-label">Special Conditions</label>
          <div className="checkbox-group">
            {(['PORTFOLIO_TRADE', 'WHEN_ISSUED', 'ODD_LOT', 'BLOCK'] as SpecialCondition[]).map(
              (condition) => (
                <label key={condition} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={(values.specialConditions || []).includes(condition)}
                    onChange={() => handleConditionToggle(condition)}
                  />
                  <span className="checkbox-label">
                    {condition.replace('_', ' ')}
                  </span>
                </label>
              )
            )}
          </div>
        </div>

        {/* Position Impact Panel */}
        {values.faceValue && values.faceValue > 0 && (
          <div className="position-impact-panel">
            <h4 className="position-impact-panel__title">Position Impact</h4>
            <div className="position-impact-panel__grid">
              <div className="position-impact-panel__row">
                <span className="position-impact-panel__label">Current Position</span>
                <span className="position-impact-panel__value">
                  {formatCurrency(0, values.currency || 'USD')} face value
                </span>
              </div>
              <div className="position-impact-panel__row">
                <span className="position-impact-panel__label">This Trade</span>
                <span
                  className={clsx(
                    'position-impact-panel__value',
                    values.direction === 'BUY'
                      ? 'position-impact-panel__value--positive'
                      : 'position-impact-panel__value--negative'
                  )}
                >
                  {values.direction === 'BUY' ? '+' : '-'}
                  {formatCurrency(values.faceValue || 0, values.currency || 'USD')} ({values.direction})
                </span>
              </div>
              <div className="position-impact-panel__divider" />
              <div className="position-impact-panel__row position-impact-panel__row--total">
                <span className="position-impact-panel__label">Resulting Position</span>
                <span className="position-impact-panel__value">
                  {formatCurrency(
                    values.direction === 'BUY' ? (values.faceValue || 0) : 0,
                    values.currency || 'USD'
                  )} face value
                </span>
              </div>
            </div>
            {principalValue > 0 && (
              <div className="position-impact-panel__footer">
                <span>
                  Principal Value: {formatCurrency(principalValue, values.currency || 'USD')}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionDetailsTab;
