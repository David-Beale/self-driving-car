import { useBox } from "@react-three/cannon";
import Cone from "./Cone";

export default function Obstacle({ obstacle }) {
  const [ref] = useBox(() => ({
    mass: 1000,
    position: [obstacle.x, 4, obstacle.z],
    args: [2, 2, 2],
    collisionFilterGroup: 1,
  }));

  return (
    <mesh ref={ref} frustumCulled={false}>
      <Cone position = {[0,-1,0]}/>
    </mesh>
  );
}
