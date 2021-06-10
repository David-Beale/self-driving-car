import React, { Suspense, useState, memo, useEffect } from "react";
import { Canvas } from "react-three-fiber";
import { Loader, Stats } from "@react-three/drei";
import { Physics } from "@react-three/cannon";

import Controls from "./Controls/Controls";
import Roads from "./Roads/Roads";
import Player from "./Player/Player";

import { map } from "./graph/graphSetup";

import { ThreeContainer } from "./ThreeStyle";
import TrafficLights from "./TrafficLights/TrafficLights";
import { useSelector } from "react-redux";
import Car from "./Car/Car";
import Ghost from "./Ghosts/Ghost";
import SkyComponent from "./SkyComponent/SkyComponent";
import Obstacles from "./Obstacles/Obstacles";

const player = new Car(map);

export default memo(function Three({ setGauges }) {
  const [selectedVertex, setSelectedVertex] = useState(null);
  const [obstacles, setObstacles] = useState([]);

  const trafficLights = useSelector(({ settings }) => settings.trafficLights);

  const cameraLock = useSelector(({ settings }) => settings.cameraLock);
  const mode = useSelector(({ mode }) => mode.mode);
  const currentDNA = useSelector(({ training }) => training.currentDNA);
  const ghosts = useSelector(({ training }) => training.ghosts);
  const time = useSelector(({ settings }) => settings.time);
  const addObstacles = useSelector(({ settings }) => settings.addObstacles);
  const removeObstacles = useSelector(
    ({ settings }) => settings.removeObstacles
  );

  useEffect(() => {
    if (!removeObstacles) return;
    setObstacles([]);
  }, [removeObstacles]);
  return (
    <ThreeContainer cursorTarget={addObstacles}>
      <Canvas
        colorManagement={false}
        camera={{ far: 4000 }}
        invalidateFrameloop={true}
      >
        <Physics gravity={[0, -10, 0]} broadphase="SAP" allowSleep>
          <Stats className="stats" />

          <Controls cameraLock={cameraLock} player={player} />

          <Suspense fallback={null}>
            <Roads
              addObstacles={addObstacles}
              setSelectedVertex={setSelectedVertex}
              setObstacles={setObstacles}
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
            />
            {ghosts.map((ghostDNA, index) => (
              <Ghost key={index} ghostDNA={ghostDNA} />
            ))}
          </Suspense>
          <SkyComponent time={time} />
        </Physics>
      </Canvas>
      <Loader />
    </ThreeContainer>
  );
});
