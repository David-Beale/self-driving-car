import { useBox } from "@react-three/cannon";
import Cone from "./Cone";

export default function Obstacle({ obstacle }) {
  const [ref] = useBox(() => ({
    mass: 1000,
    position: [obstacle.x, 2, obstacle.z],
    args: [1, 1, 1],
    collisionFilterGroup: 1,
  }));

  return (
    <mesh ref={ref} frustumCulled={false}>
      <Cone position={[0, -0.5, 0]} scale={0.5} />
    </mesh>
  );
}
