import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CodeWindowState {
  isCodeWindowLoaded: boolean;
  isCodeWindowHovered: boolean;
}

const initialState: CodeWindowState = {
  isCodeWindowLoaded: false,
  isCodeWindowHovered: false,
};

const codeWindowSlice = createSlice({
  name: 'codeWindow',
  initialState,
  reducers: {
    setIsCodeWindowLoaded: (state, action: PayloadAction<boolean>) => {
      state.isCodeWindowLoaded = action.payload;
    },
    setIsCodeWindowHovered: (state, action: PayloadAction<boolean>) => {
      state.isCodeWindowHovered = action.payload;
    },
  },
});

export const { setIsCodeWindowLoaded, setIsCodeWindowHovered } = codeWindowSlice.actions;
export default codeWindowSlice.reducer;