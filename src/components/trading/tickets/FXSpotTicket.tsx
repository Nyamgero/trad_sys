// ============================================
// components/trading/tickets/FXSpotTicket.tsx
// ============================================

import React, { useCallback, useMemo } from 'react';
import { DealTicketPopup } from '../DealTicketPopup';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useFormValidation } from '@/hooks/useFormValidation';
import { fxSpotTradeSchema, type FXSpotTradeFormData } from '@/lib/validations/tradeSchemas';
import { useDealTicketStore } from '@/stores/dealTicketStore';
import type { DealTicket, TradeSide } from '@/types/dealTicket';

interface FXSpotTicketProps {
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
  { value: 'ioc', label: 'IOC' },
  { value: 'fok', label: 'FOK' },
];

const accountOptions = [
  { value: 'FX-001', label: 'FX-001' },
  { value: 'FX-002', label: 'FX-002' },
  { value: 'HEDGE-FX', label: 'HEDGE-FX' },
];

const getDefaultSettlementDate = (): string => {
  const date = new Date();
  date.setDate(date.getDate() + 2); // T+2 for spot
  return date.toISOString().slice(0, 10);
};

const createInitialValues = (): Partial<FXSpotTradeFormData> => ({
  currencyPair: 'EURUSD',
  side: 'buy',
  quantity: undefined,
  orderType: 'market',
  timeInForce: 'day',
  settlementDate: getDefaultSettlementDate(),
  account: 'FX-001',
  rate: undefined,
});

export const FXSpotTicket: React.FC<FXSpotTicketProps> = ({ ticket }) => {
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
  } = useFormValidation<FXSpotTradeFormData>({
    schema: fxSpotTradeSchema,
    initialValues,
  });

  const handleSave = useCallback(() => {
    if (validate()) {
      console.log('Submitting FX spot order:', values);
      closeTicket(ticket.id);
    }
  }, [validate, values, closeTicket, ticket.id]);

  const handleCancel = useCallback(() => {
    closeTicket(ticket.id);
  }, [closeTicket, ticket.id]);

  const handleSideChange = (side: TradeSide) => {
    setValue('side', side);
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
      title="FX Spot Order"
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
          <div className="ticket-form__section-title">Order Details</div>

          <div className="ticket-form__row">
            <FormField label="Order Type" htmlFor="orderType" required>
              <Select
                id="orderType"
                options={orderTypeOptions}
                value={values.orderType || 'market'}
                onChange={(val) => setValue('orderType', val as FXSpotTradeFormData['orderType'])}
              />
            </FormField>

            <FormField label="Time in Force" htmlFor="timeInForce" required>
              <Select
                id="timeInForce"
                options={timeInForceOptions}
                value={values.timeInForce || 'day'}
                onChange={(val) => setValue('timeInForce', val as FXSpotTradeFormData['timeInForce'])}
              />
            </FormField>
          </div>

          {showRateField && (
            <FormField label="Rate" htmlFor="rate" required error={touched.rate ? errors.rate?.message : undefined}>
              <Input
                id="rate"
                type="number"
                placeholder="0.00000"
                step="0.00001"
                value={values.rate?.toString() || ''}
                onChange={(val) => setValue('rate', val ? parseFloat(val) : undefined)}
                onBlur={() => { setTouched('rate'); validateField('rate'); }}
                error={touched.rate ? errors.rate?.message : undefined}
              />
            </FormField>
          )}

          <FormField label="Settlement Date" htmlFor="settlementDate" required error={touched.settlementDate ? errors.settlementDate?.message : undefined}>
            <Input
              id="settlementDate"
              type="date"
              value={values.settlementDate || ''}
              onChange={(val) => setValue('settlementDate', val)}
              onBlur={() => { setTouched('settlementDate'); validateField('settlementDate'); }}
              error={touched.settlementDate ? errors.settlementDate?.message : undefined}
            />
          </FormField>

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
              <span className="order-summary__label">Settlement</span>
              <span className="order-summary__value">{values.settlementDate}</span>
            </div>
            {showRateField && values.rate && (
              <div className="order-summary__row">
                <span className="order-summary__label">Rate</span>
                <span className="order-summary__value">{values.rate.toFixed(5)}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </DealTicketPopup>
  );
};

export default FXSpotTicket;
