import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import grass from "../../../Assets/grass.jpg";
import { usePlane } from "@react-three/cannon";

export default function Ground() {
  const texture = useTexture(grass);

  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(10, 10);

  const [ref] = usePlane(() => ({
    type: "Static",
    rotation: [0, 0, -Math.PI / 2],
    position: [0, 0, 0],
  }));

  return (
    <mesh ref={ref} frustumCulled={false} position={[0, 0, 0]} renderOrder={1}>
      <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
      <meshBasicMaterial map={texture} attach="material" />
      {/* <meshBasicMaterial transparent={true} attach="material" /> */}
    </mesh>
  );
}
