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
      state.stats = {
        distance: {
          distance: action.payload.distance.distance,
          time: action.payload.distance.time,
        },
        time: {
          distance: action.payload.time.distance,
          time: action.payload.time.time,
        },
      };
    },
  },
});

export const { distanceMode, timeMode, compareMode, addStats } = mode.actions;

export default mode.reducer;
