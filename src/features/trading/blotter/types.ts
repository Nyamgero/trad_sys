// ============================================
// features/trading/blotter/types.ts
// ============================================

export type TransactionSide = 'BUY' | 'SELL';
export type TransactionStatus = 'FILLED' | 'PARTIAL' | 'PENDING' | 'CANCELLED';

export interface Transaction {
  id: string;
  timestamp: string;
  symbol: string;
  name: string;
  side: TransactionSide;
  quantity: number;
  filledQty: number;
  price: number;
  avgPrice: number;
  value: number;
  commission: number;
  status: TransactionStatus;
  orderId: string;
  account: string;
  exchange: string;
}

export interface BlotterFilters {
  symbol?: string;
  side?: TransactionSide | 'ALL';
  status?: TransactionStatus | 'ALL';
  dateFrom?: string;
  dateTo?: string;
}

export interface BlotterSummary {
  totalTransactions: number;
  buyCount: number;
  sellCount: number;
  totalVolume: number;
  totalValue: number;
  totalCommissions: number;
}
