// ============================================
// NewMMTradeWindow/NewMMTradeWindow.tsx
// ============================================

import React, { useCallback, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import clsx from 'clsx';
import { useDealTicketStore } from '@/stores/dealTicketStore';
import { useNewMMTrade } from './useNewMMTrade';
import { TabNavigation } from './components/TabNavigation';
import { DepositDetailsTab } from './tabs/DepositDetailsTab';
import { PricingInterestTab } from './tabs/PricingInterestTab';
import { CounterpartyTab } from './tabs/CounterpartyTab';
import { SettlementTab } from './tabs/SettlementTab';
import { StatusNotesTab } from './tabs/StatusNotesTab';
import { formatCurrency } from '@/lib/formatters';
import type { MMTabId } from './types';
import './new-mm-trade.css';

interface NewMMTradeWindowProps {
  ticketId: string;
  initialPosition?: { x: number; y: number };
}

export const NewMMTradeWindow: React.FC<NewMMTradeWindowProps> = ({
  ticketId,
  initialPosition = { x: 100, y: 50 },
}) => {
  const { closeTicket, focusTicket, tickets } = useDealTicketStore();
  const ticket = tickets.find((t) => t.id === ticketId);
  const zIndex = ticket?.zIndex ?? 1000;

  const {
    // Form state
    values,
    errors,
    touched,
    isValid: _isValid,
    isDirty,

    // Tab state
    activeTab,
    setActiveTab,
    tabErrors,

    // Field handlers
    setValue,
    setTouched,

    // Calculations
    interestAmount,
    maturityProceeds,
    annualizedReturn,

    // Actions
    validate,
    reset,
    handleDirectionChange,
    handleDepositTypeChange,
    handleRateTypeChange,
    handleTenorChange,
    handleSubmit,

    // Validation state
    validationErrors,
    validationWarnings,
  } = useNewMMTrade();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Tab navigation: Ctrl+1-5
      if (e.ctrlKey && e.key >= '1' && e.key <= '5') {
        e.preventDefault();
        const tabIndex = parseInt(e.key) - 1;
        const tabs: MMTabId[] = ['deposit-details', 'pricing', 'counterparty', 'settlement', 'status'];
        if (tabs[tabIndex]) {
          setActiveTab(tabs[tabIndex]);
        }
      }

      // Submit: Ctrl+Enter
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }

      // Reset: Ctrl+Shift+R
      if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        reset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveTab, handleSubmit, reset]);

  const handleClose = useCallback(() => {
    if (isDirty) {
      const confirm = window.confirm('You have unsaved changes. Are you sure you want to close?');
      if (!confirm) return;
    }
    closeTicket(ticketId);
  }, [closeTicket, ticketId, isDirty]);

  const handleFocus = useCallback(() => {
    focusTicket(ticketId);
  }, [focusTicket, ticketId]);

  const onSubmit = useCallback(async () => {
    const success = await handleSubmit();
    if (success) {
      closeTicket(ticketId);
    }
  }, [handleSubmit, closeTicket, ticketId]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'deposit-details':
        return (
          <DepositDetailsTab
            values={values}
            errors={errors}
            touched={touched}
            setValue={setValue}
            setTouched={setTouched}
            onDirectionChange={handleDirectionChange}
            onDepositTypeChange={handleDepositTypeChange}
            onTenorChange={handleTenorChange}
            interestAmount={interestAmount}
            maturityProceeds={maturityProceeds}
          />
        );
      case 'pricing':
        return (
          <PricingInterestTab
            values={values}
            errors={errors}
            touched={touched}
            setValue={setValue}
            setTouched={setTouched}
            onRateTypeChange={handleRateTypeChange}
            interestAmount={interestAmount}
            maturityProceeds={maturityProceeds}
            annualizedReturn={annualizedReturn}
          />
        );
      case 'counterparty':
        return (
          <CounterpartyTab
            values={values}
            errors={errors}
            touched={touched}
            setValue={setValue}
            setTouched={setTouched}
          />
        );
      case 'settlement':
        return (
          <SettlementTab
            values={values}
            errors={errors}
            touched={touched}
            setValue={setValue}
            setTouched={setTouched}
            maturityProceeds={maturityProceeds}
          />
        );
      case 'status':
        return (
          <StatusNotesTab
            values={values}
            errors={errors}
            touched={touched}
            setValue={setValue}
            setTouched={setTouched}
            validationWarnings={validationWarnings}
          />
        );
      default:
        return null;
    }
  };

  // Get display values for header summary
  const displayRate = values.rateType === 'FLOATING' ? values.allInRate : values.interestRate;
  const currency = values.currency || 'ZAR';

  return (
    <Rnd
      default={{
        x: initialPosition.x,
        y: initialPosition.y,
        width: 720,
        height: 680,
      }}
      minWidth={680}
      minHeight={500}
      bounds="window"
      dragHandleClassName="new-mm-trade__header"
      style={{ zIndex }}
      onMouseDown={handleFocus}
    >
      <div className="new-mm-trade" onClick={handleFocus}>
        {/* Header */}
        <div className="new-mm-trade__header">
          <div className="new-mm-trade__header-left">
            <span className="new-mm-trade__title">New Money Market Trade</span>
            <span
              className={clsx(
                'new-mm-trade__direction-badge',
                values.direction === 'PLACEMENT'
                  ? 'new-mm-trade__direction-badge--placement'
                  : 'new-mm-trade__direction-badge--borrowing'
              )}
            >
              {values.direction || 'PLACEMENT'}
            </span>
            <span className="new-mm-trade__type-badge">{values.depositType || 'FIXED'}</span>
          </div>
          <div className="new-mm-trade__header-right">
            <button
              type="button"
              className="new-mm-trade__reset-btn"
              onClick={reset}
              title="Reset form (Ctrl+Shift+R)"
            >
              ↺
            </button>
            <button
              type="button"
              className="new-mm-trade__close-btn"
              onClick={handleClose}
              title="Close"
            >
              ×
            </button>
          </div>
        </div>

        {/* Quick Summary Bar */}
        <div className="new-mm-trade__summary-bar">
          <div className="new-mm-trade__summary-item">
            <span className="new-mm-trade__summary-label">Principal</span>
            <span className="new-mm-trade__summary-value">
              {values.principalAmount
                ? formatCurrency(values.principalAmount, currency)
                : `${currency} --`}
            </span>
          </div>
          <div className="new-mm-trade__summary-item">
            <span className="new-mm-trade__summary-label">Rate</span>
            <span className="new-mm-trade__summary-value">
              {displayRate ? `${displayRate.toFixed(2)}%` : '--%'}
            </span>
          </div>
          <div className="new-mm-trade__summary-item">
            <span className="new-mm-trade__summary-label">Tenor</span>
            <span className="new-mm-trade__summary-value">
              {values.tenor !== 'CUSTOM' ? values.tenor : `${values.days}d`}
            </span>
          </div>
          <div className="new-mm-trade__summary-item">
            <span className="new-mm-trade__summary-label">Interest</span>
            <span className="new-mm-trade__summary-value new-mm-trade__summary-value--highlight">
              {interestAmount > 0 ? formatCurrency(interestAmount, currency) : `${currency} --`}
            </span>
          </div>
          <div className="new-mm-trade__summary-item">
            <span className="new-mm-trade__summary-label">Maturity</span>
            <span className="new-mm-trade__summary-value new-mm-trade__summary-value--total">
              {maturityProceeds > 0
                ? formatCurrency(maturityProceeds, currency)
                : `${currency} --`}
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} tabErrors={tabErrors} />

        {/* Tab Content */}
        <div className="new-mm-trade__content">{renderTabContent()}</div>

        {/* Footer */}
        <div className="new-mm-trade__footer">
          <div className="new-mm-trade__footer-left">
            {validationErrors.length > 0 && (
              <span className="new-mm-trade__error-count">
                {validationErrors.length} error{validationErrors.length !== 1 ? 's' : ''}
              </span>
            )}
            {validationWarnings.length > 0 && (
              <span className="new-mm-trade__warning-count">
                {validationWarnings.length} warning{validationWarnings.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div className="new-mm-trade__footer-right">
            <button
              type="button"
              className="new-mm-trade__btn new-mm-trade__btn--secondary"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="new-mm-trade__btn new-mm-trade__btn--secondary"
              onClick={() => validate()}
            >
              Validate
            </button>
            <button
              type="button"
              className={clsx(
                'new-mm-trade__btn',
                values.direction === 'PLACEMENT'
                  ? 'new-mm-trade__btn--placement'
                  : 'new-mm-trade__btn--borrowing'
              )}
              onClick={onSubmit}
              title="Submit (Ctrl+Enter)"
            >
              {values.direction === 'PLACEMENT' ? 'Place Funds' : 'Book Borrowing'}
            </button>
          </div>
        </div>
      </div>
    </Rnd>
  );
};

export default NewMMTradeWindow;
