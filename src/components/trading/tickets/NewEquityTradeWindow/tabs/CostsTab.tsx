// ============================================
// NewEquityTradeWindow/tabs/CostsTab.tsx
// ============================================

import React from 'react';
import { Lock } from 'lucide-react';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { ConsiderationSummary } from '../components/ConsiderationSummary';
import { formatCurrency } from '@/lib/formatters';
import type { TradeFormState } from '../types';
import type { FormErrors } from '@/hooks/useFormValidation';

interface CostsTabProps {
  values: Partial<TradeFormState>;
  errors: FormErrors<TradeFormState>;
  touched: Partial<Record<keyof TradeFormState, boolean>>;
  setValue: <K extends keyof TradeFormState>(field: K, value: TradeFormState[K]) => void;
  setTouched: (field: keyof TradeFormState) => void;
  validateField: (field: keyof TradeFormState) => void;
  grossConsideration: number;
  sttTax: number;
  netConsideration: number;
  totalCosts: number;
  costPercentage: number;
}

// Default rates
const DEFAULT_COMMISSION_RATE = 0.0003; // 0.03%
const DEFAULT_OTHER_FEES_RATE = 0.0001; // 0.01%

export const CostsTab: React.FC<CostsTabProps> = ({
  values,
  errors,
  touched,
  setValue,
  setTouched,
  validateField,
  grossConsideration,
  sttTax,
  netConsideration,
  totalCosts,
  costPercentage,
}) => {
  const currency = values.currency || 'ZAR';

  // Calculate default values for display
  const commissionValue = values.commission !== null && values.commission !== undefined
    ? values.commission
    : grossConsideration * DEFAULT_COMMISSION_RATE;

  const otherFeesValue = values.otherFees !== null && values.otherFees !== undefined
    ? values.otherFees
    : grossConsideration * DEFAULT_OTHER_FEES_RATE;

  const isBuySide = values.side === 'BUY' || values.side === 'BUY_TO_COVER';

  return (
    <div className="new-equity-trade__tab-content">
      <div className="new-equity-trade__section">
        <div className="new-equity-trade__section-title">Costs & Financials</div>

        <div className="gross-consideration" style={{ marginBottom: 20 }}>
          <div className="gross-consideration__label">Gross Consideration</div>
          <div className="gross-consideration__value">
            {formatCurrency(grossConsideration, currency)}
          </div>
        </div>

        <div className="new-equity-trade__form-row">
          <FormField
            label="Commission"
            htmlFor="commission"
            error={touched.commission ? errors.commission?.message : undefined}
          >
            <Input
              id="commission"
              type="number"
              step="0.01"
              value={values.commission?.toString() || ''}
              onChange={(val) => setValue('commission', val ? parseFloat(val) : null)}
              onBlur={() => {
                setTouched('commission');
                validateField('commission');
              }}
              placeholder={commissionValue.toFixed(2)}
              error={touched.commission ? errors.commission?.message : undefined}
            />
            <div className="field-hint field-hint--calculated">
              {values.commission === null ? `Default: 0.03% of gross` : ''}
            </div>
          </FormField>

          <FormField
            label="STT Tax (0.25%)"
            htmlFor="sttTax"
          >
            <div className="calculated-field">
              <Input
                id="sttTax"
                type="text"
                value={formatCurrency(sttTax, currency)}
                readOnly
                className="form-input--readonly"
              />
              <Lock size={14} className="calculated-field__lock" />
            </div>
            <div className="field-hint field-hint--calculated">
              {isBuySide ? 'Auto-calculated (buys only)' : 'N/A for sell orders'}
            </div>
          </FormField>
        </div>

        <div className="new-equity-trade__form-row">
          <FormField
            label="Other Fees"
            htmlFor="otherFees"
            error={touched.otherFees ? errors.otherFees?.message : undefined}
          >
            <Input
              id="otherFees"
              type="number"
              step="0.01"
              value={values.otherFees?.toString() || ''}
              onChange={(val) => setValue('otherFees', val ? parseFloat(val) : null)}
              onBlur={() => {
                setTouched('otherFees');
                validateField('otherFees');
              }}
              placeholder={otherFeesValue.toFixed(2)}
              error={touched.otherFees ? errors.otherFees?.message : undefined}
            />
            <div className="field-hint field-hint--calculated">
              Exchange, STRATE, VAT, clearing
            </div>
          </FormField>

          <FormField
            label="FX Rate"
            htmlFor="fxRate"
          >
            <Input
              id="fxRate"
              type="text"
              value="N/A (same currency)"
              readOnly
              className="form-input--readonly"
              disabled
            />
          </FormField>
        </div>

        <ConsiderationSummary
          grossConsideration={grossConsideration}
          commission={commissionValue}
          sttTax={sttTax}
          otherFees={otherFeesValue}
          netConsideration={netConsideration}
          totalCosts={totalCosts}
          costPercentage={costPercentage}
          currency={currency}
          side={values.side || 'BUY'}
        />
      </div>
    </div>
  );
};

export default CostsTab;
