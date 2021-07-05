import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  gauges: null,
};
const gauges = createSlice({
  name: "gauges",
  initialState,
  reducers: {
    setgauges(state, action) {
      state.gauges = action.payload;
    },
  },
});

export const { setgauges } = gauges.actions;

export default gauges.reducer;
