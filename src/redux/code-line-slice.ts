import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CodeLineState {
  [codeLineId: string]: {
    isHovered: boolean;
  };
}

const initialState: CodeLineState = {};

const codeLineSlice = createSlice({
  name: 'codeLine',
  initialState,
  reducers: {
    setIsHovered: {
      reducer: (state, action: PayloadAction<{ codeLineId: string; isHovered: boolean }>) => {
        const { codeLineId, isHovered } = action.payload;
        if (!state[codeLineId]) {
          state[codeLineId] = { isHovered: false };
        }
        state[codeLineId].isHovered = isHovered;
      },
      prepare: (codeLineId: string, isHovered: boolean) => ({
        payload: { codeLineId, isHovered },
      }),
    },
  },
});

export const { setIsHovered } = codeLineSlice.actions;
export default codeLineSlice.reducer;
