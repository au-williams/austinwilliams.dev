import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ContentSectionState {
  avatarUrl: string | undefined;
  isVisible: boolean
}

const initialState: ContentSectionState = {
  avatarUrl: undefined,
  isVisible: false
};

const contentSectionSlice = createSlice({
  name: 'contentSection',
  initialState,
  reducers: {
    setAvatarUrl: (state, action: PayloadAction<string|undefined>) => {
      state.avatarUrl = action.payload;
    },
    setIsSectionVisible: (state, action: PayloadAction<boolean>) => {
      state.isVisible = action.payload;
    }
  },
});

export const { setAvatarUrl, setIsSectionVisible } = contentSectionSlice.actions;
export default contentSectionSlice.reducer;
