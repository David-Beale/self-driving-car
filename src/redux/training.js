import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  currentDNA: null,
  training: false,
};
const training = createSlice({
  name: "training",
  initialState,
  reducers: {
    setCurrentDNA(state, action) {
      state.currentDNA = action.payload;
    },
    toggleTraining(state) {
      state.training = !state.training;
    },
  },
});

export const { setCurrentDNA, toggleTraining } = training.actions;

export default training.reducer;
