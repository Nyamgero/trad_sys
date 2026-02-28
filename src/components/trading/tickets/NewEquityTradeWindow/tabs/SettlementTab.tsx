// ============================================
// NewEquityTradeWindow/tabs/SettlementTab.tsx
// ============================================

import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import clsx from 'clsx';
import { FormField } from '@/components/ui/FormField';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { getCustodians } from '@/services/api/referenceData';
import type { TradeFormState, SettlementCycle, TradeStatus, Custodian } from '../types';
import type { FormErrors } from '@/hooks/useFormValidation';

interface SettlementTabProps {
  values: Partial<TradeFormState>;
  errors: FormErrors<TradeFormState>;
  touched: Partial<Record<keyof TradeFormState, boolean>>;
  setValue: <K extends keyof TradeFormState>(field: K, value: TradeFormState[K]) => void;
  setTouched: (field: keyof TradeFormState) => void;
  validateField: (field: keyof TradeFormState) => void;
  settlementCycle?: string;
}

const settlementCycleOptions = [
  { value: 'T+0', label: 'T+0 (Same Day)' },
  { value: 'T+1', label: 'T+1 (Next Day)' },
  { value: 'T+2', label: 'T+2 (Standard)' },
  { value: 'T+3', label: 'T+3' },
];

const tradeStatusOptions = [
  { value: 'NEW', label: 'New' },
  { value: 'EXECUTED', label: 'Executed' },
  { value: 'ALLOCATED', label: 'Allocated' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'AMENDED', label: 'Amended' },
];

const formatDate = (date: Date | undefined): string => {
  if (!date) return '';
  return date.toISOString().split('T')[0] ?? '';
};

const formatDisplayDate = (date: Date | undefined): string => {
  if (!date) return '';
  return date.toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getBusinessDaysDiff = (start: Date, end: Date): number => {
  let count = 0;
  const current = new Date(start);
  while (current < end) {
    current.setDate(current.getDate() + 1);
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
  }
  return count;
};

export const SettlementTab: React.FC<SettlementTabProps> = ({
  values,
  errors,
  touched,
  setValue,
  setTouched,
  validateField,
}) => {
  const [custodians, setCustodians] = useState<Custodian[]>([]);

  useEffect(() => {
    const loadCustodians = async () => {
      const data = await getCustodians();
      setCustodians(data);
    };
    loadCustodians();
  }, []);

  const custodianOptions = [
    { value: '', label: 'Select custodian...' },
    ...custodians.map(c => ({
      value: c.id,
      label: `${c.code} - ${c.name}`,
    })),
  ];

  const daysToSettle = values.tradeDate && values.settlementDate
    ? getBusinessDaysDiff(values.tradeDate, values.settlementDate)
    : 2;

  return (
    <div className="new-equity-trade__tab-content">
      <div className="new-equity-trade__section">
        <div className="new-equity-trade__section-title">Settlement & Post-Trade</div>

        <div className="new-equity-trade__form-row">
          <FormField
            label="Settlement Date"
            htmlFor="settlementDate"
            required
            error={touched.settlementDate ? errors.settlementDate?.message : undefined}
          >
            <div className="input-with-suffix">
              <Input
                id="settlementDate"
                type="date"
                value={formatDate(values.settlementDate)}
                onChange={(val) => setValue('settlementDate', new Date(val))}
                onBlur={() => {
                  setTouched('settlementDate');
                  validateField('settlementDate');
                }}
                error={touched.settlementDate ? errors.settlementDate?.message : undefined}
              />
              <RefreshCw size={14} className="input-with-suffix__suffix" style={{ cursor: 'pointer' }} />
            </div>
            <div className="field-hint field-hint--calculated">
              Auto-calculated: Trade Date + {daysToSettle} business days
            </div>
          </FormField>

          <FormField
            label="Settlement Cycle"
            htmlFor="settlementCycle"
          >
            <Select
              id="settlementCycle"
              options={settlementCycleOptions}
              value={values.settlementCycle || 'T+2'}
              onChange={(val) => setValue('settlementCycle', val as SettlementCycle)}
            />
          </FormField>
        </div>

        <div className="new-equity-trade__form-row new-equity-trade__form-row--full">
          <FormField
            label="Custodian / Settlement Agent"
            htmlFor="custodian"
          >
            <Select
              id="custodian"
              options={custodianOptions}
              value={values.custodian || ''}
              onChange={(val) => setValue('custodian', val)}
            />
          </FormField>
        </div>

        <div className="new-equity-trade__form-row">
          <FormField
            label="Settlement Status"
            htmlFor="settlementStatus"
          >
            <div className={clsx(
              'status-badge',
              `status-badge--${values.settlementStatus?.toLowerCase() || 'pending'}`
            )}>
              <span>&#9679;</span>
              {values.settlementStatus || 'PENDING'}
            </div>
          </FormField>

          <FormField
            label="Trade Status"
            htmlFor="tradeStatus"
          >
            <Select
              id="tradeStatus"
              options={tradeStatusOptions}
              value={values.tradeStatus || 'NEW'}
              onChange={(val) => setValue('tradeStatus', val as TradeStatus)}
            />
          </FormField>
        </div>

        <div className="settlement-timeline">
          <div className="settlement-timeline__header">
            <span>&#128197;</span>
            <span className="settlement-timeline__title">SETTLEMENT TIMELINE</span>
          </div>

          <div className="settlement-timeline__dates">
            <div className="settlement-timeline__date">
              <div className="settlement-timeline__date-label">Trade Date</div>
              <div className="settlement-timeline__date-value">
                {formatDisplayDate(values.tradeDate)}
              </div>
            </div>
            <div className="settlement-timeline__days">
              &#8594; {daysToSettle} business {daysToSettle === 1 ? 'day' : 'days'} &#8594;
            </div>
            <div className="settlement-timeline__date">
              <div className="settlement-timeline__date-label">Settlement Date</div>
              <div className="settlement-timeline__date-value">
                {formatDisplayDate(values.settlementDate)}
              </div>
            </div>
          </div>

          <div className="settlement-timeline__progress">
            <div className="settlement-timeline__dot" title="Executed" />
            <div className={clsx(
              'settlement-timeline__line',
              values.tradeStatus !== 'NEW' && 'settlement-timeline__line--active'
            )} />
            <div className={clsx(
              'settlement-timeline__dot',
              values.settlementStatus === 'PENDING' ? 'settlement-timeline__dot--pending' : ''
            )} title="Matching" />
            <div className="settlement-timeline__line" />
            <div className="settlement-timeline__dot settlement-timeline__dot--pending" title="Settlement" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 11, color: 'var(--text-tertiary)' }}>
            <span>Executed</span>
            <span>Matching</span>
            <span>Settlement</span>
          </div>
        </div>

        <div className="new-equity-trade__form-row new-equity-trade__form-row--full" style={{ marginTop: 16 }}>
          <FormField
            label="Notes"
            htmlFor="notes"
            error={touched.notes ? errors.notes?.message : undefined}
          >
            <textarea
              id="notes"
              className={clsx(
                'form-textarea',
                touched.notes && errors.notes && 'form-textarea--error'
              )}
              value={values.notes || ''}
              onChange={(e) => setValue('notes', e.target.value)}
              onBlur={() => {
                setTouched('notes');
                validateField('notes');
              }}
              placeholder="Add any notes or comments about this trade..."
              maxLength={500}
            />
            <div className="field-hint" style={{ textAlign: 'right' }}>
              {(values.notes?.length || 0)}/500 characters
            </div>
          </FormField>
        </div>
      </div>
    </div>
  );
};

export default SettlementTab;
