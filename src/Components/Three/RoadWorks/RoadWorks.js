import { useMemo } from "react";
import { useTexture } from "@react-three/drei";
import roadWorksImage from "../../../Assets/roadworks.png";

export default function RoadWorks({ map, updateRoadWorks }) {
  const texture = useTexture(roadWorksImage);

  const roadWorksTiles = useMemo(() => {
    const array = [];
    map.array.forEach((vertexName) => {
      const vertex = map.graphObj[vertexName];
      if (vertex.roadWorks) {
        array.push({
          x: vertex.x - 2.5,
          z: vertex.z - 2.5,
          key: `${vertex.x}:${vertex.z}`,
        });
      }
    });
    return array;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, updateRoadWorks]);

  return (
    <>
      {roadWorksTiles.map((tile) => (
        <mesh
          key={tile.key}
          frustumCulled={false}
          position={[tile.x, 0.1, tile.z]}
          rotation={[-Math.PI / 2, 0, 0]}
          renderOrder={4}
        >
          <planeBufferGeometry attach="geometry" args={[5, 5]} />
          <meshBasicMaterial
            transparent={true}
            opacity={0.5}
            map={texture}
            attach="material"
          />
        </mesh>
      ))}
    </>
  );
}
