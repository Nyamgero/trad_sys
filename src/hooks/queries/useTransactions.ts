// ============================================
// hooks/queries/useTransactions.ts
// ============================================

import { useQuery } from '@tanstack/react-query';
import type { Transaction, BlotterSummary } from '@/features/trading/blotter/types';

// Generate mock transactions
const generateMockTransactions = (): Transaction[] => {
  const symbols = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corp' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corp' },
    { symbol: 'META', name: 'Meta Platforms' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'JPM', name: 'JPMorgan Chase' },
  ];

  const statuses: Transaction['status'][] = ['FILLED', 'FILLED', 'FILLED', 'PARTIAL', 'PENDING'];
  const sides: Transaction['side'][] = ['BUY', 'SELL'];
  const accounts = ['MAIN-001', 'MAIN-002', 'HEDGE-001'];
  const exchanges = ['NYSE', 'NASDAQ', 'ARCA'];

  const transactions: Transaction[] = [];
  const now = new Date();

  for (let i = 0; i < 50; i++) {
    const symbolData = symbols[Math.floor(Math.random() * symbols.length)];
    const side = sides[Math.floor(Math.random() * sides.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const quantity = Math.floor(Math.random() * 500 + 50) * 10;
    const filledQty = status === 'FILLED' ? quantity :
                      status === 'PARTIAL' ? Math.floor(quantity * (0.3 + Math.random() * 0.6)) : 0;
    const price = Math.round((50 + Math.random() * 450) * 100) / 100;
    const avgPrice = status === 'PENDING' ? 0 : Math.round(price * (0.998 + Math.random() * 0.004) * 100) / 100;
    const value = Math.round(filledQty * avgPrice * 100) / 100;
    const commission = Math.round(value * 0.0001 * 100) / 100;

    // Generate timestamp within last 8 hours
    const timestamp = new Date(now.getTime() - Math.random() * 8 * 60 * 60 * 1000);

    transactions.push({
      id: `TXN-${String(i + 1).padStart(6, '0')}`,
      timestamp: timestamp.toISOString(),
      symbol: symbolData.symbol,
      name: symbolData.name,
      side,
      quantity,
      filledQty,
      price,
      avgPrice,
      value,
      commission,
      status,
      orderId: `ORD-${String(Math.floor(Math.random() * 1000000)).padStart(8, '0')}`,
      account: accounts[Math.floor(Math.random() * accounts.length)],
      exchange: exchanges[Math.floor(Math.random() * exchanges.length)],
    });
  }

  // Sort by timestamp descending (most recent first)
  return transactions.sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

const mockTransactions = generateMockTransactions();

const calculateSummary = (transactions: Transaction[]): BlotterSummary => {
  const buyTxns = transactions.filter(t => t.side === 'BUY');
  const sellTxns = transactions.filter(t => t.side === 'SELL');

  return {
    totalTransactions: transactions.length,
    buyCount: buyTxns.length,
    sellCount: sellTxns.length,
    totalVolume: transactions.reduce((sum, t) => sum + t.filledQty, 0),
    totalValue: transactions.reduce((sum, t) => sum + t.value, 0),
    totalCommissions: transactions.reduce((sum, t) => sum + t.commission, 0),
  };
};

export const useTransactions = () => {
  return useQuery({
    queryKey: ['transactions', 'equity'],
    queryFn: async (): Promise<Transaction[]> => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockTransactions;
    },
    staleTime: 30000,
    refetchInterval: 30000,
  });
};

export const useTransactionsSummary = () => {
  return useQuery({
    queryKey: ['transactions', 'equity', 'summary'],
    queryFn: async (): Promise<BlotterSummary> => {
      await new Promise(resolve => setTimeout(resolve, 200));
      return calculateSummary(mockTransactions);
    },
    staleTime: 30000,
  });
};
