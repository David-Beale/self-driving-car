import { useMemo } from "react";
import { useTexture } from "@react-three/drei";
import roadWorksImage from "../../../Assets/roadworks.png";

export default function RoadWorks({ map }) {
  const texture = useTexture(roadWorksImage);

  const roadWorksTiles = useMemo(() => {
    const array = [];
    const arrayOfVertices = Object.keys(map.graphObj);
    arrayOfVertices.forEach((vertexName) => {
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
  }, [map]);

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
            opacity={0.3}
            map={texture}
            attach="material"
          />
        </mesh>
      ))}
    </>
  );
}
