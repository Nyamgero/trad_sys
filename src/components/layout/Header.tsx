// ============================================
// components/layout/Header.tsx - Enhanced
// ============================================

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Settings, Moon, Sun } from 'lucide-react';
import { TradingToolbar } from '@/components/trading';
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

  if (segments[0] === 'liquidity') {
    const asset = segments[1]?.toUpperCase() || 'EQUITY';
    return `${asset} Liquidity`;
  }

  if (segments[0] === 'portfolio') {
    return 'Portfolio Overview';
  }

  if (segments[0] === 'summary') {
    return 'Daily Summary';
  }

  return 'Trading System';
};

const getBreadcrumb = (pathname: string): string[] => {
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return ['Dashboard'];

  return segments.map(s => s.charAt(0).toUpperCase() + s.slice(1));
};

export const Header: React.FC<HeaderProps> = ({ wsStatus }) => {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);
  const breadcrumb = getBreadcrumb(location.pathname);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDark, setIsDark] = useState(false);

  // Update clock every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusClass = () => {
    switch (wsStatus) {
      case 'connected':
        return 'header__status-dot--connected';
      case 'connecting':
        return 'header__status-dot--connecting';
      default:
        return 'header__status-dot--disconnected';
    }
  };

  return (
    <header className="header">
      <div className="header__left">
        <div className="header__breadcrumb">
          {breadcrumb.map((crumb, index) => (
            <React.Fragment key={crumb}>
              {index > 0 && <span className="header__breadcrumb-separator">/</span>}
              <span>{crumb}</span>
            </React.Fragment>
          ))}
        </div>
        <h1 className="header__title">{pageTitle}</h1>
      </div>

      <div className="header__right">
        <TradingToolbar />

        <div className="header__status">
          <span className={`header__status-dot ${getStatusClass()}`} />
          <span className="header__status-text">
            {wsStatus === 'connected' ? 'Live' : wsStatus === 'connecting' ? 'Connecting...' : 'Offline'}
          </span>
        </div>

        <div className="header__time">
          <span style={{ marginRight: '8px', opacity: 0.7 }}>{formatDate(currentTime)}</span>
          <span style={{ fontWeight: 600 }}>{formatTime(currentTime)}</span>
        </div>

        <div className="header__actions">
          <button
            className="header__action-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className="header__action-btn"
            aria-label="Notifications"
            title="Notifications"
          >
            <Bell size={18} />
          </button>
          <button
            className="header__action-btn"
            aria-label="Settings"
            title="Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
