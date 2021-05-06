import { mapData } from "./mapData";

export const formattedTiles = mapData.map((row, i) =>
  row.map((tile, j) => {
    if (!tile) return 0;
    if (
      mapData[i][j - 1] &&
      mapData[i][j + 1] &&
      mapData[i + 1]?.[j] &&
      mapData[i - 1]?.[j]
    )
      return "XR";
    else if (mapData[i][j - 1] && mapData[i][j + 1] && mapData[i + 1]?.[j])
      return "TB";
    else if (mapData[i][j - 1] && mapData[i][j + 1] && mapData[i - 1]?.[j])
      return "TT";
    else if (mapData[i][j + 1] && mapData[i + 1]?.[j] && mapData[i - 1]?.[j])
      return "TR";
    else if (mapData[i][j - 1] && mapData[i + 1]?.[j] && mapData[i - 1]?.[j])
      return "TL";
    else if (mapData[i][j + 1] && mapData[i + 1]?.[j]) return "TLC";
    else if (mapData[i][j - 1] && mapData[i + 1]?.[j]) return "TRC";
    else if (mapData[i][j - 1] && mapData[i - 1]?.[j]) return "BRC";
    else if (mapData[i][j + 1] && mapData[i - 1]?.[j]) return "BLC";
    else if (mapData[i][j - 1] && mapData[i][j + 1]) return "HR";
    else if (mapData[i + 1]?.[j] && mapData[i - 1]?.[j]) return "VR";
    return tile;
  })
);
