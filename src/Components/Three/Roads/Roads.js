import { useMemo, useRef } from "react";
import { formattedTiles } from "../data/formattedMapData";
import { textures } from "./RoadTextures";

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
          x: j * 100,
          y: -i * 100,
          vertices: verticesMap[i][j],
        });
      }
    }
    return array;
  }, [verticesMap]);

  const getVertex = (e, tile) => {
    const x = e.point.x + 1500 - tile.x;
    const y = e.point.y - 1500 - tile.y;
    switch (true) {
      case x <= 0 && y > 0:
        return tile.vertices[0];
      case x > 0 && y > 0:
        return tile.vertices[1];
      case x <= 0 && y <= 0:
        return tile.vertices[2];
      case x > 0 && y <= 0:
        return tile.vertices[3];
      default:
        break;
    }
  };
  const roadWorks = (e, tile, add) => {
    const vertex = getVertex(e, tile);
    if (!vertex) return;
    if ((add && vertex.roadWorks) || (!add && !vertex.roadWorks)) return;
    vertex.roadWorks = add ? true : false;
    setUpdateRoadWorks([true]);
  };
  const mouseDown = (e, tile) => {
    prevMouse.current = { x: e.clientX, y: e.clientY };
    if (!addRoadWorks && !removeRoadWorks) return;
    roadWorks(e, tile, addRoadWorks);
    document.addEventListener("pointerup", handleMouseUp, true);
  };

  const handleMouseUp = (e) => {
    document.removeEventListener("pointerup", handleMouseUp, true);
    prevMouse.current = null;
  };

  const mouseMove = (e, tile) => {
    if (!prevMouse.current || (!addRoadWorks && !removeRoadWorks)) return;
    roadWorks(e, tile, addRoadWorks);
  };
  const mouseUp = (e, tile) => {
    if (addRoadWorks || removeRoadWorks) return;
    const dist =
      Math.abs(prevMouse.current.x - e.clientX) +
      Math.abs(prevMouse.current.y - e.clientY);
    if (dist > 10) return;
    const vertex = getVertex(e, tile);
    setSelectedVertex(vertex);
  };

  return (
    <>
      {roadTiles.map((tile, index) => (
        <mesh
          key={index}
          frustumCulled={false}
          position={[tile.x, tile.y, 11]}
          renderOrder={2}
          onPointerDown={(e) => mouseDown(e, tile)}
          onPointerUp={(e) => mouseUp(e, tile)}
          onPointerMove={(e) => mouseMove(e, tile)}
        >
          <planeBufferGeometry attach="geometry" args={[100, 100, 20]} />
          <meshStandardMaterial map={tile.type} attach="material" />
        </mesh>
      ))}
    </>
  );
}
