import { mapData } from "../data/mapData";
export const trafficLights = [];
mapData.forEach((row, rowIndex) => {
  row.forEach((tile, tileIndex) => {
    if (!tile) return;
    if (tile !== "1") {
      trafficLights.push({ tile, i: rowIndex, j: tileIndex });
    }
  });
});
