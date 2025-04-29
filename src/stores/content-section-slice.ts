import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ContentSectionState {
  avatarUrl: string | undefined;
  isArticle1Visible: boolean;
  isArticle2Visible: boolean;
  isHandWaveAnimated: boolean;
  isSectionVisible: boolean;
}

const initialState: ContentSectionState = {
  avatarUrl: undefined,
  isArticle1Visible: false,
  isArticle2Visible: false,
  isHandWaveAnimated: false,
  isSectionVisible: false
};

const contentSectionSlice = createSlice({
  name: 'contentSection',
  initialState,
  reducers: {
    setAvatarUrl: (state, action: PayloadAction<string|undefined>) => {
      state.avatarUrl = action.payload;
    },
    setIsArticle1Visible: (state, action: PayloadAction<boolean>) => {
      state.isArticle1Visible = action.payload;
    },
    setIsArticle2Visible: (state, action: PayloadAction<boolean>) => {
      state.isArticle2Visible = action.payload;
    },
    setIsHandWaveAnimated: (state, action: PayloadAction<boolean>) => {
      state.isHandWaveAnimated = action.payload;
    },
    setIsSectionVisible: (state, action: PayloadAction<boolean>) => {
      state.isSectionVisible = action.payload;
    }
  },
});

export const {
  setAvatarUrl,
  setIsArticle1Visible,
  setIsArticle2Visible,
  setIsHandWaveAnimated,
  setIsSectionVisible
} = contentSectionSlice.actions;

export default contentSectionSlice.reducer;
