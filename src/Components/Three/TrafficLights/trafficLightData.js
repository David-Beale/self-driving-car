import { mapData } from "../data/mapData";

const lightSet = {
  U: 1,
  D: 1,
  L: 2,
  R: 2,
};
const xOffsets = {
  U: -25,
  D: 25,
  L: -50,
  R: 50,
};
const yOffsets = {
  U: 50,
  D: -50,
  L: -25,
  R: 25,
};
const rotation = {
  U: 0,
  D: 0,
  L: 0.5 * Math.PI,
  R: 0.5 * Math.PI,
};
const indexLookup = {
  U: 0,
  D: 3,
  L: 2,
  R: 1,
};

export const trafficLights = [];
mapData.forEach((row, rowIndex) => {
  row.forEach((tile, tileIndex) => {
    if (!tile) return;
    if (tile !== "1") {
      trafficLights.push({
        i: rowIndex,
        j: tileIndex,
        y: -rowIndex * 100 + yOffsets[tile],
        x: tileIndex * 100 + xOffsets[tile],
        rotation: rotation[tile],
        lightSet: lightSet[tile],
        index: indexLookup[tile],
        key: `${rowIndex}:${tileIndex}`,
      });
    }
  });
});
