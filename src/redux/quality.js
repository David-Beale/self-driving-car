import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  quality: +localStorage.getItem("quality") ?? false,
};
const quality = createSlice({
  name: "quality",
  initialState,
  reducers: {
    setQuality(state, action) {
      localStorage.setItem("quality", action.payload);
      state.quality = action.payload;
    },
  },
});

export const { setQuality } = quality.actions;

export default quality.reducer;
