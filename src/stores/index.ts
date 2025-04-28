import { configureStore } from '@reduxjs/toolkit';
import aboutButtonReducer from './about-button-slice';
import codeWindowReducer from './code-window-slice';
import contentSectionReducer from './content-section-slice';

export const store = configureStore({
  reducer: {
    aboutButton: aboutButtonReducer,
    codeWindow: codeWindowReducer,
    contentSection: contentSectionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
