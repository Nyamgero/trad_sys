// ============================================
// stores/dealTicketStore.ts - Deal Ticket State Management
// ============================================

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { DealTicket, OpenTicketConfig, TicketPosition } from '@/types/dealTicket';

const TICKET_OFFSET = 30;
const INITIAL_X = 100;
const INITIAL_Y = 100;

interface DealTicketState {
  tickets: DealTicket[];
  maxZIndex: number;

  // Actions
  openTicket: (config: OpenTicketConfig) => string;
  closeTicket: (id: string) => void;
  focusTicket: (id: string) => void;
  updateTicketData: (id: string, data: Record<string, unknown>) => void;
  updateTicketPosition: (id: string, position: TicketPosition) => void;
  closeAllTickets: () => void;
}

const calculateNewPosition = (existingTickets: DealTicket[]): TicketPosition => {
  const offset = existingTickets.length * TICKET_OFFSET;
  return {
    x: INITIAL_X + offset,
    y: INITIAL_Y + offset,
  };
};

export const useDealTicketStore = create<DealTicketState>()(
  devtools(
    (set, get) => ({
      tickets: [],
      maxZIndex: 1000,

      openTicket: (config) => {
        const id = crypto.randomUUID();
        const { tickets, maxZIndex } = get();
        const position = calculateNewPosition(tickets);

        const newTicket: DealTicket = {
          id,
          type: config.type,
          subType: config.subType,
          position,
          zIndex: maxZIndex + 1,
          data: config.initialData || {},
        };

        set({
          tickets: [...tickets, newTicket],
          maxZIndex: maxZIndex + 1,
        });

        return id;
      },

      closeTicket: (id) => {
        set((state) => ({
          tickets: state.tickets.filter((t) => t.id !== id),
        }));
      },

      focusTicket: (id) => {
        const { tickets, maxZIndex } = get();
        const ticket = tickets.find((t) => t.id === id);

        if (ticket && ticket.zIndex < maxZIndex) {
          set({
            tickets: tickets.map((t) =>
              t.id === id ? { ...t, zIndex: maxZIndex + 1 } : t
            ),
            maxZIndex: maxZIndex + 1,
          });
        }
      },

      updateTicketData: (id, data) => {
        set((state) => ({
          tickets: state.tickets.map((t) =>
            t.id === id ? { ...t, data: { ...t.data, ...data } } : t
          ),
        }));
      },

      updateTicketPosition: (id, position) => {
        set((state) => ({
          tickets: state.tickets.map((t) =>
            t.id === id ? { ...t, position } : t
          ),
        }));
      },

      closeAllTickets: () => {
        set({ tickets: [], maxZIndex: 1000 });
      },
    }),
    { name: 'deal-ticket-store' }
  )
);
