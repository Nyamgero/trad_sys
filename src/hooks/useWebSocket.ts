// ============================================
// hooks/useWebSocket.ts
// ============================================

import { useEffect, useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { wsClient } from '@/services/websocket';
import type {
  WebSocketStatus,
  PriceUpdate,
  PositionUpdate,
  AlertMessage,
  SubscriptionRequest,
} from '@/services/websocket';
import { EQUITY_QUERY_KEYS } from './queries/useEquityPositions';
import { ETF_QUERY_KEYS } from './queries/useETFPositions';
import { FX_QUERY_KEYS } from './queries/useFXPositions';
import { BOND_QUERY_KEYS } from './queries/useBondPositions';
import { useUIStore } from '@/stores';

export function useWebSocket() {
  const [status, setStatus] = useState<WebSocketStatus>('disconnected');
  const queryClient = useQueryClient();
  const addNotification = useUIStore((state) => state.addNotification);

  const handlePriceUpdate = useCallback(
    (update: PriceUpdate) => {
      const queryKeys = {
        equity: EQUITY_QUERY_KEYS,
        etf: ETF_QUERY_KEYS,
        fx: FX_QUERY_KEYS,
        bond: BOND_QUERY_KEYS,
      };

      const keys = queryKeys[update.assetClass];
      if (keys) {
        queryClient.setQueryData(keys.positionsList(), (old: any) => {
          if (!old?.data?.data) return old;

          const identifierField = update.assetClass === 'bond' ? 'isin' :
            update.assetClass === 'fx' ? 'ccyPair' : 'symbol';

          return {
            ...old,
            data: {
              ...old.data,
              data: old.data.data.map((pos: any) => {
                if (pos[identifierField] === update.identifier) {
                  return {
                    ...pos,
                    lastPrice: update.last,
                    bid: update.bid,
                    ask: update.ask,
                    dayChange: {
                      ...pos.dayChange,
                      absolute: update.change,
                      percent: update.changePercent,
                      direction: update.change > 0 ? 'up' : update.change < 0 ? 'down' : 'unchanged',
                    },
                    updatedAt: {
                      iso: update.timestamp,
                      display: new Date(update.timestamp).toLocaleTimeString(),
                    },
                  };
                }
                return pos;
              }),
            },
          };
        });
      }
    },
    [queryClient]
  );

  const handlePositionUpdate = useCallback(
    (update: PositionUpdate) => {
      // Invalidate queries for the affected asset class
      const queryKeys = {
        equity: EQUITY_QUERY_KEYS,
        etf: ETF_QUERY_KEYS,
        fx: FX_QUERY_KEYS,
        bond: BOND_QUERY_KEYS,
      };

      const keys = queryKeys[update.assetClass];
      if (keys) {
        queryClient.invalidateQueries({ queryKey: keys.position(update.positionId) });
        queryClient.invalidateQueries({ queryKey: keys.summary() });
      }
    },
    [queryClient]
  );

  const handleAlert = useCallback(
    (alert: AlertMessage) => {
      addNotification({
        type: alert.severity === 'error' ? 'error' :
              alert.severity === 'warning' ? 'warning' : 'info',
        title: alert.title,
        message: alert.message,
        duration: alert.severity === 'error' ? 0 : 5000,
      });
    },
    [addNotification]
  );

  const connect = useCallback(() => {
    wsClient.setHandlers({
      onPrice: handlePriceUpdate,
      onPosition: handlePositionUpdate,
      onAlert: handleAlert,
      onStatusChange: setStatus,
      onError: (error) => {
        console.error('WebSocket error:', error);
        addNotification({
          type: 'error',
          title: 'Connection Error',
          message: 'Lost connection to real-time data feed',
        });
      },
    });

    wsClient.connect();
  }, [handlePriceUpdate, handlePositionUpdate, handleAlert, addNotification]);

  const disconnect = useCallback(() => {
    wsClient.disconnect();
  }, []);

  const subscribe = useCallback((request: SubscriptionRequest) => {
    wsClient.subscribe(request);
  }, []);

  const unsubscribe = useCallback((request: SubscriptionRequest) => {
    wsClient.unsubscribe(request);
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    status,
    isConnected: status === 'connected',
    connect,
    disconnect,
    subscribe,
    unsubscribe,
  };
}

export default useWebSocket;
