// ============================================
// components/trading/tickets/FXForwardTicket.tsx
// ============================================

import React, { useCallback, useMemo } from 'react';
import { DealTicketPopup } from '../DealTicketPopup';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useFormValidation } from '@/hooks/useFormValidation';
import { fxForwardTradeSchema, type FXForwardTradeFormData } from '@/lib/validations/tradeSchemas';
import { useDealTicketStore } from '@/stores/dealTicketStore';
import type { DealTicket, TradeSide } from '@/types/dealTicket';

interface FXForwardTicketProps {
  ticket: DealTicket;
}

const currencyPairOptions = [
  { value: 'EURUSD', label: 'EUR/USD' },
  { value: 'GBPUSD', label: 'GBP/USD' },
  { value: 'USDJPY', label: 'USD/JPY' },
  { value: 'USDCHF', label: 'USD/CHF' },
  { value: 'AUDUSD', label: 'AUD/USD' },
  { value: 'USDCAD', label: 'USD/CAD' },
];

const orderTypeOptions = [
  { value: 'market', label: 'Market' },
  { value: 'limit', label: 'Limit' },
];

const timeInForceOptions = [
  { value: 'day', label: 'Day' },
  { value: 'gtc', label: 'GTC' },
];

const accountOptions = [
  { value: 'FX-001', label: 'FX-001' },
  { value: 'FX-002', label: 'FX-002' },
  { value: 'HEDGE-FX', label: 'HEDGE-FX' },
];

const tenorOptions = [
  { value: '1W', label: '1 Week' },
  { value: '2W', label: '2 Weeks' },
  { value: '1M', label: '1 Month' },
  { value: '2M', label: '2 Months' },
  { value: '3M', label: '3 Months' },
  { value: '6M', label: '6 Months' },
  { value: '9M', label: '9 Months' },
  { value: '1Y', label: '1 Year' },
];

const calculateValueDate = (tenor: string): string => {
  const date = new Date();
  const match = tenor.match(/(\d+)([WMY])/);
  if (!match) return date.toISOString().slice(0, 10);

  const [, amount, unit] = match;
  const num = parseInt(amount || '0', 10);

  switch (unit) {
    case 'W':
      date.setDate(date.getDate() + num * 7);
      break;
    case 'M':
      date.setMonth(date.getMonth() + num);
      break;
    case 'Y':
      date.setFullYear(date.getFullYear() + num);
      break;
  }

  return date.toISOString().slice(0, 10);
};

const createInitialValues = (): Partial<FXForwardTradeFormData> => ({
  currencyPair: 'EURUSD',
  side: 'buy',
  quantity: undefined,
  orderType: 'market',
  timeInForce: 'day',
  valueDate: calculateValueDate('1M'),
  account: 'FX-001',
  forwardRate: undefined,
  spotRate: undefined,
  forwardPoints: undefined,
});

