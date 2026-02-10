// ============================================
// components/layout/Header.tsx
// ============================================

import React from 'react';
import { useLocation } from 'react-router-dom';
import type { WebSocketStatus } from '@/services/websocket';

interface HeaderProps {
  wsStatus: WebSocketStatus;
}

const getPageTitle = (pathname: string): string => {
  const segments = pathname.split('/').filter(Boolean);

  if (segments[0] === 'trading') {
    const asset = segments[1]?.toUpperCase() || 'EQUITY';
    return `${asset} Positions`;
  }

  if (segments[0] === 'pnl') {
    const asset = segments[1]?.toUpperCase() || 'EQUITY';
    return `${asset} P&L`;
  }

  if (segments[0] === 'summary') {
    return 'Daily Summary';
  }

  return 'Trading System';
};

const getStatusColor = (status: WebSocketStatus): string => {
  switch (status) {
    case 'connected':
      return 'var(--color-positive, #10b981)';
    case 'connecting':
      return 'var(--color-warning, #f59e0b)';
    case 'error':
      return 'var(--color-negative, #ef4444)';
    default:
      return 'var(--text-secondary, #6b7280)';
  }
};

export const Header: React.FC<HeaderProps> = ({ wsStatus }) => {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);
  const currentTime = new Date().toLocaleTimeString();

  return (
    <header className="header">
      <div className="header__left">
        <h1 className="header__title">{pageTitle}</h1>
      </div>

      <div className="header__right">
        <div className="header__status">
          <span
            className="header__status-dot"
            style={{ backgroundColor: getStatusColor(wsStatus) }}
          />
          <span className="header__status-text">
            {wsStatus === 'connected' ? 'Live' : wsStatus}
          </span>
        </div>

        <div className="header__time">{currentTime}</div>
      </div>
    </header>
  );
};

export default Header;
