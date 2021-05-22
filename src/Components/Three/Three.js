import React, { Suspense, useState, memo } from "react";
import { Canvas } from "react-three-fiber";
import { Loader, Sky } from "@react-three/drei";
import { Physics } from "@react-three/cannon";

import Controls from "./Controls/Controls";
import Roads from "./Roads/Roads";
import Player from "./Player/Player";

import { map, verticesMap } from "./graph/graphSetup";

import { ThreeContainer } from "./ThreeStyle";
import TrafficLights from "./TrafficLights/TrafficLights";
import { useSelector } from "react-redux";
import Car from "../Car/Car";

const player = new Car(map);

const defaultContactMaterial = {
  contactEquationRelaxation: 0.001,
  friction: 1,
};

export default memo(function Three({ setGauges }) {
  const [selectedVertex, setSelectedVertex] = useState(null);

  const trafficLights = useSelector(({ settings }) => settings.trafficLights);

  const cameraLock = useSelector(({ settings }) => settings.cameraLock);
  const mode = useSelector(({ mode }) => mode.mode);

  return (
    <ThreeContainer>
      <Canvas
        colorManagement={false}
        camera={{ far: 4000 }}
        invalidateFrameloop={true}
      >
        <Physics
          gravity={[0, -10, 0]}
          broadphase="SAP"
          {...defaultContactMaterial}
          allowSleep
        >
          {/* <Stats className="stats" /> */}
          <ambientLight color="#ffffff" intensity={0.3} />
          <directionalLight color="#ffffff" position={[-100, 50, 50]} />
          <directionalLight color="#ffffff" position={[100, 50, 50]} />
          <group position={[-150, 0, -150]}>
            <Controls cameraLock={cameraLock} player={player} />

            <Suspense fallback={null}>
              <Roads
                verticesMap={verticesMap}
                setSelectedVertex={setSelectedVertex}
              />
              <TrafficLights
                verticesMap={verticesMap}
                enabled={trafficLights}
              />
              <Player
                player={player}
                selectedVertex={selectedVertex}
                mode={mode}
                setGauges={setGauges}
              />
            </Suspense>
          </group>
          <Sky
            distance={45000} // Camera distance (default=450000)
            inclination={0.49} // Sun elevation angle from 0 to 1 (default=0)
            azimuth={0.25} // Sun rotation around the Y axis from 0 to 1 (default=0.25)
          />
        </Physics>
      </Canvas>
      <Loader />
    </ThreeContainer>
  );
});
