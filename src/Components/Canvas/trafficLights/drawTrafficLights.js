import { trafficLights } from "./trafficLightData";
const counterOffsets = {
  U: 0,
  D: 0,
  L: 200,
  R: 200,
};
const xOffsets = {
  U: 8.5,
  D: 91.5,
  L: -8.5,
  R: 108.5,
};
const yOffsets = {
  U: -8.5,
  D: 108.5,
  L: 91.5,
  R: 8.5,
};
const indexLookup = {
  U: 0,
  D: 3,
  L: 2,
  R: 1,
};

const getColor = (counter, offset, enabled) => {
  if (!enabled) return "green";
  let value = counter + offset;
  switch (true) {
    case value <= 180:
      return "red";
    case value <= 200:
      return "yellow";
    case value <= 380:
      return "green";
    case value <= 400:
      return "yellow";
    case value <= 580:
      return "red";
    case value <= 600:
      return "yellow";
    default:
      return;
  }
};

let counter = 0;

export const drawTrafficLights = (c, verticesMap, enabled) => {
  trafficLights.forEach((light) => {
    const { tile, i, j } = light;
    const color = getColor(counter, counterOffsets[tile], enabled);
    if (enabled) {
      trafficLightDrawings(
        c,
        j * 100 + xOffsets[tile],
        i * 100 + yOffsets[tile],
        color
      );
    }
    const index = indexLookup[tile];
    const vertices = verticesMap[i][j];
    const vertex = vertices[index];
    vertex.light = color;
  });
  counter++;
  if (counter === 400) counter = 0;
};

const trafficLightDrawings = (c, x, y, color) => {
  c.beginPath();
  c.arc(x, y, 5, 0, Math.PI * 2, false);
  c.fillStyle = color;
  c.strokeStyle = "black";
  c.stroke();
  c.fill();
};
