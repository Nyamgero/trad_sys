// ============================================
// NewBondTradeWindow/tabs/SettlementCostsTab.tsx
// ============================================

import React, { useCallback } from 'react';
import clsx from 'clsx';
import { formatCurrency } from '@/lib/formatters';
import type { BondTradeFormState, SettlementConvention, BondTradeStatus } from '../types';

interface SettlementCostsTabProps {
  values: Partial<BondTradeFormState>;
  errors: Partial<Record<keyof BondTradeFormState, { message: string }>>;
  touched: Partial<Record<keyof BondTradeFormState, boolean>>;
  setValue: <K extends keyof BondTradeFormState>(field: K, value: BondTradeFormState[K]) => void;
  setTouched: (field: keyof BondTradeFormState) => void;
  validateField: (field: keyof BondTradeFormState) => void;
  principalValue: number;
  accruedInterest: number;
  dirtyValue: number;
  netSettlement: number;
}

export const SettlementCostsTab: React.FC<SettlementCostsTabProps> = ({
  values,
  errors,
  touched,
  setValue,
  setTouched,
  principalValue,
  accruedInterest,
  dirtyValue,
  netSettlement,
}) => {
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

  const handleTradeTimeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue('tradeTime', e.target.value);
    },
    [setValue]
  );

  const handleSettlementDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const date = new Date(e.target.value);
      if (!isNaN(date.getTime())) {
        setValue('settlementDate', date);
        setTouched('settlementDate');
      }
    },
    [setValue, setTouched]
  );

  const handleConventionChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setValue('settlementConvention', e.target.value as SettlementConvention);
      setTouched('settlementConvention');
    },
    [setValue, setTouched]
  );

  const handleCommissionChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[^0-9.]/g, '');
      const numValue = value ? parseFloat(value) : null;
      setValue('commissionFees', numValue);
    },
    [setValue]
  );

  const handleTaxesChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[^0-9.]/g, '');
      const numValue = value ? parseFloat(value) : null;
      setValue('taxesWithholding', numValue);
    },
    [setValue]
  );

  const handleStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setValue('tradeStatus', e.target.value as BondTradeStatus);
      setTouched('tradeStatus');
    },
    [setValue, setTouched]
  );

  const handleNotesChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue('notes', e.target.value);
    },
    [setValue]
  );

  const handleNotesBlur = useCallback(() => {
    setTouched('notes');
  }, [setTouched]);

  const formatDateForInput = (date: Date | undefined) => {
    if (!date) return '';
    return date.toISOString().split('T')[0] ?? '';
  };

  const currency = values.currency || 'USD';
  const commission = values.commissionFees ?? 0;
  const taxes = values.taxesWithholding ?? 0;

  return (
    <div className="bond-tab bond-tab--settlement">
      <div className="bond-tab__section">
        <h3 className="bond-tab__section-title">Settlement & Costs</h3>

        {/* Trade Date & Time */}
        <div className="form-row">
          <div className="form-group form-group--flex-1">
            <label className="form-label form-label--required">Trade Date</label>
            <input
              type="date"
              className={clsx(
                'form-input',
                touched.tradeDate && errors.tradeDate && 'form-input--error'
              )}
              value={formatDateForInput(values.tradeDate)}
              onChange={handleTradeDateChange}
            />
            {touched.tradeDate && errors.tradeDate && (
              <span className="form-error">{errors.tradeDate.message}</span>
            )}
            <span className="form-hint">Execution date</span>
          </div>

          <div className="form-group form-group--flex-1">
            <label className="form-label">Trade Time</label>
            <input
              type="time"
              step="1"
              className="form-input"
              value={values.tradeTime || ''}
              onChange={handleTradeTimeChange}
            />
            <span className="form-hint">For high-volume compliance</span>
          </div>
        </div>

        {/* Settlement Date & Convention */}
        <div className="form-row">
          <div className="form-group form-group--flex-1">
            <label className="form-label form-label--required">Settlement Date</label>
            <input
              type="date"
              className={clsx(
                'form-input',
                touched.settlementDate && errors.settlementDate && 'form-input--error'
              )}
              value={formatDateForInput(values.settlementDate)}
              onChange={handleSettlementDateChange}
            />
            {touched.settlementDate && errors.settlementDate && (
              <span className="form-error">{errors.settlementDate.message}</span>
            )}
            <span className="form-hint">Auto-calculated (business days)</span>
          </div>

          <div className="form-group form-group--flex-1">
            <label className="form-label">Settlement Convention</label>
            <select
              className="form-select"
              value={values.settlementConvention || 'T+2'}
              onChange={handleConventionChange}
            >
              <option value="T+0">T+0</option>
              <option value="T+1">T+1 (Treasuries)</option>
              <option value="T+2">T+2 (Standard)</option>
              <option value="T+3">T+3</option>
            </select>
          </div>
        </div>

        <div className="form-divider" />

        {/* Settlement Calculation Panel */}
        <div className="settlement-calc-panel">
          <h4 className="settlement-calc-panel__title">Costs & Settlement Calculation</h4>
          <div className="settlement-calc-panel__breakdown">
            <div className="settlement-calc-panel__section">
              <div className="settlement-calc-panel__header">PRINCIPAL AMOUNT</div>
              <div className="settlement-calc-panel__row">
                <span>Face Value</span>
                <span>{formatCurrency(values.faceValue || 0, currency)}</span>
              </div>
              <div className="settlement-calc-panel__row">
                <span>x Clean Price ({values.cleanPrice?.toFixed(2) || '--'}%)</span>
                <span>x {((values.cleanPrice || 0) / 100).toFixed(4)}</span>
              </div>
              <div className="settlement-calc-panel__row settlement-calc-panel__row--subtotal">
                <span>Principal Value</span>
                <span>{formatCurrency(principalValue, currency)}</span>
              </div>
            </div>

            <div className="settlement-calc-panel__section">
              <div className="settlement-calc-panel__header">ACCRUED INTEREST</div>
              <div className="settlement-calc-panel__row">
                <span>+ Accrued Interest</span>
                <span>+{formatCurrency(accruedInterest, currency)}</span>
              </div>
              <div className="settlement-calc-panel__row settlement-calc-panel__row--subtotal">
                <span>Dirty Value</span>
                <span>{formatCurrency(dirtyValue, currency)}</span>
              </div>
            </div>

            <div className="settlement-calc-panel__section">
              <div className="settlement-calc-panel__header">COSTS & ADJUSTMENTS</div>
              <div className="settlement-calc-panel__row">
                <span>+ Commission/Fees</span>
                <span>+{formatCurrency(commission, currency)}</span>
              </div>
              <div className="settlement-calc-panel__row">
                <span>+ Taxes/Withholding</span>
                <span>+{formatCurrency(taxes, currency)}</span>
              </div>
            </div>

            <div className="settlement-calc-panel__total">
              <span>NET SETTLEMENT AMOUNT</span>
              <span className="settlement-calc-panel__total-value">
                {formatCurrency(netSettlement, currency)}
              </span>
              <span className="settlement-calc-panel__total-note">
                (Amount due {values.direction === 'BUY' ? 'from buyer' : 'to seller'})
              </span>
            </div>
          </div>
        </div>

        {/* Commission & Taxes */}
        <div className="form-row">
          <div className="form-group form-group--flex-1">
            <label className="form-label">Commission / Fees</label>
            <input
              type="text"
              className="form-input"
              value={values.commissionFees !== null ? values.commissionFees : ''}
              onChange={handleCommissionChange}
              placeholder="0.00"
            />
            <span className="form-hint">Broker/dealer fees</span>
          </div>

          <div className="form-group form-group--flex-1">
            <label className="form-label">Taxes / Withholding</label>
            <input
              type="text"
              className="form-input"
              value={values.taxesWithholding !== null ? values.taxesWithholding : ''}
              onChange={handleTaxesChange}
              placeholder="0.00"
            />
            <span className="form-hint">Stamp duty, etc.</span>
          </div>
        </div>

        {/* FX Rate (if applicable) */}
        <div className="form-row">
          <div className="form-group form-group--flex-1">
            <label className="form-label">FX Rate (if applicable)</label>
            <input
              type="text"
              className="form-input form-input--readonly"
              value={values.fxRate || 'N/A (USD = Fund Base)'}
              readOnly
              disabled
            />
          </div>

          <div className="form-group form-group--flex-1">
            <label className="form-label">Base Currency Equivalent</label>
            <input
              type="text"
              className="form-input form-input--readonly"
              value={formatCurrency(netSettlement, currency)}
              readOnly
            />
          </div>
        </div>

        <div className="form-divider" />

        {/* Trade Status */}
        <div className="form-group">
          <label className="form-label form-label--required">Trade Status</label>
          <select
            className="form-select"
            value={values.tradeStatus || 'pending'}
            onChange={handleStatusChange}
          >
            <option value="pending">PENDING</option>
            <option value="confirmed">CONFIRMED</option>
            <option value="settled">SETTLED</option>
            <option value="cancelled">CANCELLED</option>
          </select>
        </div>

        {/* Notes */}
        <div className="form-group">
          <label className="form-label">Notes / Comments</label>
          <textarea
            className={clsx(
              'form-textarea',
              touched.notes && errors.notes && 'form-textarea--error'
            )}
            rows={4}
            value={values.notes || ''}
            onChange={handleNotesChange}
            onBlur={handleNotesBlur}
            placeholder="Enter trade notes, strategy context, etc."
            maxLength={1000}
          />
          {touched.notes && errors.notes && (
            <span className="form-error">{errors.notes.message}</span>
          )}
          <span className="form-hint">Max 1000 characters ({(values.notes || '').length}/1000)</span>
        </div>
      </div>
    </div>
  );
};

export default SettlementCostsTab;
