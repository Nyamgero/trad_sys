// ============================================
// components/trading/DealTicketPopup.tsx
// ============================================

import React, { useRef, useCallback } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { X } from 'lucide-react';
import { useDealTicketStore } from '@/stores/dealTicketStore';
import type { DealTicket, TicketType } from '@/types/dealTicket';

interface DealTicketPopupProps {
  ticket: DealTicket;
  title: string;
  children: React.ReactNode;
  onSave: () => void;
  onCancel: () => void;
  saveDisabled?: boolean;
  saveLabel?: string;
}

const getIconLabel = (type: TicketType, subType?: string): string => {
  switch (type) {
    case 'equity':
      return 'EQ';
    case 'fx':
      return subType === 'forward' ? 'FWD' : 'FX';
    case 'fixed-income':
      return 'BD';
    case 'etf':
      return 'ETF';
    case 'mm':
      return 'MM';
    default:
      return 'TKT';
  }
};

export const DealTicketPopup: React.FC<DealTicketPopupProps> = ({
  ticket,
  title,
  children,
  onSave,
  onCancel,
  saveDisabled = false,
  saveLabel = 'Submit Order',
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const { focusTicket, closeTicket, updateTicketPosition } = useDealTicketStore();

  const handleDragStart = useCallback(() => {
    focusTicket(ticket.id);
  }, [focusTicket, ticket.id]);

  const handleDragStop = useCallback(
    (_e: DraggableEvent, data: DraggableData) => {
      updateTicketPosition(ticket.id, { x: data.x, y: data.y });
    },
    [updateTicketPosition, ticket.id]
  );

  const handleMouseDown = useCallback(() => {
    focusTicket(ticket.id);
  }, [focusTicket, ticket.id]);

  const handleClose = useCallback(() => {
    closeTicket(ticket.id);
  }, [closeTicket, ticket.id]);

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".deal-ticket__header"
      defaultPosition={ticket.position}
      bounds="parent"
      onStart={handleDragStart}
      onStop={handleDragStop}
    >
      <div
        ref={nodeRef}
        className="deal-ticket"
        style={{ zIndex: ticket.zIndex }}
        onMouseDown={handleMouseDown}
      >
        <div className="deal-ticket__header">
          <div className="deal-ticket__header-left">
            <span className={`deal-ticket__icon deal-ticket__icon--${ticket.type}`}>
              {getIconLabel(ticket.type, ticket.subType)}
            </span>
            <span className="deal-ticket__title">{title}</span>
          </div>
          <button
            className="deal-ticket__close"
            onClick={handleClose}
            aria-label="Close ticket"
          >
            <X size={16} />
          </button>
        </div>

        <div className="deal-ticket__content">
          {children}
        </div>

        <div className="deal-ticket__footer">
          <button
            className="form-btn form-btn--secondary form-btn--md"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="form-btn form-btn--primary form-btn--md"
            onClick={onSave}
            disabled={saveDisabled}
          >
            {saveLabel}
          </button>
        </div>
      </div>
    </Draggable>
  );
};

export default DealTicketPopup;
