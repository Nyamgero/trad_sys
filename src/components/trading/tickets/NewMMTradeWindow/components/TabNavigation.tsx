// ============================================
// NewMMTradeWindow/components/TabNavigation.tsx
// ============================================

import React from 'react';
import clsx from 'clsx';
import { MM_TABS, type MMTabId } from '../types';

interface TabNavigationProps {
  activeTab: MMTabId;
  onTabChange: (tab: MMTabId) => void;
  tabErrors: Record<MMTabId, number>;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  tabErrors,
}) => {
  return (
    <div className="new-mm-trade__tabs">
      {MM_TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={clsx(
            'new-mm-trade__tab',
            activeTab === tab.id && 'new-mm-trade__tab--active',
            tabErrors[tab.id] > 0 && 'new-mm-trade__tab--error'
          )}
          onClick={() => onTabChange(tab.id)}
          title={tab.shortcut}
        >
          <span className="new-mm-trade__tab-label">{tab.label}</span>
          {tabErrors[tab.id] > 0 && (
            <span className="new-mm-trade__tab-error-badge">
              {tabErrors[tab.id]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
