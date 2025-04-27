import { configureStore } from '@reduxjs/toolkit';
import appReducer from './app-slice';
import codeWindowReducer from './code-window-slice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    codeWindow: codeWindowReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
