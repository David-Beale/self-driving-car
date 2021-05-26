import { useCallback, useMemo, useRef } from "react";
import { formattedTiles } from "../data/formattedMapData";
import { textures } from "./RoadTextures";
import Road from "./Road";

export default function Roads({ verticesMap, setSelectedVertex }) {
  const prevMouse = useRef(null);

  const roadTiles = useMemo(() => {
    const array = [];
    for (let i = 0; i < formattedTiles.length; i++) {
      for (let j = 0; j < formattedTiles[0].length; j++) {
        let type = formattedTiles[i][j];
        if (!type) continue;
        array.push({
          type: textures[type],
          x: j * 10,
          z: i * 10,
          vertices: verticesMap[i][j],
        });
      }
    }
    return array;
  }, [verticesMap]);

  const getVertex = (e, tile) => {
    const x = e.point.x - tile.x;
    const z = e.point.z - tile.z;
    switch (true) {
      case x <= 0 && z <= 0:
        return tile.vertices[0];
      case x > 0 && z <= 0:
        return tile.vertices[1];
      case x <= 0 && z > 0:
        return tile.vertices[2];
      case x > 0 && z > 0:
        return tile.vertices[3];
      default:
        break;
    }
  };

  const mouseDown = useCallback((e) => {
    prevMouse.current = { x: e.clientX, y: e.clientY };
  }, []);

  const mouseUp = useCallback(
    (e, tile) => {
      if (!prevMouse.current) return;
      const dist =
        Math.abs(prevMouse.current.x - e.clientX) +
        Math.abs(prevMouse.current.y - e.clientY);
      if (dist > 10) return;
      const vertex = getVertex(e, tile);
      console.log(vertex);
      setSelectedVertex(vertex);
    },
    [setSelectedVertex]
  );

  return (
    <>
      {roadTiles.map((tile, index) => (
        <Road key={index} tile={tile} mouseDown={mouseDown} mouseUp={mouseUp} />
      ))}
    </>
  );
}
