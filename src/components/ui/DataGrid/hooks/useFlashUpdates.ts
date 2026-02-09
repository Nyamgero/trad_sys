// ============================================
// components/ui/DataGrid/hooks/useFlashUpdates.ts
// ============================================

import { useState, useEffect, useRef } from 'react';

interface UseFlashUpdatesOptions<T> {
  data: T[];
  keyField: keyof T;
  enabled: boolean;
  duration: number;
  getUpdateKey?: (row: T) => string;
}

export function useFlashUpdates<T>({
  data,
  keyField,
  enabled,
  duration,
  getUpdateKey,
}: UseFlashUpdatesOptions<T>) {
  const [flashingCells, setFlashingCells] = useState<Set<string>>(new Set());
  const previousDataRef = useRef<Map<string, string>>(new Map());
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    if (!enabled) return;

    const newFlashing = new Set<string>();
    const currentData = new Map<string, string>();

    data.forEach((row) => {
      const rowKey = String(row[keyField]);
      const updateKey = getUpdateKey ? getUpdateKey(row) : JSON.stringify(row);
      currentData.set(rowKey, updateKey);

      const previousKey = previousDataRef.current.get(rowKey);
      if (previousKey && previousKey !== updateKey) {
        newFlashing.add(rowKey);

        // Clear existing timeout
        const existingTimeout = timeoutsRef.current.get(rowKey);
        if (existingTimeout) {
          clearTimeout(existingTimeout);
        }

        // Set new timeout to remove flash
        const timeout = setTimeout(() => {
          setFlashingCells((prev) => {
            const next = new Set(prev);
            next.delete(rowKey);
            return next;
          });
          timeoutsRef.current.delete(rowKey);
        }, duration);

        timeoutsRef.current.set(rowKey, timeout);
      }
    });

    if (newFlashing.size > 0) {
      setFlashingCells((prev) => new Set([...prev, ...newFlashing]));
    }

    previousDataRef.current = currentData;

    return () => {
      timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    };
  }, [data, keyField, enabled, duration, getUpdateKey]);

  return flashingCells;
}
