// ============================================
// NewBondTradeWindow/NewBondTradeWindow.tsx
// ============================================

import React, { useCallback, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { X, Minus, Square } from 'lucide-react';
import clsx from 'clsx';
import { useDealTicketStore } from '@/stores/dealTicketStore';
import { useNewBondTrade } from './useNewBondTrade';
import { TabNavigation } from './components/TabNavigation';
import { BondIdentificationTab } from './tabs/BondIdentificationTab';
import { TransactionDetailsTab } from './tabs/TransactionDetailsTab';
import { PricingYieldTab } from './tabs/PricingYieldTab';
import { PartiesAccountsTab } from './tabs/PartiesAccountsTab';
import { SettlementCostsTab } from './tabs/SettlementCostsTab';
import type { DealTicket } from '@/types/dealTicket';
import type { BondTabId } from './types';
import './new-bond-trade.css';

interface NewBondTradeWindowProps {
  ticket: DealTicket;
}

const WINDOW_WIDTH = 780;
const WINDOW_MIN_WIDTH = 700;
const WINDOW_MIN_HEIGHT = 550;

export const NewBondTradeWindow: React.FC<NewBondTradeWindowProps> = ({ ticket }) => {
  const { focusTicket, closeTicket, updateTicketPosition } = useDealTicketStore();

  const {
    values,
    errors,
    touched,
    isValid,
    isDirty,
    activeTab,
    setActiveTab,
    tabErrors,
    setValue,
    setTouched,
    validateField,
    principalValue,
    accruedInterest,
    dirtyValue,
    netSettlement,
    accruedCalc,
    reset,
    handleBondSelect,
    handleQuoteUpdate,
    handleDirectionChange,
    handleSubmit,
    validationErrors,
    validationWarnings,
  } = useNewBondTrade({
    currentUserId: 'trader-001',
    defaultFund: 'FIXED-INC-001',
  });

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Tab switching: Ctrl+1 through Ctrl+5
      if (e.ctrlKey && e.key >= '1' && e.key <= '5') {
        e.preventDefault();
        const tabIndex = parseInt(e.key, 10) - 1;
        const tabs: BondTabId[] = ['bond-id', 'transaction', 'pricing', 'parties', 'settlement'];
        if (tabs[tabIndex]) {
          setActiveTab(tabs[tabIndex]);
        }
      }

      // Submit: Ctrl+Enter
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        handleSubmitClick();
      }

      // Cancel: Escape
      if (e.key === 'Escape') {
        handleCancel();
      }

      // Refresh price: F5
      if (e.key === 'F5') {
        e.preventDefault();
        // Would trigger price refresh
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setActiveTab]);

  const handleDragStart = useCallback(() => {
    focusTicket(ticket.id);
  }, [focusTicket, ticket.id]);

  const handleDragStop = useCallback(
    (_e: unknown, data: { x: number; y: number }) => {
      updateTicketPosition(ticket.id, { x: data.x, y: data.y });
    },
    [updateTicketPosition, ticket.id]
  );

  const handleMouseDown = useCallback(() => {
    focusTicket(ticket.id);
  }, [focusTicket, ticket.id]);

  const handleClose = useCallback(() => {
    if (isDirty) {
      const confirmClose = window.confirm('You have unsaved changes. Are you sure you want to close?');
      if (!confirmClose) return;
    }
    closeTicket(ticket.id);
  }, [closeTicket, ticket.id, isDirty]);

  const handleCancel = useCallback(() => {
    if (isDirty) {
      const confirmClose = window.confirm('You have unsaved changes. Are you sure you want to cancel?');
      if (!confirmClose) return;
    }
    closeTicket(ticket.id);
  }, [closeTicket, ticket.id, isDirty]);

  const handleReset = useCallback(() => {
    const confirmReset = window.confirm('Are you sure you want to reset all fields?');
    if (confirmReset) {
      reset();
    }
  }, [reset]);

  const handleSaveDraft = useCallback(() => {
    console.log('Saving bond trade draft:', values);
    alert('Draft saved');
  }, [values]);

  const handleRouteToCompliance = useCallback(() => {
    console.log('Routing to compliance:', values);
    alert('Routed to compliance for approval');
  }, [values]);

  const handleSubmitClick = useCallback(async () => {
    const success = await handleSubmit();
    if (success) {
      alert('Bond trade submitted successfully!');
      closeTicket(ticket.id);
    }
  }, [handleSubmit, closeTicket, ticket.id]);

  const totalErrorCount = validationErrors.length;
  const totalWarningCount = validationWarnings.length;

  return (
    <Rnd
      default={{
        x: ticket.position.x,
        y: ticket.position.y,
        width: WINDOW_WIDTH,
        height: 'auto',
      }}
      minWidth={WINDOW_MIN_WIDTH}
      minHeight={WINDOW_MIN_HEIGHT}
      bounds="window"
      dragHandleClassName="new-bond-trade__header"
      onDragStart={handleDragStart}
      onDragStop={handleDragStop}
      onMouseDown={handleMouseDown}
      style={{ zIndex: ticket.zIndex }}
      enableResizing={{
        top: false,
        right: true,
        bottom: true,
        left: false,
        topRight: false,
        bottomRight: true,
        bottomLeft: false,
        topLeft: false,
      }}
    >
      <div className="new-bond-trade">
        {/* Header */}
        <div className="new-bond-trade__header">
          <div className="new-bond-trade__header-left">
            <span className="new-bond-trade__icon">FI</span>
            <span className="new-bond-trade__title">New Bond Trade</span>
          </div>
          <div className="new-bond-trade__controls">
            <button
              className="new-bond-trade__control-btn"
              onClick={() => {}}
              aria-label="Minimize"
            >
              <Minus size={14} />
            </button>
            <button
              className="new-bond-trade__control-btn"
              onClick={() => {}}
              aria-label="Maximize"
            >
              <Square size={12} />
            </button>
            <button
              className="new-bond-trade__control-btn new-bond-trade__control-btn--close"
              onClick={handleClose}
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabErrors={tabErrors}
        />

        {/* Content */}
        <div className="new-bond-trade__content">
          {/* Bond Identification Tab */}
          <div className={clsx(
            'new-bond-trade__tab-panel',
            activeTab === 'bond-id' && 'new-bond-trade__tab-panel--active'
          )}>
            <BondIdentificationTab
              values={values}
              errors={errors}
              touched={touched}
              setValue={setValue}
              setTouched={setTouched}
              validateField={validateField}
              onBondSelect={handleBondSelect}
              onQuoteUpdate={handleQuoteUpdate}
            />
          </div>

          {/* Transaction Details Tab */}
          <div className={clsx(
            'new-bond-trade__tab-panel',
            activeTab === 'transaction' && 'new-bond-trade__tab-panel--active'
          )}>
            <TransactionDetailsTab
              values={values}
              errors={errors}
              touched={touched}
              setValue={setValue}
              setTouched={setTouched}
              validateField={validateField}
              onDirectionChange={handleDirectionChange}
              principalValue={principalValue}
            />
          </div>

          {/* Pricing & Yield Tab */}
          <div className={clsx(
            'new-bond-trade__tab-panel',
            activeTab === 'pricing' && 'new-bond-trade__tab-panel--active'
          )}>
            <PricingYieldTab
              values={values}
              errors={errors}
              touched={touched}
              setValue={setValue}
              setTouched={setTouched}
              validateField={validateField}
              principalValue={principalValue}
              accruedInterest={accruedInterest}
              dirtyValue={dirtyValue}
              accruedCalc={accruedCalc}
            />
          </div>

          {/* Parties & Accounts Tab */}
          <div className={clsx(
            'new-bond-trade__tab-panel',
            activeTab === 'parties' && 'new-bond-trade__tab-panel--active'
          )}>
            <PartiesAccountsTab
              values={values}
              errors={errors}
              touched={touched}
              setValue={setValue}
              setTouched={setTouched}
              validateField={validateField}
              netSettlement={netSettlement}
            />
          </div>

          {/* Settlement & Costs Tab */}
          <div className={clsx(
            'new-bond-trade__tab-panel',
            activeTab === 'settlement' && 'new-bond-trade__tab-panel--active'
          )}>
            <SettlementCostsTab
              values={values}
              errors={errors}
              touched={touched}
              setValue={setValue}
              setTouched={setTouched}
              validateField={validateField}
              principalValue={principalValue}
              accruedInterest={accruedInterest}
              dirtyValue={dirtyValue}
              netSettlement={netSettlement}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="new-bond-trade__footer">
          <div className="new-bond-trade__footer-left">
            {/* Validation Status */}
            <div className={clsx(
              'validation-status',
              totalErrorCount > 0 ? 'validation-status--errors' :
              totalWarningCount > 0 ? 'validation-status--warnings' :
              'validation-status--valid'
            )}>
              {totalErrorCount > 0 && (
                <span className="validation-status__item validation-status__item--error">
                  &#9888; {totalErrorCount} validation {totalErrorCount === 1 ? 'error' : 'errors'}
                </span>
              )}
              {totalWarningCount > 0 && (
                <span className="validation-status__item validation-status__item--warning">
                  &#9888; {totalWarningCount} {totalWarningCount === 1 ? 'warning' : 'warnings'}
                </span>
              )}
              {totalErrorCount === 0 && totalWarningCount === 0 && isValid && (
                <span className="validation-status__item validation-status__item--valid">
                  &#10003; Ready to submit
                </span>
              )}
            </div>
          </div>

          <div className="new-bond-trade__footer-right">
            <button
              type="button"
              className="form-btn form-btn--ghost form-btn--md"
              onClick={handleReset}
            >
              Reset
            </button>
            <button
              type="button"
              className="form-btn form-btn--secondary form-btn--md"
              onClick={handleSaveDraft}
            >
              Save Draft
            </button>
            <button
              type="button"
              className="form-btn form-btn--secondary form-btn--md"
              onClick={handleRouteToCompliance}
            >
              Route to Compliance
            </button>
            <button
              type="button"
              className="form-btn form-btn--ghost form-btn--md"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="button"
              className="form-btn form-btn--primary form-btn--md"
              onClick={handleSubmitClick}
              disabled={!isValid}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </Rnd>
  );
};

export default NewBondTradeWindow;
