import { useRef } from "react";
import { extend, useFrame } from "@react-three/fiber";
import * as meshline from "threejs-meshline";

extend(meshline);

export default function PlayerPath({ newPlayer }) {
  const pathRef = useRef();

  useFrame(() => {
    if (newPlayer.arrayOfSteps.length)
      pathRef.current.geometry.setVertices(newPlayer.arrayOfSteps);
  });

  return (
    <mesh ref={pathRef}>
      <meshLine attach="geometry" vertices={[]} />
      <meshLineMaterial
        attach="material"
        transparent
        depthTest={false}
        lineWidth={3}
        color={"lightblue"}
      />
    </mesh>
  );
}
