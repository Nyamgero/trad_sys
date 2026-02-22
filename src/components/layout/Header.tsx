// ============================================
// components/layout/Header.tsx - Trading System Design
// ============================================

import React from 'react';
import { formatCurrency } from '@/lib/formatters';

interface HeaderProps {
  totalPortfolioValue?: number;
  userInitials?: string;
}

export const Header: React.FC<HeaderProps> = ({
  totalPortfolioValue = 22000,
  userInitials = 'FK',
}) => {
  return (
    <header className="app-header">
      <div className="app-header__left">
        <div className="app-header__logo">
          <span className="app-header__logo-icon">T</span>
        </div>
        <div className="app-header__titles">
          <h1 className="app-header__title">Trading System</h1>
          <p className="app-header__subtitle">Portfolio Management Dashboard</p>
        </div>
      </div>

      <div className="app-header__right">
        <div className="app-header__portfolio-value">
          <span className="app-header__portfolio-label">Total Portfolio Value</span>
          <span className="app-header__portfolio-amount">
            {formatCurrency(totalPortfolioValue, 'USD')}
          </span>
        </div>
        <div className="app-header__user">
          <span className="app-header__user-initials">{userInitials}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
