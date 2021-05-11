import { useFrame } from "@react-three/fiber";
import { useMemo, useState } from "react";

const drawYellowCircle = (c, x, y, radius) => {
  c.beginPath();
  c.arc(x, y, radius, 0, Math.PI * 2, false);
  c.fillStyle = "rgba(, 0.35)";
  c.strokeStyle = "red";
  c.stroke();
  c.fill();
};

export default function CollisionBoxes({ map, enabled }) {
  const [collisionBoxes, setCollisionBoxes] = useState([]);

  useFrame(() => {
    if (!enabled) return;
    const array = [];
    map.array.forEach((vertexName) => {
      const vertex = map.graphObj[vertexName];
      if (vertex.occupied) {
        array.push({
          x: vertex.x - 25,
          y: -vertex.y + 25,
          key: `${vertex.x}:${vertex.y}`,
        });
      }
    });
    setCollisionBoxes(array);
  });

  return (
    <>
      {enabled &&
        collisionBoxes.map((tile) => (
          <mesh
            key={tile.key}
            frustumCulled={false}
            position={[tile.x, tile.y, 20]}
            renderOrder={10}
          >
            <circleBufferGeometry attach="geometry" args={[25, 36]} />
            <meshBasicMaterial
              color="pink"
              transparent={true}
              opacity={0.5}
              attach="material"
            />
          </mesh>
        ))}
    </>
  );
}
