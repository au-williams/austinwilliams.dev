import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CodeWindowState {
  isHovered: boolean;
  isInitialized: boolean;
}

const initialState: CodeWindowState = {
  isHovered: false,
  isInitialized: false,
};

const codeWindowSlice = createSlice({
  name: 'codeWindow',
  initialState,
  reducers: {
    setIsCodeWindowHovered: (state, action: PayloadAction<boolean>) => {
      state.isHovered = action.payload;
    },
    setIsCodeWindowInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
  },
});

export const { setIsCodeWindowHovered, setIsCodeWindowInitialized } = codeWindowSlice.actions;
export default codeWindowSlice.reducer;
