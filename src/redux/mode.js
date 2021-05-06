import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  mode: "distance",
  stats: false,
};
const mode = createSlice({
  name: "mode",
  initialState,
  reducers: {
    distanceMode(state) {
      state.mode = "distance";
      state.stats = false;
    },
    timeMode(state) {
      state.mode = "time";
    },
    compareMode(state) {
      state.mode = "compare";
      state.stats = false;
    },
    addStats(state, action) {
      state.stats = action.payload;
    },
  },
});

export const { distanceMode, timeMode, compareMode, addStats } = mode.actions;

export default mode.reducer;
