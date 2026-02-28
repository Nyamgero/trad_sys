// ============================================
// NewEquityTradeWindow/NewEquityTradeWindow.tsx
// ============================================

import React, { useCallback, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { X, Minus, Square } from 'lucide-react';
import clsx from 'clsx';
import { useDealTicketStore } from '@/stores/dealTicketStore';
import { useNewEquityTrade } from './useNewEquityTrade';
import { TabNavigation } from './components/TabNavigation';
import { InstrumentTab } from './tabs/InstrumentTab';
import { TradeDetailsTab } from './tabs/TradeDetailsTab';
import { CostsTab } from './tabs/CostsTab';
import { BookingTab } from './tabs/BookingTab';
import { SettlementTab } from './tabs/SettlementTab';
import type { DealTicket } from '@/types/dealTicket';
import type { TabId } from './types';
import './new-equity-trade.css';

interface NewEquityTradeWindowProps {
  ticket: DealTicket;
}

const WINDOW_WIDTH = 720;
const WINDOW_MIN_WIDTH = 640;
const WINDOW_MIN_HEIGHT = 500;

export const NewEquityTradeWindow: React.FC<NewEquityTradeWindowProps> = ({ ticket }) => {
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
    grossConsideration,
    sttTax,
    netConsideration,
    totalCosts,
    costPercentage,
    reset,
    handleSecuritySelect,
    handleQuoteUpdate,
    handleSideChange,
    handleSubmit,
    validationErrors,
    validationWarnings,
  } = useNewEquityTrade({
    currentUserId: 'trader-001',
    defaultPortfolio: 'MAIN-EQ-001',
  });

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Tab switching: Ctrl+1 through Ctrl+5
      if (e.ctrlKey && e.key >= '1' && e.key <= '5') {
        e.preventDefault();
        const tabIndex = parseInt(e.key, 10) - 1;
        const tabs: TabId[] = ['instrument', 'trade-details', 'costs', 'booking', 'settlement'];
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
    console.log('Saving draft:', values);
    // Would save to local storage or API
    alert('Draft saved');
  }, [values]);

  const handleSubmitClick = useCallback(async () => {
    const success = await handleSubmit();
    if (success) {
      alert('Trade submitted successfully!');
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
      dragHandleClassName="new-equity-trade__header"
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
      <div className="new-equity-trade">
        {/* Header */}
        <div className="new-equity-trade__header">
          <div className="new-equity-trade__header-left">
            <span className="new-equity-trade__icon">EQ</span>
            <span className="new-equity-trade__title">New Trade</span>
          </div>
          <div className="new-equity-trade__controls">
            <button
              className="new-equity-trade__control-btn"
              onClick={() => {}}
              aria-label="Minimize"
            >
              <Minus size={14} />
            </button>
            <button
              className="new-equity-trade__control-btn"
              onClick={() => {}}
              aria-label="Maximize"
            >
              <Square size={12} />
            </button>
            <button
              className="new-equity-trade__control-btn new-equity-trade__control-btn--close"
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
        <div className="new-equity-trade__content">
          {/* Instrument Tab */}
          <div className={clsx(
            'new-equity-trade__tab-panel',
            activeTab === 'instrument' && 'new-equity-trade__tab-panel--active'
          )}>
            <InstrumentTab
              values={values}
              errors={errors}
              touched={touched}
              setValue={setValue}
              setTouched={setTouched}
              validateField={validateField}
              onSecuritySelect={handleSecuritySelect}
              onQuoteUpdate={handleQuoteUpdate}
            />
          </div>

          {/* Trade Details Tab */}
          <div className={clsx(
            'new-equity-trade__tab-panel',
            activeTab === 'trade-details' && 'new-equity-trade__tab-panel--active'
          )}>
            <TradeDetailsTab
              values={values}
              errors={errors}
              touched={touched}
              setValue={setValue}
              setTouched={setTouched}
              validateField={validateField}
              onSideChange={handleSideChange}
              grossConsideration={grossConsideration}
            />
          </div>

          {/* Costs Tab */}
          <div className={clsx(
            'new-equity-trade__tab-panel',
            activeTab === 'costs' && 'new-equity-trade__tab-panel--active'
          )}>
            <CostsTab
              values={values}
              errors={errors}
              touched={touched}
              setValue={setValue}
              setTouched={setTouched}
              validateField={validateField}
              grossConsideration={grossConsideration}
              sttTax={sttTax}
              netConsideration={netConsideration}
              totalCosts={totalCosts}
              costPercentage={costPercentage}
            />
          </div>

          {/* Booking Tab */}
          <div className={clsx(
            'new-equity-trade__tab-panel',
            activeTab === 'booking' && 'new-equity-trade__tab-panel--active'
          )}>
            <BookingTab
              values={values}
              errors={errors}
              touched={touched}
              setValue={setValue}
              setTouched={setTouched}
              validateField={validateField}
            />
          </div>

          {/* Settlement Tab */}
          <div className={clsx(
            'new-equity-trade__tab-panel',
            activeTab === 'settlement' && 'new-equity-trade__tab-panel--active'
          )}>
            <SettlementTab
              values={values}
              errors={errors}
              touched={touched}
              setValue={setValue}
              setTouched={setTouched}
              validateField={validateField}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="new-equity-trade__footer">
          <div className="new-equity-trade__footer-left">
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

          <div className="new-equity-trade__footer-right">
            <button
              type="button"
              className="form-btn form-btn--ghost form-btn--md"
              onClick={handleReset}
            >
              Reset Form
            </button>
            <button
              type="button"
              className="form-btn form-btn--secondary form-btn--md"
              onClick={handleSaveDraft}
            >
              Save as Draft
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
              Submit Trade
            </button>
          </div>
        </div>
      </div>
    </Rnd>
  );
};

export default NewEquityTradeWindow;
