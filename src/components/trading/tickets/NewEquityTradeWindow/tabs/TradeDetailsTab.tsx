// ============================================
// NewEquityTradeWindow/tabs/TradeDetailsTab.tsx
// ============================================

import React from 'react';
import clsx from 'clsx';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { formatCurrency, formatNumber } from '@/lib/formatters';
import type { TradeFormState, TradeSide, OrderType, Capacity } from '../types';
import type { FormErrors } from '@/hooks/useFormValidation';

interface TradeDetailsTabProps {
  values: Partial<TradeFormState>;
  errors: FormErrors<TradeFormState>;
  touched: Partial<Record<keyof TradeFormState, boolean>>;
  setValue: <K extends keyof TradeFormState>(field: K, value: TradeFormState[K]) => void;
  setTouched: (field: keyof TradeFormState) => void;
  validateField: (field: keyof TradeFormState) => void;
  onSideChange: (side: TradeSide) => void;
  grossConsideration: number;
  currency?: string;
}

const orderTypeOptions = [
  { value: 'MARKET', label: 'Market' },
  { value: 'LIMIT', label: 'Limit' },
  { value: 'VWAP', label: 'VWAP' },
  { value: 'BLOCK', label: 'Block' },
  { value: 'STOP', label: 'Stop' },
];

const capacityOptions = [
  { value: 'AGENCY', label: 'Agency' },
  { value: 'PRINCIPAL', label: 'Principal' },
  { value: 'RISKLESS_PRINCIPAL', label: 'Riskless Principal' },
];

const sides: { value: TradeSide; label: string; className: string }[] = [
  { value: 'BUY', label: 'Buy', className: 'side-toggle__btn--buy' },
  { value: 'SELL', label: 'Sell', className: 'side-toggle__btn--sell' },
  { value: 'SHORT_SELL', label: 'Short Sell', className: 'side-toggle__btn--short' },
  { value: 'BUY_TO_COVER', label: 'Buy to Cover', className: 'side-toggle__btn--cover' },
];

export const TradeDetailsTab: React.FC<TradeDetailsTabProps> = ({
  values,
  errors,
  touched,
  setValue,
  setTouched,
  validateField,
  onSideChange,
  grossConsideration,
}) => {
  const formatTradeDate = (date: Date | undefined): string => {
    if (!date) return '';
    return date.toISOString().split('T')[0] ?? '';
  };

  const parseTradeDate = (dateStr: string): Date => {
    return new Date(dateStr);
  };

  return (
    <div className="new-equity-trade__tab-content">
      <div className="new-equity-trade__section">
        <div className="new-equity-trade__section-title">Trade Execution Details</div>

        <FormField label="Side" required>
          <div className="side-toggle side-toggle--4">
            {sides.map((side) => (
              <button
                key={side.value}
                type="button"
                className={clsx(
                  'side-toggle__btn',
                  side.className,
                  values.side === side.value && 'side-toggle__btn--active'
                )}
                onClick={() => onSideChange(side.value)}
              >
                {side.label}
              </button>
            ))}
          </div>
        </FormField>

        <div className="new-equity-trade__form-row" style={{ marginTop: 16 }}>
          <FormField
            label="Quantity"
            htmlFor="quantity"
            required
            error={touched.quantity ? errors.quantity?.message : undefined}
          >
            <Input
              id="quantity"
              type="number"
              value={values.quantity?.toString() || ''}
              onChange={(val) => setValue('quantity', val ? parseInt(val, 10) : null)}
              onBlur={() => {
                setTouched('quantity');
                validateField('quantity');
              }}
              placeholder="0"
              error={touched.quantity ? errors.quantity?.message : undefined}
            />
          </FormField>

          <FormField
            label="Execution Price"
            htmlFor="executionPrice"
            required
            error={touched.executionPrice ? errors.executionPrice?.message : undefined}
          >
            <div className="input-with-suffix">
              <Input
                id="executionPrice"
                type="number"
                step="0.01"
                value={values.executionPrice?.toString() || ''}
                onChange={(val) => setValue('executionPrice', val ? parseFloat(val) : null)}
                onBlur={() => {
                  setTouched('executionPrice');
                  validateField('executionPrice');
                }}
                placeholder="0.00"
                error={touched.executionPrice ? errors.executionPrice?.message : undefined}
              />
              <span className="input-with-suffix__suffix">{values.currency || 'ZAR'}</span>
            </div>
            <div className="field-hint">Tick size: 0.01</div>
          </FormField>
        </div>

        <div className="new-equity-trade__form-row">
          <FormField
            label="Order Type"
            htmlFor="orderType"
          >
            <Select
              id="orderType"
              options={orderTypeOptions}
              value={values.orderType || 'LIMIT'}
              onChange={(val) => setValue('orderType', val as OrderType)}
            />
          </FormField>

          <FormField
            label="Capacity"
            htmlFor="capacity"
            required
          >
            <Select
              id="capacity"
              options={capacityOptions}
              value={values.capacity || 'AGENCY'}
              onChange={(val) => setValue('capacity', val as Capacity)}
            />
          </FormField>
        </div>

        <div className="new-equity-trade__form-row">
          <FormField
            label="Order ID (OMS Reference)"
            htmlFor="orderId"
          >
            <Input
              id="orderId"
              value={values.orderId || ''}
              onChange={(val) => setValue('orderId', val)}
              placeholder="e.g., ORD-2024-001234"
            />
          </FormField>

          <FormField
            label="Trade Date"
            htmlFor="tradeDate"
            required
            error={touched.tradeDate ? errors.tradeDate?.message : undefined}
          >
            <Input
              id="tradeDate"
              type="date"
              value={formatTradeDate(values.tradeDate)}
              onChange={(val) => setValue('tradeDate', parseTradeDate(val))}
              onBlur={() => {
                setTouched('tradeDate');
                validateField('tradeDate');
              }}
              max={new Date().toISOString().split('T')[0]}
              error={touched.tradeDate ? errors.tradeDate?.message : undefined}
            />
            <div className="field-hint">Valid trading day</div>
          </FormField>
        </div>

        <div className="gross-consideration">
          <div className="gross-consideration__label">
            <span>&#128176;</span>
            <span>GROSS CONSIDERATION</span>
          </div>
          <div className="gross-consideration__value">
            {formatCurrency(grossConsideration, values.currency || 'ZAR')}
          </div>
          {values.quantity && values.executionPrice && (
            <div className="gross-consideration__calculation">
              ({formatNumber(values.quantity)} x {formatNumber(values.executionPrice)})
            </div>
          )}
        </div>

        {values.side === 'SHORT_SELL' && (
          <label className="form-checkbox" style={{ marginTop: 16 }}>
            <input
              type="checkbox"
              className="form-checkbox__input"
              checked={values.shortSellFlag || false}
              onChange={(e) => setValue('shortSellFlag', e.target.checked)}
            />
            <span className="form-checkbox__label">
              Short Sell Flag (Auto-checked for Short Sell orders)
            </span>
          </label>
        )}
      </div>
    </div>
  );
};

export default TradeDetailsTab;
