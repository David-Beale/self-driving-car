import { useCylinder } from "@react-three/cannon";
import { useEffect } from "react";

export default function TrafficLight({ tile, color }) {
  const [ref, api] = useCylinder(() => ({
    type: "Static",
    position: [tile.x, 1, tile.z],
    args: [0.25, 0.25, 5, 12],
    rotation: [Math.PI / 2, 0, tile.rotation],
  }));
  useEffect(() => {
    const yValue = color === "red" ? 1 : 2;
    api.position.set(tile.x, yValue, tile.z);
  }, [color, api, tile]);
  return (
    <mesh ref={ref} frustumCulled={false}>
      <cylinderBufferGeometry attach="geometry" args={[0.25, 0.25, 5, 12]} />
      <meshLambertMaterial color={color} attach="material" />
    </mesh>
  );
}
