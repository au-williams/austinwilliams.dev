import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import variables from '../styles/_variables.module.scss';

interface AboutButtonState {
  arrowDuration: string,
  arrowOpacity: string,
  arrowTransform: string,
  intervalId: NodeJS.Timeout|undefined,
  isHidden: boolean,
  isHovered: boolean,
}

const initialState: AboutButtonState = {
  arrowDuration: "",
  arrowOpacity: variables.aboutButtonArrowOpacityMinimum,
  arrowTransform: 'translateY(0)',
  intervalId: undefined,
  isHidden: true,
  isHovered: false,
};

const codeWindowSlice = createSlice({
  name: 'codeWindow',
  initialState,
  reducers: {
    setAboutButtonArrowDuration: (state, action: PayloadAction<string>) => {
      state.arrowDuration = action.payload;
    },
    setAboutButtonArrowOpacity: (state, action: PayloadAction<string>) => {
      state.arrowOpacity = action.payload;
    },
    setAboutButtonArrowTransform: (state, action: PayloadAction<string>) => {
      state.arrowTransform = action.payload;
    },
    setAboutButtonIntervalId: (state, action: PayloadAction<NodeJS.Timeout>) => {
      state.intervalId = action.payload;
    },
    setAboutButtonIsHidden: (state, action: PayloadAction<boolean>) => {
      state.isHidden = action.payload;
    },
    setAboutButtonIsHovering: (state, action: PayloadAction<boolean>) => {
      state.isHovered = action.payload;
    }
  },
});

export const {
  setAboutButtonArrowDuration,
  setAboutButtonArrowOpacity,
  setAboutButtonArrowTransform,
  setAboutButtonIntervalId,
  setAboutButtonIsHidden,
  setAboutButtonIsHovering,
} = codeWindowSlice.actions;

export default codeWindowSlice.reducer;