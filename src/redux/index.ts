import { configureStore } from '@reduxjs/toolkit';
import aboutButtonReducer from './about-button-slice';
import codeBlockReducer from './code-block-slice';
import codeWindowReducer from './code-window-slice';
import contentSectionReducer from './content-section-slice';
import hoverTooltipReducer from './hover-tooltip-slice';
import redirectPopupSlice from './redirect-popup-slice';

export const store = configureStore({
  reducer: {
    aboutButton: aboutButtonReducer,
    codeBlock: codeBlockReducer,
    codeWindow: codeWindowReducer,
    contentSection: contentSectionReducer,
    hoverTooltip: hoverTooltipReducer,
    redirectPopup: redirectPopupSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
