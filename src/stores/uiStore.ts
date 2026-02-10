// ============================================
// stores/uiStore.ts
// ============================================

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';
type DetailPanelPosition = 'right' | 'bottom';

interface DetailPanel {
  isOpen: boolean;
  positionId: string | null;
  assetClass: 'equity' | 'etf' | 'fx' | 'bond' | null;
}

interface UIState {
  theme: Theme;
  sidebarCollapsed: boolean;
  detailPanelPosition: DetailPanelPosition;
  detailPanel: DetailPanel;
  isLoading: boolean;
  notifications: Notification[];

  // Actions
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setDetailPanelPosition: (position: DetailPanelPosition) => void;
  openDetailPanel: (positionId: string, assetClass: DetailPanel['assetClass']) => void;
  closeDetailPanel: () => void;
  setLoading: (loading: boolean) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message?: string;
  timestamp: number;
  duration?: number;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set, get) => ({
        theme: 'system',
        sidebarCollapsed: false,
        detailPanelPosition: 'right',
        detailPanel: {
          isOpen: false,
          positionId: null,
          assetClass: null,
        },
        isLoading: false,
        notifications: [],

        setTheme: (theme) => set({ theme }),

        toggleSidebar: () =>
          set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

        setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

        setDetailPanelPosition: (position) =>
          set({ detailPanelPosition: position }),

        openDetailPanel: (positionId, assetClass) =>
          set({
            detailPanel: {
              isOpen: true,
              positionId,
              assetClass,
            },
          }),

        closeDetailPanel: () =>
          set({
            detailPanel: {
              isOpen: false,
              positionId: null,
              assetClass: null,
            },
          }),

        setLoading: (loading) => set({ isLoading: loading }),

        addNotification: (notification) =>
          set((state) => ({
            notifications: [
              ...state.notifications,
              {
                ...notification,
                id: crypto.randomUUID(),
                timestamp: Date.now(),
              },
            ],
          })),

        removeNotification: (id) =>
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          })),

        clearNotifications: () => set({ notifications: [] }),
      }),
      {
        name: 'ui-store',
        partialize: (state) => ({
          theme: state.theme,
          sidebarCollapsed: state.sidebarCollapsed,
          detailPanelPosition: state.detailPanelPosition,
        }),
      }
    ),
    { name: 'ui-store' }
  )
);
