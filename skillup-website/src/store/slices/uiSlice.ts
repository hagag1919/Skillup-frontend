import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  modals: {
    loginModal: boolean;
    registerModal: boolean;
    courseModal: boolean;
    moduleModal: boolean;
    lessonModal: boolean;
    deleteConfirmModal: boolean;
  };
  loading: {
    global: boolean;
    page: boolean;
    form: boolean;
  };
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    duration?: number;
    timestamp: number;
  }>;
  breadcrumbs: Array<{
    label: string;
    href?: string;
  }>;
}

const initialState: UIState = {
  sidebarOpen: false,
  theme: 'light',
  modals: {
    loginModal: false,
    registerModal: false,
    courseModal: false,
    moduleModal: false,
    lessonModal: false,
    deleteConfirmModal: false,
  },
  loading: {
    global: false,
    page: false,
    form: false,
  },
  notifications: [],
  breadcrumbs: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    openModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      state.modals[action.payload] = false;
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach((key) => {
        state.modals[key as keyof UIState['modals']] = false;
      });
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    },
    setPageLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.page = action.payload;
    },
    setFormLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.form = action.payload;
    },
    addNotification: (state, action: PayloadAction<{
      type: 'success' | 'error' | 'warning' | 'info';
      title: string;
      message: string;
      duration?: number;
    }>) => {
      const notification = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        duration: 5000,
        ...action.payload,
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setBreadcrumbs: (state, action: PayloadAction<Array<{ label: string; href?: string }>>) => {
      state.breadcrumbs = action.payload;
    },
    addBreadcrumb: (state, action: PayloadAction<{ label: string; href?: string }>) => {
      state.breadcrumbs.push(action.payload);
    },
    clearBreadcrumbs: (state) => {
      state.breadcrumbs = [];
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  openModal,
  closeModal,
  closeAllModals,
  setGlobalLoading,
  setPageLoading,
  setFormLoading,
  addNotification,
  removeNotification,
  clearNotifications,
  setBreadcrumbs,
  addBreadcrumb,
  clearBreadcrumbs,
} = uiSlice.actions;

export default uiSlice.reducer;
