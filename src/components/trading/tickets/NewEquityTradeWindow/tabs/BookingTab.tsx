// ============================================
// NewEquityTradeWindow/tabs/BookingTab.tsx
// ============================================

import React, { useEffect, useState } from 'react';
import { FormField } from '@/components/ui/FormField';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { getPortfolios, getTraders, getBrokers } from '@/services/api/referenceData';
import { formatCurrency } from '@/lib/formatters';
import type { TradeFormState, Portfolio, Trader, Broker } from '../types';
import type { FormErrors } from '@/hooks/useFormValidation';

interface BookingTabProps {
  values: Partial<TradeFormState>;
  errors: FormErrors<TradeFormState>;
  touched: Partial<Record<keyof TradeFormState, boolean>>;
  setValue: <K extends keyof TradeFormState>(field: K, value: TradeFormState[K]) => void;
  setTouched?: (field: keyof TradeFormState) => void;
  validateField?: (field: keyof TradeFormState) => void;
}

export const BookingTab: React.FC<BookingTabProps> = ({
  values,
  errors,
  touched,
  setValue,
}) => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [traders, setTraders] = useState<Trader[]>([]);
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null);

  // Load reference data
  useEffect(() => {
    const loadData = async () => {
      const [portfolioData, traderData, brokerData] = await Promise.all([
        getPortfolios(),
        getTraders(),
        getBrokers(),
      ]);
      setPortfolios(portfolioData);
      setTraders(traderData);
      setBrokers(brokerData);
    };
    loadData();
  }, []);

  // Update selected portfolio info
  useEffect(() => {
    if (values.portfolioId) {
      const portfolio = portfolios.find(p => p.id === values.portfolioId);
      setSelectedPortfolio(portfolio || null);
    } else {
      setSelectedPortfolio(null);
    }
  }, [values.portfolioId, portfolios]);

  // Update selected broker info
  useEffect(() => {
    if (values.brokerId) {
      const broker = brokers.find(b => b.id === values.brokerId);
      setSelectedBroker(broker || null);
    } else {
      setSelectedBroker(null);
    }
  }, [values.brokerId, brokers]);

  const portfolioOptions = portfolios.map(p => ({
    value: p.id,
    label: `${p.id} - ${p.name}`,
  }));

  const traderOptions = traders.map(t => ({
    value: t.id,
    label: t.name,
  }));

  const brokerOptions = brokers.map(b => ({
    value: b.id,
    label: `${b.code} - ${b.name}`,
  }));

  return (
    <div className="new-equity-trade__tab-content">
      <div className="new-equity-trade__section">
        <div className="new-equity-trade__section-title">Parties & Booking</div>

        <div className="new-equity-trade__form-row new-equity-trade__form-row--full">
          <FormField
            label="Portfolio / Fund"
            htmlFor="portfolioId"
            required
            error={touched.portfolioId ? errors.portfolioId?.message : undefined}
          >
            <Select
              id="portfolioId"
              options={portfolioOptions}
              value={values.portfolioId || ''}
              onChange={(val) => setValue('portfolioId', val)}
              placeholder="Select portfolio..."
            />
            {selectedPortfolio && (
              <div className="field-hint field-hint--calculated">
                AUM: {formatCurrency(selectedPortfolio.aum || 0, selectedPortfolio.baseCurrency)} | Strategy: {selectedPortfolio.strategy}
              </div>
            )}
          </FormField>
        </div>

        <div className="new-equity-trade__form-row">
          <FormField
            label="Trader"
            htmlFor="traderId"
            required
            error={touched.traderId ? errors.traderId?.message : undefined}
          >
            <Select
              id="traderId"
              options={traderOptions}
              value={values.traderId || ''}
              onChange={(val) => setValue('traderId', val)}
              placeholder="Select trader..."
            />
          </FormField>

          <FormField
            label="Broker"
            htmlFor="brokerId"
            required
            error={touched.brokerId ? errors.brokerId?.message : undefined}
          >
            <Select
              id="brokerId"
              options={brokerOptions}
              value={values.brokerId || ''}
              onChange={(val) => setValue('brokerId', val)}
              placeholder="Select broker..."
            />
            {selectedBroker?.lei && (
              <div className="field-hint field-hint--calculated">
                LEI: {selectedBroker.lei.substring(0, 12)}...
              </div>
            )}
          </FormField>
        </div>

        <div className="new-equity-trade__form-row new-equity-trade__form-row--full">
          <FormField
            label="Client ID (Optional)"
            htmlFor="clientId"
          >
            <Input
              id="clientId"
              value={values.clientId || ''}
              onChange={(val) => setValue('clientId', val)}
              placeholder="e.g., CLI-PENSION-001"
            />
            <div className="field-hint field-hint--calculated">
              For institutional/client trades
            </div>
          </FormField>
        </div>

        {(selectedPortfolio || values.traderId || selectedBroker) && (
          <div className="booking-summary">
            <div className="booking-summary__header">
              <span>&#128203;</span>
              <span className="booking-summary__title">BOOKING SUMMARY</span>
            </div>
            {selectedPortfolio && (
              <div className="booking-summary__row">
                <span className="booking-summary__label">Portfolio:</span>
                <span className="booking-summary__value">
                  {selectedPortfolio.id} ({selectedPortfolio.name})
                </span>
              </div>
            )}
            {values.traderId && (
              <div className="booking-summary__row">
                <span className="booking-summary__label">Trader:</span>
                <span className="booking-summary__value">
                  {traders.find(t => t.id === values.traderId)?.name || values.traderId}
                </span>
              </div>
            )}
            {selectedBroker && (
              <div className="booking-summary__row">
                <span className="booking-summary__label">Broker:</span>
                <span className="booking-summary__value">{selectedBroker.name}</span>
              </div>
            )}
            <div className="booking-summary__row">
              <span className="booking-summary__label">Allocation:</span>
              <span className="booking-summary__value">100% to primary portfolio</span>
            </div>
          </div>
        )}

        <div style={{ marginTop: 16 }}>
          <label className="form-checkbox">
            <input
              type="checkbox"
              className="form-checkbox__input"
              checked={values.bookImmediately ?? true}
              onChange={(e) => setValue('bookImmediately', e.target.checked)}
            />
            <span className="form-checkbox__label">Book immediately on submit</span>
          </label>
        </div>

        <div style={{ marginTop: 8 }}>
          <label className="form-checkbox">
            <input
              type="checkbox"
              className="form-checkbox__input"
              checked={values.routeToCompliance ?? false}
              onChange={(e) => setValue('routeToCompliance', e.target.checked)}
            />
            <span className="form-checkbox__label">Route to compliance for pre-approval</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default BookingTab;
