// ============================================
// components/trading/DealTicketPopup.tsx
// ============================================

import React, { useCallback, useState } from 'react';
import { Rnd } from 'react-rnd';
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

const TICKET_WIDTH = 420;
const TICKET_MIN_WIDTH = 350;
const TICKET_MIN_HEIGHT = 300;

export const DealTicketPopup: React.FC<DealTicketPopupProps> = ({
  ticket,
  title,
  children,
  onSave,
  onCancel,
  saveDisabled = false,
  saveLabel = 'Submit Order',
}) => {
  const { focusTicket, closeTicket, updateTicketPosition } = useDealTicketStore();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
    focusTicket(ticket.id);
  }, [focusTicket, ticket.id]);

  const handleDragStop = useCallback(
    (_e: unknown, data: { x: number; y: number }) => {
      setIsDragging(false);
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
    <Rnd
      default={{
        x: ticket.position.x,
        y: ticket.position.y,
        width: TICKET_WIDTH,
        height: 'auto',
      }}
      minWidth={TICKET_MIN_WIDTH}
      minHeight={TICKET_MIN_HEIGHT}
      bounds="window"
      dragHandleClassName="deal-ticket__header"
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
      <div className={`deal-ticket ${isDragging ? 'deal-ticket--dragging' : ''}`}>
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
    </Rnd>
  );
};

export default DealTicketPopup;
