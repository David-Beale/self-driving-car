import React, { useRef, Suspense } from "react";
import { Canvas } from "react-three-fiber";
import { Stats, Sphere, Environment, Loader } from "@react-three/drei";

import Controls from "./Controls/Controls";
import Ground from "./Ground";
import Roads from "./Roads/Roads";

import { map, verticesMap } from "./graph/graphSetup";

import { ThreeContainer } from "./ThreeStyle";

export default function Three() {
  const controlsRef = useRef();
  return (
    <ThreeContainer>
      <Canvas
        colorManagement={false}
        camera={{ position: [7, 0, 2000], far: 40000 }}
        invalidateFrameloop={true}
      >
        <Controls ref={controlsRef} />
        <Stats className="stats" />
        {/* <Sphere position={[0, 0, 50]} args={[50, 10, 10]}>
          <meshBasicMaterial attach="material" color="hotpink" />
        </Sphere> */}

        <Suspense fallback={null}>
          <Ground />
        </Suspense>
        <Roads map={map} />
        <ambientLight color="#ffffff" intensity={1} />
      </Canvas>
      <Loader />
    </ThreeContainer>
  );
}
