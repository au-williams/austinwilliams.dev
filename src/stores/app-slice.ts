import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  avatarUrl: string | undefined;
}

const initialState: AppState = {
  avatarUrl: undefined
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAvatarUrl: (state, action: PayloadAction<string|undefined>) => {
      state.avatarUrl = action.payload;
    }
  },
});

export const { setAvatarUrl } = appSlice.actions;
export default appSlice.reducer;
