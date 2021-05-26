import { useEffect, useMemo, useRef } from "react";
import { formattedTiles } from "../data/formattedMapData";
import { roadsTexture } from "./RoadTextures";
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
          x: j * 10,
          z: i * 10,
        });
      }
    }
    return array;
  }, []);

  const getVertex = (e) => {
    const x = (e.point.x - 5) / 10;
    const z = (e.point.z - 5) / 10;
    const i = Math.ceil(z);
    const j = Math.ceil(x);
    const vertices = verticesMap[i][j];

    const remainderX = x % 1;
    const remainderZ = z % 1;
    switch (true) {
      case remainderX <= 0.5 && remainderZ <= 0.5:
        return vertices[0];
      case remainderX > 0.5 && remainderZ <= 0.5:
        return vertices[1];
      case remainderX <= 0.5 && remainderZ > 0.5:
        return vertices[2];
      case remainderX > 0.5 && remainderZ > 0.5:
        return vertices[3];
      default:
        break;
    }
  };

  const onPointerDown = (e) => {
    prevMouse.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerUp = (e) => {
    if (!prevMouse.current) return;
    const dist =
      Math.abs(prevMouse.current.x - e.clientX) +
      Math.abs(prevMouse.current.y - e.clientY);
    if (dist > 10) return;
    const vertex = getVertex(e);
    setSelectedVertex(vertex);
  };

  const ref = useRef();
  useEffect(() => {
    ref.current.updateMatrix();
  }, [ref]);

  return (
    <>
      {roadTiles.map((tile, index) => (
        <Road key={index} tile={tile} />
      ))}
      <mesh
        ref={ref}
        frustumCulled={false}
        renderOrder={1}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        matrixAutoUpdate={false}
        position={[145, 0, 145]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeBufferGeometry attach="geometry" args={[300, 300]} />
        <meshBasicMaterial
          map={roadsTexture}
          attach="material"
          transparent={true}
        />
      </mesh>
    </>
  );
}
