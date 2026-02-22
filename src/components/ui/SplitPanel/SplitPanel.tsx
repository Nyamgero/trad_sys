// ============================================
// components/ui/SplitPanel/SplitPanel.tsx
// ============================================

import React, { useState, useCallback, useRef, useEffect } from 'react';
import './SplitPanel.css';

interface SplitPanelProps {
  topPanel: React.ReactNode;
  bottomPanel: React.ReactNode;
  defaultTopHeight?: number; // percentage 0-100
  minTopHeight?: number; // percentage
  maxTopHeight?: number; // percentage
  className?: string;
}

export const SplitPanel: React.FC<SplitPanelProps> = ({
  topPanel,
  bottomPanel,
  defaultTopHeight = 60,
  minTopHeight = 20,
  maxTopHeight = 80,
  className = '',
}) => {
  const [topHeight, setTopHeight] = useState(defaultTopHeight);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const newTopHeight =
        ((e.clientY - containerRect.top) / containerRect.height) * 100;

      // Clamp to min/max bounds
      const clampedHeight = Math.min(
        Math.max(newTopHeight, minTopHeight),
        maxTopHeight
      );
      setTopHeight(clampedHeight);
    },
    [isDragging, minTopHeight, maxTopHeight]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'row-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={containerRef}
      className={`split-panel ${isDragging ? 'split-panel--dragging' : ''} ${className}`}
    >
      <div
        className="split-panel__top"
        style={{ height: `${topHeight}%` }}
      >
        {topPanel}
      </div>

      <div
        className="split-panel__divider"
        onMouseDown={handleMouseDown}
      >
        <div className="split-panel__handle" />
      </div>

      <div
        className="split-panel__bottom"
        style={{ height: `calc(${100 - topHeight}% - 8px)` }}
      >
        {bottomPanel}
      </div>
    </div>
  );
};

export default SplitPanel;
