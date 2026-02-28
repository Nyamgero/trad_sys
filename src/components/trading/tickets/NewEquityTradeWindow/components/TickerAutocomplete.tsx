// ============================================
// NewEquityTradeWindow/components/TickerAutocomplete.tsx
// ============================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import clsx from 'clsx';
import { Search } from 'lucide-react';
import { searchSecurities } from '@/services/api/referenceData';
import type { Security } from '../types';

interface TickerAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (security: Security) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
}

export const TickerAutocomplete: React.FC<TickerAutocompleteProps> = ({
  value,
  onChange,
  onSelect,
  onBlur,
  error,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<Security[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Search with debounce
  const handleSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await searchSecurities(query);
      setResults(searchResults);
      setIsOpen(searchResults.length > 0);
      setHighlightedIndex(-1);
    } catch (err) {
      console.error('Security search failed:', err);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle input change with debounce
  const handleInputChange = useCallback((newValue: string) => {
    const upperValue = newValue.toUpperCase();
    onChange(upperValue);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      handleSearch(upperValue);
    }, 300);
  }, [onChange, handleSearch]);

  // Handle selection
  const handleSelect = useCallback((security: Security) => {
    onSelect(security);
    onChange(security.ticker);
    setIsOpen(false);
    setResults([]);
  }, [onSelect, onChange]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && results[highlightedIndex]) {
          handleSelect(results[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  }, [isOpen, results, highlightedIndex, handleSelect]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
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
    <div className="ticker-autocomplete">
      <div className="ticker-autocomplete__input-wrapper">
        <input
          ref={inputRef}
          type="text"
          className={clsx(
            'form-input ticker-autocomplete__input',
            error && 'form-input--error'
          )}
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => value.length >= 2 && results.length > 0 && setIsOpen(true)}
          onBlur={onBlur}
          placeholder="Search ticker..."
          disabled={disabled}
          autoComplete="off"
        />
        <Search
          size={16}
          className={clsx(
            'ticker-autocomplete__icon',
            isLoading && 'ticker-autocomplete__icon--loading'
          )}
        />
      </div>

      {isOpen && results.length > 0 && (
        <div ref={dropdownRef} className="ticker-autocomplete__dropdown">
          {results.map((security, index) => (
            <button
              key={security.isin}
              type="button"
              className={clsx(
                'ticker-autocomplete__option',
                index === highlightedIndex && 'ticker-autocomplete__option--highlighted'
              )}
              onClick={() => handleSelect(security)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              <div className="ticker-autocomplete__option-main">
                <span className="ticker-autocomplete__ticker">{security.ticker}</span>
                <span className="ticker-autocomplete__exchange">{security.primaryExchange}</span>
              </div>
              <div className="ticker-autocomplete__option-name">{security.name}</div>
              <div className="ticker-autocomplete__option-isin">{security.isin}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TickerAutocomplete;
