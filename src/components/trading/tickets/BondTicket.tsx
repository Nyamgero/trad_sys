// ============================================
// components/trading/tickets/BondTicket.tsx
// ============================================

import React, { useCallback, useMemo } from 'react';
import { DealTicketPopup } from '../DealTicketPopup';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useFormValidation } from '@/hooks/useFormValidation';
import { bondTradeSchema, type BondTradeFormData } from '@/lib/validations/tradeSchemas';
import { useDealTicketStore } from '@/stores/dealTicketStore';
import type { DealTicket, TradeSide } from '@/types/dealTicket';

interface BondTicketProps {
  ticket: DealTicket;
}

const orderTypeOptions = [
  { value: 'market', label: 'Market' },
  { value: 'limit', label: 'Limit' },
];

const timeInForceOptions = [
  { value: 'day', label: 'Day' },
  { value: 'gtc', label: 'GTC' },
  { value: 'ioc', label: 'IOC' },
];

const accountOptions = [
  { value: 'FI-001', label: 'FI-001' },
  { value: 'FI-002', label: 'FI-002' },
  { value: 'HEDGE-FI', label: 'HEDGE-FI' },
];

const getDefaultSettlementDate = (): string => {
  const date = new Date();
  date.setDate(date.getDate() + 2); // T+2
  return date.toISOString().slice(0, 10);
};

const createInitialValues = (): Partial<BondTradeFormData> => ({
  isin: '',
  cusip: '',
  side: 'buy',
  quantity: undefined,
  orderType: 'market',
  timeInForce: 'day',
  settlementDate: getDefaultSettlementDate(),
  account: 'FI-001',
  price: undefined,
  yield: undefined,
});

export const BondTicket: React.FC<BondTicketProps> = ({ ticket }) => {
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
  } = useFormValidation<BondTradeFormData>({
    schema: bondTradeSchema,
    initialValues,
  });

  const handleSave = useCallback(() => {
    if (validate()) {
      console.log('Submitting bond order:', values);
      closeTicket(ticket.id);
    }
  }, [validate, values, closeTicket, ticket.id]);

  const handleCancel = useCallback(() => {
    closeTicket(ticket.id);
  }, [closeTicket, ticket.id]);

  const handleSideChange = (side: TradeSide) => {
    setValue('side', side);
  };

  const showPriceField = values.orderType === 'limit';

  return (
    <DealTicketPopup
      ticket={ticket}
      title="Bond Order"
      onSave={handleSave}
      onCancel={handleCancel}
      saveDisabled={!isValid}
    >
      <div className="ticket-form">
        <div className="ticket-form__section">
          <FormField label="ISIN" htmlFor="isin" required error={touched.isin ? errors.isin?.message : undefined}>
            <Input
              id="isin"
              placeholder="e.g., US912828ZQ33"
              value={values.isin || ''}
              onChange={(val) => setValue('isin', val.toUpperCase())}
              onBlur={() => { setTouched('isin'); validateField('isin'); }}
              error={touched.isin ? errors.isin?.message : undefined}
            />
          </FormField>

          <FormField label="CUSIP" htmlFor="cusip" hint="Optional">
            <Input
              id="cusip"
              placeholder="e.g., 912828ZQ3"
              value={values.cusip || ''}
              onChange={(val) => setValue('cusip', val.toUpperCase())}
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

          <FormField label="Face Value" htmlFor="quantity" required error={touched.quantity ? errors.quantity?.message : undefined}>
            <Input
              id="quantity"
              type="number"
              placeholder="0"
              step="1000"
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
                onChange={(val) => setValue('orderType', val as BondTradeFormData['orderType'])}
              />
            </FormField>

            <FormField label="Time in Force" htmlFor="timeInForce" required>
              <Select
                id="timeInForce"
                options={timeInForceOptions}
                value={values.timeInForce || 'day'}
                onChange={(val) => setValue('timeInForce', val as BondTradeFormData['timeInForce'])}
              />
            </FormField>
          </div>

          {showPriceField && (
            <div className="ticket-form__row">
              <FormField label="Price" htmlFor="price" required error={touched.price ? errors.price?.message : undefined}>
                <Input
                  id="price"
                  type="number"
                  placeholder="100.000"
                  step="0.001"
                  value={values.price?.toString() || ''}
                  onChange={(val) => setValue('price', val ? parseFloat(val) : undefined)}
                  onBlur={() => { setTouched('price'); validateField('price'); }}
                  error={touched.price ? errors.price?.message : undefined}
                />
              </FormField>

              <FormField label="Yield %" htmlFor="yield" hint="Optional">
                <Input
                  id="yield"
                  type="number"
                  placeholder="0.000"
                  step="0.001"
                  value={values.yield?.toString() || ''}
                  onChange={(val) => setValue('yield', val ? parseFloat(val) : undefined)}
                />
              </FormField>
            </div>
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

        {values.isin && values.quantity && (
          <div className="order-summary">
            <div className="order-summary__row">
              <span className="order-summary__label">Action</span>
              <span className={`order-summary__value order-summary__value--${values.side}`}>
                {values.side?.toUpperCase()} {values.quantity?.toLocaleString()} {values.isin}
              </span>
            </div>
            <div className="order-summary__row">
              <span className="order-summary__label">Settlement</span>
              <span className="order-summary__value">{values.settlementDate}</span>
            </div>
            {showPriceField && values.price && (
              <div className="order-summary__row">
                <span className="order-summary__label">Price</span>
                <span className="order-summary__value">{values.price.toFixed(3)}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </DealTicketPopup>
  );
};

export default BondTicket;
