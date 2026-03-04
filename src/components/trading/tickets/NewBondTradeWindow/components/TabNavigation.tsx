// ============================================
// NewBondTradeWindow/components/TabNavigation.tsx
// ============================================

import React from 'react';
import clsx from 'clsx';
import { BOND_TABS, type BondTabId } from '../types';

interface TabNavigationProps {
  activeTab: BondTabId;
  onTabChange: (tab: BondTabId) => void;
  tabErrors: Record<BondTabId, number>;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  tabErrors,
}) => {
  return (
    <div className="new-bond-trade__tabs">
      {BOND_TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={clsx(
            'new-bond-trade__tab',
            activeTab === tab.id && 'new-bond-trade__tab--active',
            tabErrors[tab.id] > 0 && 'new-bond-trade__tab--error'
          )}
          onClick={() => onTabChange(tab.id)}
          title={tab.shortcut}
        >
          <span className="new-bond-trade__tab-label">{tab.label}</span>
          {tabErrors[tab.id] > 0 && (
            <span className="new-bond-trade__tab-error-badge">
              {tabErrors[tab.id]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
