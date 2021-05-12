import React, { useRef, Suspense, useState, useCallback } from "react";
import { Canvas } from "react-three-fiber";
import { Stats, Sphere, Environment, Loader, Sky } from "@react-three/drei";

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

export default function Three() {
  const dispatch = useDispatch();
  const controlsRef = useRef();
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

  const move = () => {
    controlsRef.current?.moveCamera({ name: "start", easing: "slow" });
  };

  const dispatchStats = useCallback((res) => dispatch(addStats(res)), [
    dispatch,
  ]);

  return (
    <ThreeContainer
      addRoadWorks={addRoadWorks}
      removeRoadWorks={removeRoadWorks}
    >
      <Canvas
        colorManagement={false}
        camera={{ far: 40000 }}
        invalidateFrameloop={true}
      >
        {/* <Stats className="stats" /> */}
        <ambientLight color="#ffffff" intensity={1} />
        <group position={[-1500, 1500, 0]}>
          <Controls
            ref={controlsRef}
            roadWorks={addRoadWorks || removeRoadWorks}
          />

          <Suspense fallback={null}>
            <Sphere position={[0, 0, 50]} args={[50, 10, 10]} onClick={move}>
              <meshBasicMaterial attach="material" color="hotpink" />
            </Sphere>
            <Ground />
            <RoadWorks map={map} updateRoadWorks={updateRoadWorks} />
            <Roads
              verticesMap={verticesMap}
              setSelectedVertex={setSelectedVertex}
              addRoadWorks={addRoadWorks}
              removeRoadWorks={removeRoadWorks}
              setUpdateRoadWorks={setUpdateRoadWorks}
            />
            <TrafficLights verticesMap={verticesMap} enabled={trafficLights} />
            <TrafficConditions map={map} enabled={trafficConditions} />
            <CollisionBoxes map={map} enabled={collisionBoxes} />
            <Player
              map={map}
              selectedVertex={selectedVertex}
              pathfindingMode={pathfindingMode}
              dispatchStats={dispatchStats}
            />
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
