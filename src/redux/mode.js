import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  mode: "mouse",
  stats: false,
};
const mode = createSlice({
  name: "mode",
  initialState,
  reducers: {
    mouseMode(state) {
      state.mode = "mouse";
    },
    keyboardMode(state) {
      state.mode = "keyboard";
    },
  },
});

export const { mouseMode, keyboardMode } = mode.actions;

export default mode.reducer;
