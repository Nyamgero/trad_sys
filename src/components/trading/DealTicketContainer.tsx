// ============================================
// components/trading/DealTicketContainer.tsx
// ============================================

import React from 'react';
import { useDealTicketStore } from '@/stores/dealTicketStore';
import { EquityTicket } from './tickets/EquityTicket';
import { FXSpotTicket } from './tickets/FXSpotTicket';
import { FXForwardTicket } from './tickets/FXForwardTicket';
import { BondTicket } from './tickets/BondTicket';
import { ETFTicket } from './tickets/ETFTicket';
import { MMTicket } from './tickets/MMTicket';
import { NewEquityTradeWindow } from './tickets/NewEquityTradeWindow';
import type { DealTicket } from '@/types/dealTicket';

const renderTicket = (ticket: DealTicket) => {
  switch (ticket.type) {
    case 'equity':
      return <EquityTicket key={ticket.id} ticket={ticket} />;
    case 'new-equity-trade':
      return <NewEquityTradeWindow key={ticket.id} ticket={ticket} />;
    case 'fx':
      if (ticket.subType === 'forward') {
        return <FXForwardTicket key={ticket.id} ticket={ticket} />;
      }
      return <FXSpotTicket key={ticket.id} ticket={ticket} />;
    case 'fixed-income':
      return <BondTicket key={ticket.id} ticket={ticket} />;
    case 'etf':
      return <ETFTicket key={ticket.id} ticket={ticket} />;
    case 'mm':
      return <MMTicket key={ticket.id} ticket={ticket} />;
    default:
      return null;
  }
};

export const DealTicketContainer: React.FC = () => {
  const tickets = useDealTicketStore((state) => state.tickets);

  if (tickets.length === 0) {
    return null;
  }

  return (
    <div className="deal-ticket-container">
      {tickets.map(renderTicket)}
    </div>
  );
};

export default DealTicketContainer;
