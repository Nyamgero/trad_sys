// ============================================
// lib/theme.ts - Theme constants
// ============================================

export const COLORS = {
  pnl: {
    positive: '#10B981',  // Green
    negative: '#EF4444',  // Red
    neutral: '#6B7280',   // Gray
  },
  alert: {
    high: '#DC2626',      // Red
    medium: '#F59E0B',    // Amber
    low: '#3B82F6',       // Blue
    ok: '#10B981',        // Green
  },
  assetClass: {
    equity: '#3b82f6',    // Blue
    etf: '#8b5cf6',       // Purple
    fx: '#10b981',        // Green
    bond: '#f59e0b',      // Amber
  },
  background: {
    row: {
      default: 'transparent',
      hover: 'rgba(0, 0, 0, 0.02)',
      selected: 'rgba(59, 130, 246, 0.08)',
      expanded: 'rgba(0, 0, 0, 0.01)',
    },
  },
} as const;

export const REFRESH_INTERVALS = {
  equity: {
    tradingHours: 1000,     // 1 second
    afterHours: 900000,     // 15 minutes
  },
  etf: {
    tradingHours: 1000,
    afterHours: 900000,
  },
  fx: {
    tradingHours: 500,      // 500ms
    afterHours: 300000,     // 5 minutes
  },
  bond: {
    tradingHours: 30000,    // 30 seconds
    afterHours: 86400000,   // Daily
  },
  pnl: 5000,                // 5 seconds
  riskMetrics: 60000,       // 1 minute
} as const;
