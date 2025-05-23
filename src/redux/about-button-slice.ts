import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import variables from '@/styles/_variables.module.scss';

interface AboutButtonArrowStyle {
  opacity: string;
  transform: string;
  transitionDuration: string;
}

interface AboutButtonState {
  arrowStyle: AboutButtonArrowStyle;
  isHovering: boolean;
  isVisible: boolean;
}

const initialState: AboutButtonState = {
  arrowStyle: {
    opacity: variables.aboutButtonArrowOpacityMinimum,
    transform: 'translateY(0)',
    transitionDuration: variables.aboutButtonArrowTransitionDuration,
  },
  isHovering: false,
  isVisible: false,
};

const aboutButtonSlice = createSlice({
  name: 'aboutButton',
  initialState,
  reducers: {
    setArrowStyle: (state, action: PayloadAction<AboutButtonArrowStyle>) => {
      state.arrowStyle = action.payload;
    },
    setIsHovering: (state, action: PayloadAction<boolean>) => {
      state.isHovering = action.payload;
    },
    setIsVisible: (state, action: PayloadAction<boolean>) => {
      state.isVisible = action.payload;
    },
  },
});

export const { setArrowStyle, setIsHovering, setIsVisible } = aboutButtonSlice.actions;

export default aboutButtonSlice.reducer;
