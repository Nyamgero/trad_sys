// ============================================
// App.tsx
// ============================================

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppLayout } from './components/layout/AppLayout';
import { TradingPage } from './pages/TradingPage';
import { PnLPage } from './pages/PnLPage';
import { DailySummaryPage } from './pages/DailySummaryPage';
import './styles/global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5000,
      refetchOnWindowFocus: false,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/trading/equity" replace />} />

            {/* Trading/Positions Routes */}
            <Route path="trading">
              <Route path="equity" element={<TradingPage assetClass="equity" />} />
              <Route path="etf" element={<TradingPage assetClass="etf" />} />
              <Route path="fx" element={<TradingPage assetClass="fx" />} />
              <Route path="bond" element={<TradingPage assetClass="bond" />} />
            </Route>

            {/* P&L Routes */}
            <Route path="pnl">
              <Route index element={<Navigate to="/pnl/equity" replace />} />
              <Route path="equity" element={<PnLPage assetClass="equity" />} />
              <Route path="etf" element={<PnLPage assetClass="etf" />} />
              <Route path="fx" element={<PnLPage assetClass="fx" />} />
              <Route path="bond" element={<PnLPage assetClass="bond" />} />
            </Route>

            {/* Daily Summary */}
            <Route path="summary" element={<DailySummaryPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
