import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice.js';
import coursesSlice from './slices/coursesSlice.js';
import uiSlice from './slices/uiSlice.js';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    courses: coursesSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
