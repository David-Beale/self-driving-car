import React, { useRef, Suspense, useState } from "react";
import { Canvas } from "react-three-fiber";
import { Stats, Sphere, Environment, Loader, Sky } from "@react-three/drei";

import Controls from "./Controls/Controls";
import Ground from "./Ground";
import Roads from "./Roads/Roads";
import RoadWorks from "./RoadWorks/RoadWorks";
import Player from "./Player/Player";

import { map, verticesMap } from "./graph/graphSetup";

import { ThreeContainer } from "./ThreeStyle";
import TrafficLights from "./TrafficLights/TrafficLights";

export default function Three() {
  const controlsRef = useRef();
  const [selectedVertex, setSelectedVertex] = useState(null);

  const move = () => {
    controlsRef.current?.moveCamera({ name: "start", easing: "slow" });
  };

  return (
    <ThreeContainer>
      <Canvas
        colorManagement={false}
        camera={{ far: 40000 }}
        invalidateFrameloop={true}
      >
        <Stats className="stats" />
        <ambientLight color="#ffffff" intensity={1} />
        <group position={[-1500, 1500, 0]}>
          <Controls ref={controlsRef} />

          <Suspense fallback={null}>
            <Sphere position={[0, 0, 50]} args={[50, 10, 10]} onClick={move}>
              <meshBasicMaterial attach="material" color="hotpink" />
            </Sphere>
            <Ground />
            <RoadWorks map={map} />
            <Roads
              verticesMap={verticesMap}
              setSelectedVertex={setSelectedVertex}
            />
            <TrafficLights verticesMap={verticesMap} enabled={true} />
            <Player map={map} selectedVertex={selectedVertex} />
          </Suspense>
        </group>
        <Sky
          distance={450000} // Camera distance (default=450000)
          sunPosition={[0, 1, 0]} // Sun position normal (defaults to inclination and azimuth if not set)
          inclination={0} // Sun elevation angle from 0 to 1 (default=0)
          azimuth={0.25} // Sun rotation around the Y axis from 0 to 1 (default=0.25)
        />
      </Canvas>
      <Loader />
    </ThreeContainer>
  );
}
