import { extend } from "@react-three/fiber";
import * as meshline from "threejs-meshline";

extend(meshline);

export default function Line({ pathRef, vertices, color, width }) {
  return (
    <mesh ref={pathRef}>
      <meshLine attach="geometry" vertices={vertices} color={color} />
      <meshLineMaterial
        attach="material"
        transparent
        depthTest={false}
        lineWidth={width}
        color={color}
      />
    </mesh>
  );
}
