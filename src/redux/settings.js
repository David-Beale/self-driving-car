import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  trafficLights: false,
  cameraLock: undefined,
  collisionBoxes: false,
  computerNumber: 60,
  trafficConditions: false,
  time: "sunset",
  obstacles: [],
  addObstacles: false,
  AICar: false,
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
    addObstacles(state, action) {
      const payload = action.payload || !state.addObstacles;
      state.addObstacles = payload;
    },
    newObstacle(state, action) {
      state.obstacles.push(action.payload);
    },
    removeObstacles(state) {
      state.obstacles = [];
    },
    toggleAICar(state) {
      state.AICar = !state.AICar;
      state.addObstacles = false;
      state.obstacles = [];
    },
    disableAICar(state) {
      state.AICar = false;
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
  addObstacles,
  newObstacle,
  removeObstacles,
  toggleAICar,
  disableAICar,
} = settings.actions;

export default settings.reducer;
