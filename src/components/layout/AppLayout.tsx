// ============================================
// components/layout/AppLayout.tsx
// ============================================

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { DealTicketContainer } from '@/components/trading';

export const AppLayout: React.FC = () => {
  // TODO: Get actual portfolio value from API/store
  const totalPortfolioValue = 22000;
  const userInitials = 'FK';

  return (
    <div className="app-layout app-layout--no-sidebar">
      <Header
        totalPortfolioValue={totalPortfolioValue}
        userInitials={userInitials}
      />
      <main className="app-layout__content">
        <Outlet />
      </main>
      <DealTicketContainer />
    </div>
  );
};

export default AppLayout;
