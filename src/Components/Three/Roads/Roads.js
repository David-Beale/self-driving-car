import { useCallback, useMemo, useRef } from "react";
import { formattedTiles } from "../data/formattedMapData";
import { textures } from "./RoadTextures";
import Road from "./Road";

export default function Roads({
  verticesMap,
  setSelectedVertex,
  addRoadWorks,
  removeRoadWorks,
  setUpdateRoadWorks,
}) {
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
    const x = e.point.x + 150 - tile.x;
    const z = e.point.z + 150 - tile.z;
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
  const roadWorks = useCallback(
    (e, tile, add) => {
      const vertex = getVertex(e, tile);
      if (!vertex) return;
      if ((add && vertex.roadWorks) || (!add && !vertex.roadWorks)) return;
      vertex.roadWorks = add ? true : false;
      setUpdateRoadWorks([true]);
    },
    [setUpdateRoadWorks]
  );

  const handleMouseUp = useCallback((e) => {
    document.removeEventListener("pointerup", handleMouseUp, true);
    prevMouse.current = null;
  }, []);

  const mouseDown = useCallback(
    (e, tile) => {
      prevMouse.current = { x: e.clientX, y: e.clientY };
      if (!addRoadWorks && !removeRoadWorks) return;
      roadWorks(e, tile, addRoadWorks);
      document.addEventListener("pointerup", handleMouseUp, true);
    },
    [addRoadWorks, handleMouseUp, removeRoadWorks, roadWorks]
  );

  const mouseMove = useCallback(
    (e, tile) => {
      if (!prevMouse.current || (!addRoadWorks && !removeRoadWorks)) return;
      roadWorks(e, tile, addRoadWorks);
    },
    [addRoadWorks, removeRoadWorks, roadWorks]
  );

  const mouseUp = useCallback(
    (e, tile) => {
      if (addRoadWorks || removeRoadWorks || !prevMouse.current) return;
      const dist =
        Math.abs(prevMouse.current.x - e.clientX) +
        Math.abs(prevMouse.current.y - e.clientY);
      if (dist > 10) return;
      const vertex = getVertex(e, tile);
      setSelectedVertex(vertex);
    },
    [addRoadWorks, removeRoadWorks, setSelectedVertex]
  );

  return (
    <>
      {roadTiles.map((tile, index) => (
        <Road
          key={index}
          tile={tile}
          mouseDown={mouseDown}
          mouseUp={mouseUp}
          mouseMove={mouseMove}
        />
      ))}
    </>
  );
}
