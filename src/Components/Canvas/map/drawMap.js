import { formattedTiles } from "../data/formattedMapData";
import { mapDrawings } from "./mapDrawings";
import backgroundImg from "../../../Assets/FoilageGrass_1.jpg";
const background = new Image();
background.src = backgroundImg;

const drawRoads = (c) => {
  for (let i = 0; i < formattedTiles.length; i++) {
    for (let j = 0; j < formattedTiles[0].length; j++) {
      let type = formattedTiles[i][j];
      if (!type) continue;
      mapDrawings[type](c, j * 100, i * 100);
    }
  }
};
const drawBackground = (c) => {
  for (let i = -1200; i <= 4200; i += 600) {
    for (let j = -1200; j <= 4200; j += 600) {
      c.drawImage(background, i, j, 600, 600);
    }
  }
};
export const drawMap = (c) => {
  drawBackground(c);
  drawRoads(c);
};
