// ============================================
// components/layout/AppLayout.tsx
// ============================================

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { DealTicketContainer } from '@/components/trading';
import { useUIStore } from '@/stores';
import { useWebSocket } from '@/hooks';

export const AppLayout: React.FC = () => {
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);
  const { status: wsStatus } = useWebSocket();

  return (
    <div className={`app-layout ${sidebarCollapsed ? 'app-layout--collapsed' : ''}`}>
      <Sidebar />
      <div className="app-layout__main">
        <Header wsStatus={wsStatus} />
        <main className="app-layout__content">
          <Outlet />
        </main>
      </div>
      <DealTicketContainer />
    </div>
  );
};

export default AppLayout;
