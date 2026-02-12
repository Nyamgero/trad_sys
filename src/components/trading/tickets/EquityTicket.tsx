// ============================================
// components/trading/tickets/EquityTicket.tsx
// ============================================

import React, { useCallback } from 'react';
import { DealTicketPopup } from '../DealTicketPopup';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useFormValidation } from '@/hooks/useFormValidation';
import { equityTradeSchema, type EquityTradeFormData } from '@/lib/validations/tradeSchemas';
import { useDealTicketStore } from '@/stores/dealTicketStore';
import type { DealTicket, TradeSide } from '@/types/dealTicket';

interface EquityTicketProps {
  ticket: DealTicket;
}

const orderTypeOptions = [
  { value: 'market', label: 'Market' },
  { value: 'limit', label: 'Limit' },
  { value: 'stop', label: 'Stop' },
  { value: 'stop-limit', label: 'Stop Limit' },
];

const timeInForceOptions = [
  { value: 'day', label: 'Day' },
  { value: 'gtc', label: 'GTC' },
  { value: 'ioc', label: 'IOC' },
  { value: 'fok', label: 'FOK' },
];

const accountOptions = [
  { value: 'MAIN-001', label: 'MAIN-001' },
  { value: 'MAIN-002', label: 'MAIN-002' },
  { value: 'HEDGE-001', label: 'HEDGE-001' },
];

const initialValues: Partial<EquityTradeFormData> = {
  symbol: '',
  side: 'buy',
  quantity: undefined,
  orderType: 'market',
  timeInForce: 'day',
  account: 'MAIN-001',
  price: undefined,
  stopPrice: undefined,
};

export const EquityTicket: React.FC<EquityTicketProps> = ({ ticket }) => {
  const closeTicket = useDealTicketStore((state) => state.closeTicket);

  const {
    values,
    errors,
    touched,
    isValid,
    setValue,
    setTouched,
    validate,
    validateField,
  } = useFormValidation<EquityTradeFormData>({
    schema: equityTradeSchema,
    initialValues,
  });

  const handleSave = useCallback(() => {
    if (validate()) {
      console.log('Submitting equity order:', values);
      closeTicket(ticket.id);
    }
  }, [validate, values, closeTicket, ticket.id]);

  const handleCancel = useCallback(() => {
    closeTicket(ticket.id);
  }, [closeTicket, ticket.id]);

  const handleSideChange = (side: TradeSide) => {
    setValue('side', side);
  };

  const showPriceField = values.orderType === 'limit' || values.orderType === 'stop-limit';
  const showStopPriceField = values.orderType === 'stop' || values.orderType === 'stop-limit';

  return (
    <DealTicketPopup
      ticket={ticket}
      title="Equity Order"
      onSave={handleSave}
      onCancel={handleCancel}
      saveDisabled={!isValid}
    >
      <div className="ticket-form">
        <div className="ticket-form__section">
          <FormField label="Symbol" htmlFor="symbol" required error={touched.symbol ? errors.symbol?.message : undefined}>
            <Input
              id="symbol"
              placeholder="e.g., AAPL"
              value={values.symbol || ''}
              onChange={(val) => setValue('symbol', val.toUpperCase())}
              onBlur={() => { setTouched('symbol'); validateField('symbol'); }}
              error={touched.symbol ? errors.symbol?.message : undefined}
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

          <FormField label="Quantity" htmlFor="quantity" required error={touched.quantity ? errors.quantity?.message : undefined}>
            <Input
              id="quantity"
              type="number"
              placeholder="0"
              value={values.quantity?.toString() || ''}
              onChange={(val) => setValue('quantity', val ? parseInt(val, 10) : undefined as unknown as number)}
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
                onChange={(val) => setValue('orderType', val as EquityTradeFormData['orderType'])}
              />
            </FormField>

            <FormField label="Time in Force" htmlFor="timeInForce" required>
              <Select
                id="timeInForce"
                options={timeInForceOptions}
                value={values.timeInForce || 'day'}
                onChange={(val) => setValue('timeInForce', val as EquityTradeFormData['timeInForce'])}
              />
            </FormField>
          </div>

          {showPriceField && (
            <FormField label="Limit Price" htmlFor="price" required error={touched.price ? errors.price?.message : undefined}>
              <Input
                id="price"
                type="number"
                placeholder="0.00"
                step="0.01"
                value={values.price?.toString() || ''}
                onChange={(val) => setValue('price', val ? parseFloat(val) : undefined)}
                onBlur={() => { setTouched('price'); validateField('price'); }}
                error={touched.price ? errors.price?.message : undefined}
              />
            </FormField>
          )}

          {showStopPriceField && (
            <FormField label="Stop Price" htmlFor="stopPrice" required error={touched.stopPrice ? errors.stopPrice?.message : undefined}>
              <Input
                id="stopPrice"
                type="number"
                placeholder="0.00"
                step="0.01"
                value={values.stopPrice?.toString() || ''}
                onChange={(val) => setValue('stopPrice', val ? parseFloat(val) : undefined)}
                onBlur={() => { setTouched('stopPrice'); validateField('stopPrice'); }}
                error={touched.stopPrice ? errors.stopPrice?.message : undefined}
              />
            </FormField>
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

        {values.symbol && values.quantity && (
          <div className="order-summary">
            <div className="order-summary__row">
              <span className="order-summary__label">Action</span>
              <span className={`order-summary__value order-summary__value--${values.side}`}>
                {values.side?.toUpperCase()} {values.quantity} {values.symbol}
              </span>
            </div>
            <div className="order-summary__row">
              <span className="order-summary__label">Order Type</span>
              <span className="order-summary__value">{values.orderType?.toUpperCase()}</span>
            </div>
            {showPriceField && values.price && (
              <div className="order-summary__row">
                <span className="order-summary__label">Limit Price</span>
                <span className="order-summary__value">${values.price.toFixed(2)}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </DealTicketPopup>
  );
};

export default EquityTicket;
