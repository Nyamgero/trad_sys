// ============================================
// NewBondTradeWindow/components/BondAutocomplete.tsx
// ============================================

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import { mockBonds } from '@/mocks/bondReferenceData';
import type { BondInstrument } from '../types';

interface BondAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (bond: BondInstrument) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

export const BondAutocomplete: React.FC<BondAutocompleteProps> = ({
  value,
  onChange,
  onSelect,
  placeholder = 'Enter ISIN or CUSIP...',
  error,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<BondInstrument[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Search function with debounce
  const searchBonds = useCallback((query: string) => {
    const cleanQuery = query.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (cleanQuery.length < 3) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    // Search in mock data
    const filtered = mockBonds.filter(
      (bond) =>
        bond.isin.includes(cleanQuery) ||
        (bond.cusip && bond.cusip.includes(cleanQuery)) ||
        bond.description.toUpperCase().includes(cleanQuery) ||
        bond.issuer.toUpperCase().includes(cleanQuery)
    );

    setResults(filtered.slice(0, 10));
    setIsOpen(filtered.length > 0);
    setHighlightedIndex(0);
  }, []);

  // Handle input change with debounce
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      onChange(newValue);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        searchBonds(newValue);
      }, 300);
    },
    [onChange, searchBonds]
  );

  // Handle selection
  const handleSelect = useCallback(
    (bond: BondInstrument) => {
      onChange(bond.isin);
      onSelect(bond);
      setIsOpen(false);
      setResults([]);
    },
    [onChange, onSelect]
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (results[highlightedIndex]) {
            handleSelect(results[highlightedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          break;
      }
    },
    [isOpen, results, highlightedIndex, handleSelect]
  );

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className="bond-autocomplete">
      <div className="bond-autocomplete__input-wrapper">
        <Search className="bond-autocomplete__icon" size={16} />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => value.length >= 3 && searchBonds(value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`bond-autocomplete__input ${error ? 'bond-autocomplete__input--error' : ''}`}
          autoComplete="off"
        />
      </div>

      {isOpen && results.length > 0 && (
        <div ref={dropdownRef} className="bond-autocomplete__dropdown">
          {results.map((bond, index) => (
            <button
              key={bond.isin}
              type="button"
              className={`bond-autocomplete__option ${
                index === highlightedIndex ? 'bond-autocomplete__option--highlighted' : ''
              }`}
              onClick={() => handleSelect(bond)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              <div className="bond-autocomplete__option-main">
                <span className="bond-autocomplete__option-isin">{bond.isin}</span>
                <span className="bond-autocomplete__option-rating">{bond.creditRating?.split(' ')[0]}</span>
              </div>
              <div className="bond-autocomplete__option-desc">{bond.description}</div>
              <div className="bond-autocomplete__option-details">
                <span>{bond.currency}</span>
                <span>Coupon: {bond.couponRate}%</span>
                <span>Mat: {bond.maturityDate}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {error && <span className="bond-autocomplete__error">{error}</span>}
    </div>
  );
};

export default BondAutocomplete;
