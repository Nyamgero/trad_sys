// ============================================
// components/trading/TradingToolbar.tsx
// ============================================

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useDealTicketStore } from '@/stores/dealTicketStore';
import type { OpenTicketConfig } from '@/types/dealTicket';

interface DropdownItem {
  label: string;
  config: OpenTicketConfig;
}

interface ToolbarItem {
  label: string;
  config?: OpenTicketConfig;
  dropdown?: DropdownItem[];
}

const toolbarItems: ToolbarItem[] = [
  {
    label: 'Equities',
    config: { type: 'equity' },
  },
  {
    label: 'FX',
    dropdown: [
      { label: 'Spot', config: { type: 'fx', subType: 'spot' } },
      { label: 'Forward', config: { type: 'fx', subType: 'forward' } },
    ],
  },
  {
    label: 'Fixed Income',
    dropdown: [
      { label: 'Bonds', config: { type: 'fixed-income', subType: 'bonds' } },
    ],
  },
  {
    label: 'ETFs',
    config: { type: 'etf' },
  },
  {
    label: 'MM',
    config: { type: 'mm' },
  },
];

export const TradingToolbar: React.FC = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const openTicket = useDealTicketStore((state) => state.openTicket);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (item: ToolbarItem) => {
    if (item.dropdown) {
      setOpenDropdown(openDropdown === item.label ? null : item.label);
    } else if (item.config) {
      openTicket(item.config);
      setOpenDropdown(null);
    }
  };

  const handleDropdownItemClick = (config: OpenTicketConfig) => {
    openTicket(config);
    setOpenDropdown(null);
  };

  return (
    <div className="trading-toolbar" ref={dropdownRef}>
      {toolbarItems.map((item) => (
        <div key={item.label} className="trading-toolbar__item">
          <button
            className="trading-toolbar__btn"
            onClick={() => handleItemClick(item)}
            aria-expanded={item.dropdown ? openDropdown === item.label : undefined}
            aria-haspopup={item.dropdown ? 'true' : undefined}
          >
            {item.label}
            {item.dropdown && <ChevronDown className="trading-toolbar__chevron" />}
          </button>

          {item.dropdown && openDropdown === item.label && (
            <div className="trading-toolbar__dropdown">
              {item.dropdown.map((dropdownItem) => (
                <button
                  key={dropdownItem.label}
                  className="trading-toolbar__dropdown-item"
                  onClick={() => handleDropdownItemClick(dropdownItem.config)}
                >
                  {dropdownItem.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TradingToolbar;
