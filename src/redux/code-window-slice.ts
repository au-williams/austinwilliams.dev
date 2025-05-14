import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import styles from '@/components/code-window/code-window.module.scss';

interface CodeWindowState {
  isHovered: boolean;
  isInitialized: boolean;
  nameTransitionDuration: string;
}

const initialState: CodeWindowState = {
  isHovered: false,
  isInitialized: false,
  nameTransitionDuration: styles.codeWindowNameTransitionDurationInitialize,
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
    setNameTransitionDuration: (state, action: PayloadAction<string>) => {
      state.nameTransitionDuration = action.payload;
    },
  },
});

export const { setIsCodeWindowHovered, setIsCodeWindowInitialized, setNameTransitionDuration } =
  codeWindowSlice.actions;

export default codeWindowSlice.reducer;
