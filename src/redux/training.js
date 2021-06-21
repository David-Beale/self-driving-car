import { createSlice } from "@reduxjs/toolkit";
import { mouseMode } from "./mode";
import {
  addObstacles,
  disableAICar,
  enableCameraLock,
  removeObstacles,
} from "./settings";

const defaultSettings = {
  steerVal: 0.875,
  maxForce: 1000,
  maxBrakeForce: 20,
  maxSpeed: 18,
  stoppingDistance: 35,
  slowDistance: 20,
};

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
      const dna = action.payload || defaultSettings;
      state.currentDNA = dna;
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
    dispatch(disableAICar());
    dispatch(removeObstacles());
    dispatch(addObstacles(false));
  } else {
    dispatch(updateGhosts([]));
    dispatch(setCurrentDNA());
  }
  dispatch(toggleTraining());
};

export default training.reducer;
