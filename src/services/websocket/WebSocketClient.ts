// ============================================
// services/websocket/WebSocketClient.ts
// ============================================

import type {
  WebSocketMessage,
  WebSocketStatus,
  WebSocketEventHandlers,
  PriceUpdate,
  PositionUpdate,
  AlertMessage,
  SubscriptionRequest,
} from './types';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws';
const RECONNECT_DELAY = 3000;
const HEARTBEAT_INTERVAL = 30000;
const MAX_RECONNECT_ATTEMPTS = 5;

class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private status: WebSocketStatus = 'disconnected';
  private handlers: WebSocketEventHandlers = {};
  private reconnectAttempts = 0;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  private subscriptions: Set<string> = new Set();

  constructor(url: string = WS_URL) {
    this.url = url;
  }

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.setStatus('connecting');

    try {
      this.ws = new WebSocket(this.url);
      this.setupEventListeners();
    } catch (error) {
      this.handleError(error as Error);
    }
  }

  disconnect(): void {
    this.clearTimers();
    this.subscriptions.clear();

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.setStatus('disconnected');
  }

  subscribe(request: SubscriptionRequest): void {
    const key = this.getSubscriptionKey(request);
    this.subscriptions.add(key);

    if (this.isConnected()) {
      this.send({
        type: 'subscribe',
        payload: request,
        timestamp: new Date().toISOString(),
      });
    }
  }

  unsubscribe(request: SubscriptionRequest): void {
    const key = this.getSubscriptionKey(request);
    this.subscriptions.delete(key);

    if (this.isConnected()) {
      this.send({
        type: 'unsubscribe',
        payload: request,
        timestamp: new Date().toISOString(),
      });
    }
  }

  setHandlers(handlers: WebSocketEventHandlers): void {
    this.handlers = { ...this.handlers, ...handlers };
  }

  getStatus(): WebSocketStatus {
    return this.status;
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  private setupEventListeners(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      this.setStatus('connected');
      this.reconnectAttempts = 0;
      this.startHeartbeat();
      this.resubscribe();
    };

    this.ws.onclose = () => {
      this.setStatus('disconnected');
      this.clearTimers();
      this.attemptReconnect();
    };

    this.ws.onerror = (event) => {
      this.handleError(new Error('WebSocket error'));
    };

    this.ws.onmessage = (event) => {
      this.handleMessage(event.data);
    };
  }

  private handleMessage(data: string): void {
    try {
      const message: WebSocketMessage = JSON.parse(data);

      switch (message.type) {
        case 'price':
          this.handlers.onPrice?.(message.payload as PriceUpdate);
          break;
        case 'position':
          this.handlers.onPosition?.(message.payload as PositionUpdate);
          break;
        case 'alert':
          this.handlers.onAlert?.(message.payload as AlertMessage);
          break;
        case 'heartbeat':
          // Heartbeat acknowledged, no action needed
          break;
        default:
          console.warn('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }

  private send(message: WebSocketMessage): void {
    if (this.isConnected() && this.ws) {
      this.ws.send(JSON.stringify(message));
    }
  }

  private setStatus(status: WebSocketStatus): void {
    this.status = status;
    this.handlers.onStatusChange?.(status);
  }

  private handleError(error: Error): void {
    this.setStatus('error');
    this.handlers.onError?.(error);
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      this.handleError(new Error('Max reconnection attempts reached'));
      return;
    }

    this.reconnectAttempts++;
    const delay = RECONNECT_DELAY * Math.pow(2, this.reconnectAttempts - 1);

    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, delay);
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      this.send({
        type: 'heartbeat',
        payload: null,
        timestamp: new Date().toISOString(),
      });
    }, HEARTBEAT_INTERVAL);
  }

  private clearTimers(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private resubscribe(): void {
    this.subscriptions.forEach((key) => {
      const request = this.parseSubscriptionKey(key);
      if (request) {
        this.send({
          type: 'subscribe',
          payload: request,
          timestamp: new Date().toISOString(),
        });
      }
    });
  }

  private getSubscriptionKey(request: SubscriptionRequest): string {
    return JSON.stringify(request);
  }

  private parseSubscriptionKey(key: string): SubscriptionRequest | null {
    try {
      return JSON.parse(key);
    } catch {
      return null;
    }
  }
}

export const wsClient = new WebSocketClient();
export default WebSocketClient;
