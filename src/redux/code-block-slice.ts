import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CodeBlockState {
  [blockId: string]: {
    isPushed: boolean;
  };
}

const initialState: CodeBlockState = {};

const codeBlockSlice = createSlice({
  name: 'codeBlock',
  initialState,
  reducers: {
    setIsPushed: {
      reducer: (state, action: PayloadAction<{ blockId: string; isPushed: boolean }>) => {
        const { blockId, isPushed } = action.payload;
        if (!state[blockId]) {
          state[blockId] = { isPushed: false };
        }
        state[blockId].isPushed = isPushed;
      },
      prepare: (blockId: string, isPushed: boolean) => ({
        payload: { blockId, isPushed },
      }),
    },
  },
});

export const { setIsPushed } = codeBlockSlice.actions;
export default codeBlockSlice.reducer;
