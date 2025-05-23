import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RedirectPopupSlice {
  isCopyable: boolean;
  isRedirecting: boolean;
  isVisible: boolean;
}

const initialState: RedirectPopupSlice = {
  isCopyable: true,
  isRedirecting: false,
  isVisible: false,
};

const redirectPopupSlice = createSlice({
  name: 'redirectPopup',
  initialState,
  reducers: {
    setIsCopyable: (state, action: PayloadAction<boolean>) => {
      state.isCopyable = action.payload;
    },
    setIsRedirecting: (state, action: PayloadAction<boolean>) => {
      state.isRedirecting = action.payload;
    },
    setIsVisible: (state, action: PayloadAction<boolean>) => {
      state.isVisible = action.payload;
    },
  },
});

export const {
  setIsCopyable,
  setIsRedirecting,
  setIsVisible,
} = redirectPopupSlice.actions;

export default redirectPopupSlice.reducer;
