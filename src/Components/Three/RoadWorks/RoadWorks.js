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
          x: vertex.x - 25,
          y: -vertex.y + 25,
          key: `${vertex.x}:${vertex.y}`,
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
          position={[tile.x, tile.y, 20]}
          renderOrder={4}
        >
          <planeBufferGeometry attach="geometry" args={[50, 50]} />
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
