import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import grass from "../../Assets/grass.jpg";

export default function Ground() {
  const texture = useTexture(grass);

  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(10, 10);

  return (
    <mesh frustumCulled={false} position={[0, 0, 0]} renderOrder={1}>
      <planeBufferGeometry attach="geometry" args={[20000, 20000]} />
      <meshStandardMaterial map={texture} attach="material" />
    </mesh>
  );
}