export const FXForwardTicket: React.FC<FXForwardTicketProps> = ({ ticket }) => {
  const closeTicket = useDealTicketStore((state) => state.closeTicket);

  const initialValues = useMemo(createInitialValues, []);

  const {
    values,
    errors,
    touched,
    isValid,
    setValue,
    setTouched,
    validate,
    validateField,
  } = useFormValidation<FXForwardTradeFormData>({
    schema: fxForwardTradeSchema,
    initialValues,
  });

  const handleSave = useCallback(() => {
    if (validate()) {
      console.log('Submitting FX forward order:', values);
      closeTicket(ticket.id);
    }
  }, [validate, values, closeTicket, ticket.id]);

  const handleCancel = useCallback(() => {
    closeTicket(ticket.id);
  }, [closeTicket, ticket.id]);

  const handleSideChange = (side: TradeSide) => {
    setValue('side', side);
  };

  const handleTenorChange = (tenor: string) => {
    setValue('valueDate', calculateValueDate(tenor));
  };

  const showRateField = values.orderType === 'limit';

  const formatCurrencyPair = (pair: string) => {
    if (pair.length >= 6) {
      return `${pair.slice(0, 3)}/${pair.slice(3, 6)}`;
    }
    return pair;
  };

  return (
    <DealTicketPopup
      ticket={ticket}
      title="FX Forward Order"
      onSave={handleSave}
      onCancel={handleCancel}
      saveDisabled={!isValid}
    >
      <div className="ticket-form">
        <div className="ticket-form__section">
          <FormField label="Currency Pair" htmlFor="currencyPair" required>
            <Select
              id="currencyPair"
              options={currencyPairOptions}
              value={values.currencyPair || ''}
              onChange={(val) => setValue('currencyPair', val)}
            />
          </FormField>

          <FormField label="Side" required>
            <div className="side-toggle">
              <button
                type="button"
                className={`side-toggle__btn side-toggle__btn--buy ${values.side === 'buy' ? 'side-toggle__btn--active' : ''}`}
                onClick={() => handleSideChange('buy')}
              >
                Buy
              </button>
              <button
                type="button"
                className={`side-toggle__btn side-toggle__btn--sell ${values.side === 'sell' ? 'side-toggle__btn--active' : ''}`}
                onClick={() => handleSideChange('sell')}
              >
                Sell
              </button>
            </div>
          </FormField>

          <FormField label="Amount" htmlFor="quantity" required error={touched.quantity ? errors.quantity?.message : undefined}>
            <Input
              id="quantity"
              type="number"
              placeholder="0.00"
              step="0.01"
              value={values.quantity?.toString() || ''}
              onChange={(val) => setValue('quantity', val ? parseFloat(val) : undefined as unknown as number)}
              onBlur={() => { setTouched('quantity'); validateField('quantity'); }}
              error={touched.quantity ? errors.quantity?.message : undefined}
            />
          </FormField>
        </div>

        <div className="ticket-form__section">
          <div className="ticket-form__section-title">Forward Details</div>

          <div className="ticket-form__row">
            <FormField label="Tenor" htmlFor="tenor">
              <Select
                id="tenor"
                options={tenorOptions}
                value=""
                placeholder="Select tenor"
                onChange={handleTenorChange}
              />
            </FormField>

            <FormField label="Value Date" htmlFor="valueDate" required error={touched.valueDate ? errors.valueDate?.message : undefined}>
              <Input
                id="valueDate"
                type="date"
                value={values.valueDate || ''}
                onChange={(val) => setValue('valueDate', val)}
                onBlur={() => { setTouched('valueDate'); validateField('valueDate'); }}
                error={touched.valueDate ? errors.valueDate?.message : undefined}
              />
            </FormField>
          </div>

          <div className="ticket-form__row">
            <FormField label="Order Type" htmlFor="orderType" required>
              <Select
                id="orderType"
                options={orderTypeOptions}
                value={values.orderType || 'market'}
                onChange={(val) => setValue('orderType', val as FXForwardTradeFormData['orderType'])}
              />
            </FormField>

            <FormField label="Time in Force" htmlFor="timeInForce" required>
              <Select
                id="timeInForce"
                options={timeInForceOptions}
                value={values.timeInForce || 'day'}
                onChange={(val) => setValue('timeInForce', val as FXForwardTradeFormData['timeInForce'])}
              />
            </FormField>
          </div>

          {showRateField && (
            <>
              <FormField label="Forward Rate" htmlFor="forwardRate" required error={touched.forwardRate ? errors.forwardRate?.message : undefined}>
                <Input
                  id="forwardRate"
                  type="number"
                  placeholder="0.00000"
                  step="0.00001"
                  value={values.forwardRate?.toString() || ''}
                  onChange={(val) => setValue('forwardRate', val ? parseFloat(val) : undefined)}
                  onBlur={() => { setTouched('forwardRate'); validateField('forwardRate'); }}
                  error={touched.forwardRate ? errors.forwardRate?.message : undefined}
                />
              </FormField>

              <div className="ticket-form__row">
                <FormField label="Spot Rate" htmlFor="spotRate" hint="Reference">
                  <Input
                    id="spotRate"
                    type="number"
                    placeholder="0.00000"
                    step="0.00001"
                    value={values.spotRate?.toString() || ''}
                    onChange={(val) => setValue('spotRate', val ? parseFloat(val) : undefined)}
                  />
                </FormField>

                <FormField label="Forward Points" htmlFor="forwardPoints" hint="Pips">
                  <Input
                    id="forwardPoints"
                    type="number"
                    placeholder="0.0"
                    step="0.1"
                    value={values.forwardPoints?.toString() || ''}
                    onChange={(val) => setValue('forwardPoints', val ? parseFloat(val) : undefined)}
                  />
                </FormField>
              </div>
            </>
          )}

          <FormField label="Account" htmlFor="account" required>
            <Select
              id="account"
              options={accountOptions}
              value={values.account || ''}
              onChange={(val) => setValue('account', val)}
            />
          </FormField>
        </div>

        {values.currencyPair && values.quantity && (
          <div className="order-summary">
            <div className="order-summary__row">
              <span className="order-summary__label">Action</span>
              <span className={`order-summary__value order-summary__value--${values.side}`}>
                {values.side?.toUpperCase()} {values.quantity?.toLocaleString()} {formatCurrencyPair(values.currencyPair)}
              </span>
            </div>
            <div className="order-summary__row">
              <span className="order-summary__label">Value Date</span>
              <span className="order-summary__value">{values.valueDate}</span>
            </div>
            {showRateField && values.forwardRate && (
              <div className="order-summary__row">
                <span className="order-summary__label">Forward Rate</span>
                <span className="order-summary__value">{values.forwardRate.toFixed(5)}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </DealTicketPopup>
  );
};

export default FXForwardTicket;
