// ============================================
// NewEquityTradeWindow/components/TabNavigation.tsx
// ============================================

import React from 'react';
import clsx from 'clsx';
import { TABS, type TabId } from '../types';

interface TabNavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  tabErrors: Record<TabId, number>;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  tabErrors,
}) => {
  return (
    <div className="new-trade-tabs">
      {TABS.map((tab) => {
        const errorCount = tabErrors[tab.id];
        const hasErrors = errorCount > 0;

        return (
          <button
            key={tab.id}
            type="button"
            className={clsx(
              'new-trade-tabs__tab',
              activeTab === tab.id && 'new-trade-tabs__tab--active',
              hasErrors && 'new-trade-tabs__tab--error'
            )}
            onClick={() => onTabChange(tab.id)}
            title={tab.shortcut}
          >
            <span className="new-trade-tabs__label">{tab.label}</span>
            {hasErrors && (
              <span className="new-trade-tabs__error-badge">{errorCount}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default TabNavigation;
