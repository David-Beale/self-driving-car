import { mapData } from "../data/mapData";

const lightSet = {
  U: 1,
  D: 1,
  L: 2,
  R: 2,
};
const xOffsets = {
  U: -2.5,
  D: 2.5,
  L: -5.0,
  R: 5.0,
};
const zOffsets = {
  U: -5.0,
  D: 5.0,
  L: 2.5,
  R: -2.5,
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
        z: rowIndex * 10 + zOffsets[tile],
        x: tileIndex * 10 + xOffsets[tile],
        rotation: rotation[tile],
        lightSet: lightSet[tile],
        index: indexLookup[tile],
        key: `${rowIndex}:${tileIndex}`,
      });
    }
  });
});
