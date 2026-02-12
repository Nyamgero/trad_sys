// ============================================
// components/trading/tickets/MMTicket.tsx
// ============================================

import React, { useCallback, useMemo } from 'react';
import { DealTicketPopup } from '../DealTicketPopup';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useFormValidation } from '@/hooks/useFormValidation';
import { mmTradeSchema, type MMTradeFormData } from '@/lib/validations/tradeSchemas';
import { useDealTicketStore } from '@/stores/dealTicketStore';
import type { DealTicket } from '@/types/dealTicket';

interface MMTicketProps {
  ticket: DealTicket;
}

const instrumentOptions = [
  { value: 'repo', label: 'Repo' },
  { value: 'reverse-repo', label: 'Reverse Repo' },
  { value: 'cd', label: 'Certificate of Deposit' },
  { value: 'cp', label: 'Commercial Paper' },
  { value: 'tbill', label: 'Treasury Bill' },
  { value: 'ba', label: 'Bankers Acceptance' },
];

const dayCountOptions = [
  { value: 'act/360', label: 'ACT/360' },
  { value: 'act/365', label: 'ACT/365' },
  { value: '30/360', label: '30/360' },
];

const accountOptions = [
  { value: 'MM-001', label: 'MM-001' },
  { value: 'MM-002', label: 'MM-002' },
  { value: 'TREASURY', label: 'TREASURY' },
];

const getDefaultStartDate = (): string => {
  return new Date().toISOString().slice(0, 10);
};

const getDefaultMaturityDate = (): string => {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  return date.toISOString().slice(0, 10);
};

const createInitialValues = (): Partial<MMTradeFormData> => ({
  instrument: 'repo',
  principal: undefined,
  rate: undefined,
  startDate: getDefaultStartDate(),
  maturityDate: getDefaultMaturityDate(),
  dayCount: 'act/360',
  account: 'MM-001',
});

export const MMTicket: React.FC<MMTicketProps> = ({ ticket }) => {
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
  } = useFormValidation<MMTradeFormData>({
    schema: mmTradeSchema,
    initialValues,
  });

  const handleSave = useCallback(() => {
    if (validate()) {
      console.log('Submitting money market trade:', values);
      closeTicket(ticket.id);
    }
  }, [validate, values, closeTicket, ticket.id]);

  const handleCancel = useCallback(() => {
    closeTicket(ticket.id);
  }, [closeTicket, ticket.id]);

  // Calculate interest for summary
  const calculateInterest = useMemo(() => {
    if (!values.principal || !values.rate || !values.startDate || !values.maturityDate) {
      return null;
    }

    const start = new Date(values.startDate);
    const maturity = new Date(values.maturityDate);
    const days = Math.ceil((maturity.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    if (days <= 0) return null;

    let divisor = 360;
    if (values.dayCount === 'act/365') divisor = 365;

    const interest = (values.principal * values.rate * days) / (100 * divisor);
    return { days, interest };
  }, [values.principal, values.rate, values.startDate, values.maturityDate, values.dayCount]);

  const getInstrumentLabel = (value: string) => {
    return instrumentOptions.find(opt => opt.value === value)?.label || value;
  };

  return (
    <DealTicketPopup
      ticket={ticket}
      title="Money Market Trade"
      onSave={handleSave}
      onCancel={handleCancel}
      saveDisabled={!isValid}
      saveLabel="Book Trade"
    >
      <div className="ticket-form">
        <div className="ticket-form__section">
          <FormField label="Instrument" htmlFor="instrument" required>
            <Select
              id="instrument"
              options={instrumentOptions}
              value={values.instrument || ''}
              onChange={(val) => setValue('instrument', val as MMTradeFormData['instrument'])}
            />
          </FormField>

          <FormField label="Principal" htmlFor="principal" required error={touched.principal ? errors.principal?.message : undefined}>
            <Input
              id="principal"
              type="number"
              placeholder="0.00"
              step="1000"
              value={values.principal?.toString() || ''}
              onChange={(val) => setValue('principal', val ? parseFloat(val) : undefined as unknown as number)}
              onBlur={() => { setTouched('principal'); validateField('principal'); }}
              error={touched.principal ? errors.principal?.message : undefined}
            />
          </FormField>

          <FormField label="Rate %" htmlFor="rate" required error={touched.rate ? errors.rate?.message : undefined}>
            <Input
              id="rate"
              type="number"
              placeholder="0.000"
              step="0.001"
              value={values.rate?.toString() || ''}
              onChange={(val) => setValue('rate', val ? parseFloat(val) : undefined as unknown as number)}
              onBlur={() => { setTouched('rate'); validateField('rate'); }}
              error={touched.rate ? errors.rate?.message : undefined}
            />
          </FormField>
        </div>

        <div className="ticket-form__section">
          <div className="ticket-form__section-title">Term Details</div>

          <div className="ticket-form__row">
            <FormField label="Start Date" htmlFor="startDate" required error={touched.startDate ? errors.startDate?.message : undefined}>
              <Input
                id="startDate"
                type="date"
                value={values.startDate || ''}
                onChange={(val) => setValue('startDate', val)}
                onBlur={() => { setTouched('startDate'); validateField('startDate'); }}
                error={touched.startDate ? errors.startDate?.message : undefined}
              />
            </FormField>

            <FormField label="Maturity Date" htmlFor="maturityDate" required error={touched.maturityDate ? errors.maturityDate?.message : undefined}>
              <Input
                id="maturityDate"
                type="date"
                value={values.maturityDate || ''}
                onChange={(val) => setValue('maturityDate', val)}
                onBlur={() => { setTouched('maturityDate'); validateField('maturityDate'); }}
                error={touched.maturityDate ? errors.maturityDate?.message : undefined}
              />
            </FormField>
          </div>

          <FormField label="Day Count Convention" htmlFor="dayCount" required>
            <Select
              id="dayCount"
              options={dayCountOptions}
              value={values.dayCount || 'act/360'}
              onChange={(val) => setValue('dayCount', val as MMTradeFormData['dayCount'])}
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

        {values.instrument && values.principal && calculateInterest && (
          <div className="order-summary">
            <div className="order-summary__row">
              <span className="order-summary__label">Instrument</span>
              <span className="order-summary__value">
                {getInstrumentLabel(values.instrument)}
              </span>
            </div>
            <div className="order-summary__row">
              <span className="order-summary__label">Principal</span>
              <span className="order-summary__value">
                ${values.principal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="order-summary__row">
              <span className="order-summary__label">Term</span>
              <span className="order-summary__value">{calculateInterest.days} days</span>
            </div>
            <div className="order-summary__row">
              <span className="order-summary__label">Est. Interest</span>
              <span className="order-summary__value">
                ${calculateInterest.interest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        )}
      </div>
    </DealTicketPopup>
  );
};

export default MMTicket;
