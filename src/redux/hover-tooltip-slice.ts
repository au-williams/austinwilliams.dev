import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface HoverTooltipState {
  [hoverTooltipId: string]: {
    isHovering: boolean;
  };
}

const initialState: HoverTooltipState = {};

const hoverTooltipSlice = createSlice({
  name: 'hoverTooltip',
  initialState,
  reducers: {
    setIsHovering: {
      reducer: (state, action: PayloadAction<{ hoverTooltipId: string; isHovering: boolean }>) => {
        const { hoverTooltipId, isHovering } = action.payload;
        if (!state[hoverTooltipId]) {
          state[hoverTooltipId] = { isHovering: false };
        }
        state[hoverTooltipId].isHovering = isHovering;
      },
      prepare: (hoverTooltipId: string, isHovering: boolean) => ({
        payload: { hoverTooltipId, isHovering },
      }),
    },
  },
});

export const { setIsHovering } = hoverTooltipSlice.actions;
export default hoverTooltipSlice.reducer;
