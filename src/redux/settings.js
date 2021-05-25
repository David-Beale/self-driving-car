import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  trafficLights: false,
  cameraLock: undefined,
  collisionBoxes: false,
  computerNumber: 60,
  trafficConditions: false,
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
  },
});

export const {
  toggleTrafficLights,
  toggleCameraLock,
  enableCameraLock,
  toggleCollisionBoxes,
  toggleTrafficConditions,
  changeComputerNumber,
} = settings.actions;

export default settings.reducer;
