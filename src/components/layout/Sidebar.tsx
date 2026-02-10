// ============================================
// components/layout/Sidebar.tsx
// ============================================

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUIStore } from '@/stores';

interface NavItem {
  label: string;
  path: string;
  icon?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Positions',
    items: [
      { label: 'Equity', path: '/trading/equity' },
      { label: 'ETF', path: '/trading/etf' },
      { label: 'FX', path: '/trading/fx' },
      { label: 'Bond', path: '/trading/bond' },
    ],
  },
  {
    title: 'P&L',
    items: [
      { label: 'Equity P&L', path: '/pnl/equity' },
      { label: 'ETF P&L', path: '/pnl/etf' },
      { label: 'FX P&L', path: '/pnl/fx' },
      { label: 'Bond P&L', path: '/pnl/bond' },
    ],
  },
  {
    title: 'Reports',
    items: [
      { label: 'Daily Summary', path: '/summary' },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  return (
    <aside className={`sidebar ${sidebarCollapsed ? 'sidebar--collapsed' : ''}`}>
      <div className="sidebar__header">
        <h1 className="sidebar__logo">
          {sidebarCollapsed ? 'TS' : 'Trading System'}
        </h1>
        <button
          className="sidebar__toggle"
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="sidebar__nav">
        {NAV_GROUPS.map((group) => (
          <div key={group.title} className="sidebar__group">
            {!sidebarCollapsed && (
              <h2 className="sidebar__group-title">{group.title}</h2>
            )}
            <ul className="sidebar__list">
              {group.items.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
                    }
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <span className="sidebar__link-text">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
