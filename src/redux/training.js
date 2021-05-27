import { createSlice } from "@reduxjs/toolkit";
import { enableCameraLock } from "./settings";

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

export const onTrainingMode = () => async (dispatch, getState) => {
  const trainingMode = getState().training.training;
  if (!trainingMode) dispatch(enableCameraLock());
  dispatch(toggleTraining());
};

export default training.reducer;
