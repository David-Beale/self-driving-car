import React, { useRef, Suspense, useEffect } from "react";
import { Canvas } from "react-three-fiber";
import { Stats, Sphere, Environment, Loader } from "@react-three/drei";

import Controls from "./Controls/Controls";
import Ground from "./Ground";
import Roads from "./Roads/Roads";
import RoadWorks from "./RoadWorks/RoadWorks";

import { map, verticesMap } from "./graph/graphSetup";

import { ThreeContainer } from "./ThreeStyle";
import TrafficLights from "./TrafficLights/TrafficLights";

export default function Three() {
  const controlsRef = useRef();

  const move = () => {
    controlsRef.current?.moveCamera({ name: "start", easing: "slow" });
  };

  return (
    <ThreeContainer>
      <Canvas
        colorManagement={false}
        camera={{ position: [0, 0, 2000], far: 40000 }}
        invalidateFrameloop={true}
      >
        <Controls ref={controlsRef} />
        <Stats className="stats" />
        <Sphere position={[0, 0, 50]} args={[50, 10, 10]} onClick={move}>
          <meshBasicMaterial attach="material" color="hotpink" />
        </Sphere>

        <Suspense fallback={null}>
          <Ground />
          <RoadWorks map={map} />
        </Suspense>
        <Roads />
        <TrafficLights verticesMap={verticesMap} enabled={true} />
        <ambientLight color="#ffffff" intensity={1} />
      </Canvas>
      <Loader />
    </ThreeContainer>
  );
}
