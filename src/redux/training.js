import { createSlice } from "@reduxjs/toolkit";
import { mouseMode } from "./mode";
import { enableCameraLock } from "./settings";

export const initialState = {
  currentDNA: null,
  training: false,
  ghosts: [],
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
    updateGhosts(state, action) {
      state.ghosts = action.payload;
    },
  },
});

export const { setCurrentDNA, toggleTraining, updateGhosts } = training.actions;

export const onTrainingMode = () => async (dispatch, getState) => {
  const trainingMode = getState().training.training;
  if (!trainingMode) {
    dispatch(enableCameraLock());
    dispatch(mouseMode());
  }
  dispatch(toggleTraining());
};

export default training.reducer;
