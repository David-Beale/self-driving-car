import { useMemo, useRef } from "react";
import { formattedTiles } from "../data/formattedMapData";
import { textures } from "./RoadTextures";

export default function Roads({ verticesMap, setSelectedVertex }) {
  const prevMouse = useRef({});

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

  const mouseDown = (e) => {
    prevMouse.current = { x: e.clientX, y: e.clientY };
  };
  const mouseUp = (e, tile) => {
    const dist =
      Math.abs(prevMouse.current.x - e.clientX) +
      Math.abs(prevMouse.current.y - e.clientY);
    if (dist > 10) return;
    const x = e.point.x + 1500 - tile.x;
    const y = e.point.y - 1500 - tile.y;
    switch (true) {
      case x <= 0 && y > 0:
        setSelectedVertex(tile.vertices[0]);
        break;
      case x > 0 && y > 0:
        setSelectedVertex(tile.vertices[1]);
        break;
      case x <= 0 && y <= 0:
        setSelectedVertex(tile.vertices[2]);
        break;
      case x > 0 && y <= 0:
        setSelectedVertex(tile.vertices[3]);
        break;
      default:
        break;
    }
  };

  return (
    <>
      {roadTiles.map((tile, index) => (
        <mesh
          key={index}
          frustumCulled={false}
          position={[tile.x, tile.y, 11]}
          renderOrder={2}
          onPointerDown={mouseDown}
          onPointerUp={(e) => mouseUp(e, tile)}
        >
          <planeBufferGeometry attach="geometry" args={[100, 100, 20]} />
          <meshStandardMaterial map={tile.type} attach="material" />
        </mesh>
      ))}
    </>
  );
}
