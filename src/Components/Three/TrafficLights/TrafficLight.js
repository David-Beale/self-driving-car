import { useBox } from "@react-three/cannon";
import { useEffect } from "react";

export default function TrafficLight({ tile, color }) {
  const [ref, api] = useBox(() => ({
    type: "Static",
    position: [tile.x, 1, tile.z],
    args: [5, 0.5, 0.5],
    rotation: [0, tile.rotation, 0],
  }));
  useEffect(() => {
    const yValue = color === "red" ? 1 : 2;
    api.position.set(tile.x, yValue, tile.z);
  }, [color, api, tile]);
  return (
    <mesh ref={ref} frustumCulled={false}>
      <boxBufferGeometry attach="geometry" args={[5, 0.5, 0.5]} />
      <meshBasicMaterial color={color} attach="material" />
    </mesh>
  );
}
