import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  trafficLights: false,
  cameraLock: undefined,
  collisionBoxes: false,
  computerNumber: 60,
  trafficConditions: false,
  time: "night",
};
const settings = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleTrafficLights(state) {
      state.trafficLights = !state.trafficLights;
    },
    toggleCameraLock(state) {
      state.cameraLock = !state.cameraLock;
    },
    enableCameraLock(state) {
      state.cameraLock = true;
    },
    toggleCollisionBoxes(state) {
      state.collisionBoxes = !state.collisionBoxes;
    },
    toggleTrafficConditions(state) {
      state.trafficConditions = !state.trafficConditions;
    },
    changeComputerNumber(state, action) {
      state.computerNumber = action.payload;
    },
    toggleTime(state) {
      if (state.time === "day") state.time = "sunset";
      else if (state.time === "sunset") state.time = "night";
      else if (state.time === "night") state.time = "day";
    },
  },
});

export const {
  toggleTrafficLights,
  toggleCameraLock,
  enableCameraLock,
  toggleCollisionBoxes,
  toggleTrafficConditions,
  changeComputerNumber,
  toggleTime,
} = settings.actions;

export default settings.reducer;
