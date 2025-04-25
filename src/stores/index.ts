import { configureStore } from '@reduxjs/toolkit';
import codeWindowReducer from './code-window-slice';

export const store = configureStore({
  reducer: {
    codeWindow: codeWindowReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;