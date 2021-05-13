import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function ComputerCar({ car }) {
  const gltf = useLoader(GLTFLoader, "./computerCars/scene.gltf");
  const carRef = useRef();

  useFrame(() => {
    car.run();
    carRef.current.position.x = car.currentX;
    carRef.current.position.y = car.currentY;
    carRef.current.rotation.z = Math.PI / 2 + car.angle;
  });
  return (
    <>
      <primitive
        ref={carRef}
        object={gltf.nodes[car.model].clone()}
        position={[1475, -1475, 16]}
        scale={7}
      />
    </>
  );
}
