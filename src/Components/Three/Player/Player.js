import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function Model() {
  const gltf = useLoader(GLTFLoader, "./scene.gltf");
  console.log(gltf);
  return (
    <>
      <primitive
        object={gltf.scene.children[0]}
        position={[75, -75, 21]}
        scale={0.05}
        rotation={[0, 0, Math.PI / 2]}
      />
    </>
  );
}
