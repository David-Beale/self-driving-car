import React, { Suspense, useState, memo, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Loader, Stats } from "@react-three/drei";
import { Physics, Debug } from "@react-three/cannon";

import Controls from "./Controls/Controls";
import Roads from "./Roads/Roads";
import Player from "./Player/Player";

import { ThreeContainer } from "./ThreeStyle";
import TrafficLights from "./TrafficLights/TrafficLights";
import { useDispatch, useSelector } from "react-redux";
import Car from "./Car/Car";
import AICar from "./Car/AI/AICar";
import Ghost from "./Ghosts/Ghost";
import SkyComponent from "./SkyComponent/SkyComponent";
import Obstacles from "./Obstacles/Obstacles";
import { newObstacle } from "../../redux/settings";

export default memo(function Three({ setGauges }) {
  const dispatch = useDispatch();
  const [selectedVertex, setSelectedVertex] = useState(null);

  const trafficLights = useSelector(({ settings }) => settings.trafficLights);
  const cameraLock = useSelector(({ settings }) => settings.cameraLock);
  const mode = useSelector(({ mode }) => mode.mode);
  const currentDNA = useSelector(({ training }) => training.currentDNA);
  const ghosts = useSelector(({ training }) => training.ghosts);
  const time = useSelector(({ settings }) => settings.time);
  const addObstacles = useSelector(({ settings }) => settings.addObstacles);
  const obstacles = useSelector(({ settings }) => settings.obstacles);
  const useAICar = useSelector(({ settings }) => settings.AICar);
  const isPaused = useSelector(({ settings }) => settings.helpOpen);

  const player = useMemo(
    () => (useAICar ? new AICar() : new Car()),
    [useAICar]
  );

  const onNewObstacle = (payload) => {
    dispatch(newObstacle(payload));
  };

  return (
    <ThreeContainer cursorTarget={addObstacles}>
      <Canvas
        colorManagement={false}
        camera={{ far: 4000 }}
        frameloop={"on demand"}
      >
        <Physics
          gravity={[0, -10, 0]}
          broadphase="SAP"
          allowSleep
          shouldInvalidate={false}
        >
          {/* <Debug color="black" scale={1.1}> */}
          <Stats className="stats" />

          <Controls
            cameraLock={cameraLock}
            player={player}
            isPaused={isPaused}
          />

          <Suspense fallback={null}>
            <Roads
              addObstacles={addObstacles}
              setSelectedVertex={setSelectedVertex}
              onNewObstacle={onNewObstacle}
            />
            {/* <TrafficLights verticesMap={map.lookup} enabled={trafficLights} /> */}
            <Obstacles obstacles={obstacles} />
            <Player
              player={player}
              selectedVertex={selectedVertex}
              mode={mode}
              currentDNA={currentDNA}
              setGauges={setGauges}
              time={time}
              obstacles={obstacles}
              useAICar={useAICar}
            />
            {ghosts.map((ghostDNA, index) => (
              <Ghost key={index} ghostDNA={ghostDNA} />
            ))}
          </Suspense>
          <SkyComponent time={time} />
          {/* </Debug> */}
        </Physics>
      </Canvas>
      <Loader />
    </ThreeContainer>
  );
});
