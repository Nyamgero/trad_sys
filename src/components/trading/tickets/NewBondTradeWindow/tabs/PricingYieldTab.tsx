// ============================================
// NewBondTradeWindow/tabs/PricingYieldTab.tsx
// ============================================

import React, { useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import clsx from 'clsx';
import { formatCurrency } from '@/lib/formatters';
import type { BondTradeFormState, AccruedInterestCalc } from '../types';

interface PricingYieldTabProps {
  values: Partial<BondTradeFormState>;
  errors: Partial<Record<keyof BondTradeFormState, { message: string }>>;
  touched: Partial<Record<keyof BondTradeFormState, boolean>>;
  setValue: <K extends keyof BondTradeFormState>(field: K, value: BondTradeFormState[K]) => void;
  setTouched: (field: keyof BondTradeFormState) => void;
  validateField: (field: keyof BondTradeFormState) => void;
  principalValue: number;
  accruedInterest: number;
  dirtyValue: number;
  accruedCalc: AccruedInterestCalc | null;
}

export const PricingYieldTab: React.FC<PricingYieldTabProps> = ({
  values,
  errors,
  touched,
  setValue,
  setTouched,
  principalValue: _principalValue,
  accruedInterest,
  dirtyValue,
  accruedCalc,
}) => {
  // principalValue available via _principalValue for future use
  const handleCleanPriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[^0-9.]/g, '');
      const numValue = value ? parseFloat(value) : null;
      setValue('cleanPrice', numValue);
    },
    [setValue]
  );

  const handleCleanPriceBlur = useCallback(() => {
    setTouched('cleanPrice');
  }, [setTouched]);

  const handleMarketYieldChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[^0-9.]/g, '');
      const numValue = value ? parseFloat(value) : undefined;
      setValue('currentMarketYield', numValue);
    },
    [setValue]
  );

  const handleRefreshPrice = useCallback(() => {
    // In a real app, this would fetch live market data
    console.log('Refreshing market price...');
  }, []);

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'N/A';
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const dirtyPrice = values.faceValue && values.faceValue > 0
    ? (dirtyValue / values.faceValue) * 100
    : 0;

  return (
    <div className="bond-tab bond-tab--pricing">
      <div className="bond-tab__section">
        <h3 className="bond-tab__section-title">Pricing & Yield Analysis</h3>

        {/* Clean Price */}
        <div className="form-row">
          <div className="form-group form-group--flex-2">
            <label className="form-label form-label--required">
              Clean Price (% of Par)
            </label>
            <div className="input-with-action">
              <input
                type="text"
                className={clsx(
                  'form-input',
                  touched.cleanPrice && errors.cleanPrice && 'form-input--error'
                )}
                value={values.cleanPrice !== null ? values.cleanPrice : ''}
                onChange={handleCleanPriceChange}
                onBlur={handleCleanPriceBlur}
                placeholder="98.7500"
              />
              <button
                type="button"
                className="input-action-btn"
                onClick={handleRefreshPrice}
                title="Refresh market price"
              >
                <RefreshCw size={16} />
              </button>
            </div>
            {touched.cleanPrice && errors.cleanPrice && (
              <span className="form-error">{errors.cleanPrice.message}</span>
            )}
            <span className="form-hint">Price excluding accrued interest</span>
          </div>

          <div className="form-group form-group--flex-1">
            <label className="form-label">Current Market</label>
            <div className="market-quote-display">
              <span>Bid: --</span>
              <span>Ask: --</span>
            </div>
          </div>
        </div>

        {/* Accrued Interest Calculation Panel */}
        {accruedCalc && values.bondDetails && (
          <div className="accrued-interest-panel">
            <h4 className="accrued-interest-panel__title">Accrued Interest Calculation</h4>
            <div className="accrued-interest-panel__grid">
              <div className="accrued-interest-panel__row">
                <span className="accrued-interest-panel__label">Last Coupon Date</span>
                <span className="accrued-interest-panel__value">
                  {formatDate(accruedCalc.lastCouponDate)}
                </span>
              </div>
              <div className="accrued-interest-panel__row">
                <span className="accrued-interest-panel__label">Settlement Date</span>
                <span className="accrued-interest-panel__value">
                  {formatDate(accruedCalc.settlementDate)}
                </span>
              </div>
              <div className="accrued-interest-panel__row">
                <span className="accrued-interest-panel__label">Days Accrued</span>
                <span className="accrued-interest-panel__value">
                  {accruedCalc.daysAccrued} days
                </span>
              </div>
              <div className="accrued-interest-panel__row">
                <span className="accrued-interest-panel__label">Day Count Convention</span>
                <span className="accrued-interest-panel__value">
                  {values.bondDetails.dayCountConvention}
                </span>
              </div>
              <div className="accrued-interest-panel__row">
                <span className="accrued-interest-panel__label">Coupon Rate</span>
                <span className="accrued-interest-panel__value">
                  {values.bondDetails.couponRate}%
                </span>
              </div>
              <div className="accrued-interest-panel__row">
                <span className="accrued-interest-panel__label">Days in Period</span>
                <span className="accrued-interest-panel__value">
                  {Math.round(accruedCalc.daysInPeriod)} days
                </span>
              </div>
              <div className="accrued-interest-panel__divider" />
              <div className="accrued-interest-panel__formula">
                <span>Accrued Interest = ({values.bondDetails.couponRate}% / {values.bondDetails.couponFrequency}) × ({accruedCalc.daysAccrued} / {Math.round(accruedCalc.daysInPeriod)})</span>
                <span>= {accruedCalc.accruedPercent.toFixed(4)}% of par</span>
              </div>
              <div className="accrued-interest-panel__result">
                <span className="accrued-interest-panel__label">
                  Per {formatCurrency(values.faceValue || 0, values.currency || 'USD')} face
                </span>
                <span className="accrued-interest-panel__value accrued-interest-panel__value--highlight">
                  {formatCurrency(accruedCalc.accruedAmount, values.currency || 'USD')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Accrued Interest & Dirty Price */}
        <div className="form-row">
          <div className="form-group form-group--flex-1">
            <label className="form-label">Accrued Interest</label>
            <input
              type="text"
              className="form-input form-input--readonly"
              value={accruedInterest ? formatCurrency(accruedInterest, values.currency || 'USD') : '--'}
              readOnly
            />
            <span className="form-hint">Auto-calculated (editable)</span>
          </div>

          <div className="form-group form-group--flex-1">
            <label className="form-label">Dirty Price (% of Par)</label>
            <input
              type="text"
              className="form-input form-input--readonly"
              value={dirtyPrice ? dirtyPrice.toFixed(4) : '--'}
              readOnly
            />
            <span className="form-hint">Clean + Accrued</span>
          </div>
        </div>

        <div className="form-divider" />

        {/* Yield Metrics */}
        <div className="form-row">
          <div className="form-group form-group--flex-1">
            <label className="form-label">Yield to Maturity (YTM)</label>
            <div className="input-with-suffix">
              <input
                type="text"
                className="form-input form-input--readonly"
                value={values.ytm !== null && values.ytm !== undefined ? values.ytm.toFixed(4) : '--'}
                readOnly
              />
              <span className="input-suffix">%</span>
            </div>
            <span className="form-hint">Implied yield at trade price</span>
          </div>

          <div className="form-group form-group--flex-1">
            <label className="form-label">Yield to Worst</label>
            <div className="input-with-suffix">
              <input
                type="text"
                className="form-input form-input--readonly"
                value={values.yieldToWorst !== undefined ? values.yieldToWorst.toFixed(4) : values.ytm?.toFixed(4) || '--'}
                readOnly
              />
              <span className="input-suffix">%</span>
            </div>
            <span className="form-hint">{values.bondDetails?.callable ? 'To first call date' : 'Same (no call features)'}</span>
          </div>
        </div>

        {/* Yield & Risk Metrics Panel */}
        {values.bondDetails && values.cleanPrice && (
          <div className="yield-metrics-panel">
            <h4 className="yield-metrics-panel__title">Yield & Risk Metrics</h4>
            <div className="yield-metrics-panel__grid">
              <div className="yield-metrics-panel__item">
                <span className="yield-metrics-panel__label">Modified Duration</span>
                <span className="yield-metrics-panel__value">-- years</span>
              </div>
              <div className="yield-metrics-panel__item">
                <span className="yield-metrics-panel__label">Macaulay Duration</span>
                <span className="yield-metrics-panel__value">-- years</span>
              </div>
              <div className="yield-metrics-panel__item">
                <span className="yield-metrics-panel__label">Convexity</span>
                <span className="yield-metrics-panel__value">--</span>
              </div>
              <div className="yield-metrics-panel__item">
                <span className="yield-metrics-panel__label">DV01 (per $1MM)</span>
                <span className="yield-metrics-panel__value">$--</span>
              </div>
            </div>
            <div className="yield-metrics-panel__footer">
              <span>Price Impact: +25 bps yield = --.--% price | -25 bps yield = +-.--% price</span>
            </div>
          </div>
        )}

        {/* Current Market Yield */}
        <div className="form-group">
          <label className="form-label">Current Market Yield</label>
          <div className="input-with-suffix" style={{ maxWidth: '250px' }}>
            <input
              type="text"
              className="form-input"
              value={values.currentMarketYield !== undefined ? values.currentMarketYield : ''}
              onChange={handleMarketYieldChange}
              placeholder="4.7100"
            />
            <span className="input-suffix">%</span>
          </div>
          <span className="form-hint">For P&L comparison</span>
        </div>
      </div>
    </div>
  );
};

export default PricingYieldTab;
