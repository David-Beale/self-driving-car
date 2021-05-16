import React, { useRef, Suspense, useState, useCallback } from "react";
import { Canvas } from "react-three-fiber";
import {
  Stats,
  Sphere,
  Environment,
  Loader,
  Sky,
  Box,
} from "@react-three/drei";
import { Physics, useBox, useCylinder } from "@react-three/cannon";

import Controls from "./Controls/Controls";
import Ground from "./Ground/Ground";
import Roads from "./Roads/Roads";
import RoadWorks from "./RoadWorks/RoadWorks";
import Player from "./Player/Player";

import { map, verticesMap } from "./graph/graphSetup";

import { ThreeContainer } from "./ThreeStyle";
import TrafficLights from "./TrafficLights/TrafficLights";
import { useDispatch, useSelector } from "react-redux";
import TrafficConditions from "./TrafficConditions/TrafficConditions";
import CollisionBoxes from "./CollisionBoxes/CollisionBoxes";
import { addStats } from "../../redux/mode";
import ComputerController from "./computer/ComputerController";

const defaultContactMaterial = {
  contactEquationRelaxation: 0.001,
  friction: 1,
};

export default function Three() {
  const dispatch = useDispatch();
  const playerRef = useRef();
  // const [ref, playerApi] = useBox(() => ({
  //   type: "Dynamic",
  //   args: [25, 5, 5],
  //   position: [75, -75, 11],
  // }));
  const [selectedVertex, setSelectedVertex] = useState(null);
  const [updateRoadWorks, setUpdateRoadWorks] = useState(false);
  const trafficLights = useSelector(({ settings }) => settings.trafficLights);
  const trafficConditions = useSelector(
    ({ settings }) => settings.trafficConditions
  );
  const collisionBoxes = useSelector(({ settings }) => settings.collisionBoxes);
  const pathfindingMode = useSelector(({ mode }) => mode.mode);
  const addRoadWorks = useSelector(({ roadWorks }) => roadWorks.addRoadWorks);
  const removeRoadWorks = useSelector(
    ({ roadWorks }) => roadWorks.removeRoadWorks
  );
  const cameraLock = useSelector(({ settings }) => settings.cameraLock);
  const computerNumber = useSelector(({ settings }) => settings.computerNumber);

  const dispatchStats = useCallback(
    (res) => dispatch(addStats(res)),
    [dispatch]
  );

  return (
    <ThreeContainer
      addRoadWorks={addRoadWorks}
      removeRoadWorks={removeRoadWorks}
    >
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
          <Ground />
          <group position={[-150, 0, -150]}>
            <Controls
              cameraLock={cameraLock}
              roadWorks={addRoadWorks || removeRoadWorks}
              // playerRef={playerRef}
            />

            <Suspense fallback={null}>
              <RoadWorks map={map} updateRoadWorks={updateRoadWorks} />
              <Roads
                verticesMap={verticesMap}
                setSelectedVertex={setSelectedVertex}
                addRoadWorks={addRoadWorks}
                removeRoadWorks={removeRoadWorks}
                setUpdateRoadWorks={setUpdateRoadWorks}
              />
              <TrafficLights
                verticesMap={verticesMap}
                enabled={trafficLights}
              />
              <TrafficConditions map={map} enabled={trafficConditions} />
              {/* <CollisionBoxes map={map} enabled={collisionBoxes} /> */}
              {/* <Box position={[1525, -1525, 0]} args={[45, 20, 25]}>
                <meshPhongMaterial
                  attach="material"
                  color="#f3f3f3"
                  wireframe
                />
              </Box> */}

              <Player
                playerRef={playerRef}
                map={map}
                selectedVertex={selectedVertex}
                pathfindingMode={pathfindingMode}
                dispatchStats={dispatchStats}
              />
              <ComputerController map={map} number={0} />
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
}
