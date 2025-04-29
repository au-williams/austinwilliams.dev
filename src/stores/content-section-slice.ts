import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ContentSectionState {
  avatarUrl: string | undefined;
  isArticle1Visible: boolean;
  isArticle2Visible: boolean;
  isHandWaveAnimated: boolean;
  isMailboxAnimatedClosed: boolean;
  isMailboxAnimatedOpened: boolean;
  isMailboxImageOpened: boolean;
  isSectionVisible: boolean;
}

const initialState: ContentSectionState = {
  avatarUrl: undefined,
  isArticle1Visible: false,
  isArticle2Visible: false,
  isHandWaveAnimated: false,
  isMailboxAnimatedClosed: false,
  isMailboxAnimatedOpened: false,
  isMailboxImageOpened: false,
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
    setIsMailboxAnimatedClosed: (state, action: PayloadAction<boolean>) => {
      state.isMailboxAnimatedClosed = action.payload;
    },
    setIsMailboxAnimatedOpened: (state, action: PayloadAction<boolean>) => {
      state.isMailboxAnimatedOpened = action.payload;
    },
    setIsMailboxImageOpened: (state, action: PayloadAction<boolean>) => {
      state.isMailboxImageOpened = action.payload;
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
  setIsMailboxAnimatedClosed,
  setIsMailboxAnimatedOpened,
  setIsMailboxImageOpened,
  setIsSectionVisible
} = contentSectionSlice.actions;

export default contentSectionSlice.reducer;
