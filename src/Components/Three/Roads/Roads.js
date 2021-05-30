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

  const onPointerDown = (e) => {
    prevMouse.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerUp = (e) => {
    if (!prevMouse.current) return;
    const dist =
      Math.abs(prevMouse.current.x - e.clientX) +
      Math.abs(prevMouse.current.y - e.clientY);
    if (dist > 10) return;
    setSelectedVertex({ x: e.point.x, z: e.point.z });
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
        <meshStandardMaterial
          map={roadsTexture}
          attach="material"
          transparent={true}
        />
      </mesh>
    </>
  );
}
