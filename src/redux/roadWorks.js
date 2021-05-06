import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  addRoadWorks: false,
  removeRoadWorks: false,
};
const roadWorks = createSlice({
  name: "roadWorks",
  initialState,
  reducers: {
    toggleAddRoadWorks(state) {
      state.addRoadWorks = !state.addRoadWorks;
      if (state.addRoadWorks) state.removeRoadWorks = false;
    },
    toggleRemoveRoadWorks(state) {
      state.removeRoadWorks = !state.removeRoadWorks;
      if (state.removeRoadWorks) state.addRoadWorks = false;
    },
  },
});

export const { toggleAddRoadWorks, toggleRemoveRoadWorks } = roadWorks.actions;

export default roadWorks.reducer;
