// ============================================
// NewEquityTradeWindow/tabs/InstrumentTab.tsx
// ============================================

import React, { useEffect, useState, useCallback } from 'react';
import { Info } from 'lucide-react';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { TickerAutocomplete } from '../components/TickerAutocomplete';
import { QuoteDisplay } from '../components/QuoteDisplay';
import { getQuote } from '@/services/api/referenceData';
import { mockExchanges, mockCurrencies } from '@/mocks/referenceData';
import type { TradeFormState, Security, QuoteData } from '../types';
import type { FormErrors } from '@/hooks/useFormValidation';

interface InstrumentTabProps {
  values: Partial<TradeFormState>;
  errors: FormErrors<TradeFormState>;
  touched: Partial<Record<keyof TradeFormState, boolean>>;
  setValue: <K extends keyof TradeFormState>(field: K, value: TradeFormState[K]) => void;
  setTouched: (field: keyof TradeFormState) => void;
  validateField: (field: keyof TradeFormState) => void;
  onSecuritySelect: (security: Security) => void;
  onQuoteUpdate: (quote: QuoteData) => void;
}

const exchangeOptions = mockExchanges.map(e => ({
  value: e.mic,
  label: `${e.mic} - ${e.name}`,
}));

const currencyOptions = mockCurrencies.map(c => ({
  value: c.code,
  label: `${c.code} - ${c.name}`,
}));

export const InstrumentTab: React.FC<InstrumentTabProps> = ({
  values,
  errors,
  touched,
  setValue,
  setTouched,
  validateField,
  onSecuritySelect,
  onQuoteUpdate,
}) => {
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);

  // Fetch quote when ISIN changes
  const fetchQuote = useCallback(async (isin: string) => {
    if (!isin) {
      setQuote(null);
      return;
    }

    setIsLoadingQuote(true);
    try {
      const quoteData = await getQuote(isin);
      if (quoteData) {
        setQuote(quoteData);
        onQuoteUpdate(quoteData);
      }
    } catch (err) {
      console.error('Failed to fetch quote:', err);
    } finally {
      setIsLoadingQuote(false);
    }
  }, [onQuoteUpdate]);

  useEffect(() => {
    if (values.isin) {
      fetchQuote(values.isin);
    }
  }, [values.isin, fetchQuote]);

  const handleSecuritySelect = useCallback((security: Security) => {
    onSecuritySelect(security);
    fetchQuote(security.isin);
  }, [onSecuritySelect, fetchQuote]);

  return (
    <div className="new-equity-trade__tab-content">
      <div className="new-equity-trade__section">
        <div className="new-equity-trade__section-title">Instrument Identification</div>

        <div className="new-equity-trade__form-row">
          <FormField
            label="Ticker Symbol"
            htmlFor="tickerSymbol"
            required
            error={touched.tickerSymbol ? errors.tickerSymbol?.message : undefined}
          >
            <TickerAutocomplete
              value={values.tickerSymbol || ''}
              onChange={(val) => setValue('tickerSymbol', val)}
              onSelect={handleSecuritySelect}
              onBlur={() => {
                setTouched('tickerSymbol');
                validateField('tickerSymbol');
              }}
              error={touched.tickerSymbol ? errors.tickerSymbol?.message : undefined}
            />
            {values.securityName && (
              <div className="new-equity-trade__security-name">
                {values.securityName}
              </div>
            )}
          </FormField>

          <FormField
            label="ISIN"
            htmlFor="isin"
            required
            error={touched.isin ? errors.isin?.message : undefined}
          >
            <div className="input-with-suffix">
              <Input
                id="isin"
                value={values.isin || ''}
                onChange={(val) => setValue('isin', val.toUpperCase())}
                onBlur={() => {
                  setTouched('isin');
                  validateField('isin');
                }}
                placeholder="e.g., ZAE000013181"
                error={touched.isin ? errors.isin?.message : undefined}
                readOnly={!!values.tickerSymbol && !!values.isin}
                className={values.isin ? 'form-input--readonly' : ''}
              />
              <Info size={14} className="input-with-suffix__suffix" style={{ cursor: 'help' }} />
            </div>
          </FormField>
        </div>

        <div className="new-equity-trade__form-row">
          <FormField
            label="Exchange (MIC)"
            htmlFor="micCode"
            required
            error={touched.micCode ? errors.micCode?.message : undefined}
          >
            <Select
              id="micCode"
              options={exchangeOptions}
              value={values.micCode || 'XJSE'}
              onChange={(val) => setValue('micCode', val)}
            />
          </FormField>

          <FormField
            label="Currency"
            htmlFor="currency"
            required
            error={touched.currency ? errors.currency?.message : undefined}
          >
            <Select
              id="currency"
              options={currencyOptions}
              value={values.currency || 'ZAR'}
              onChange={(val) => setValue('currency', val)}
            />
          </FormField>
        </div>

        <QuoteDisplay
          quote={quote}
          currency={values.currency || 'ZAR'}
          isLoading={isLoadingQuote}
        />
      </div>
    </div>
  );
};

export default InstrumentTab;
