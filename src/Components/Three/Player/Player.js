import { useEffect, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import PlayerPath from "./PlayerPath";
import playerClass from "./playerClass";
import ClickIndicator from "./ClickIndicator";

const newPlayer = new playerClass();

export default function Player({
  playerRef,
  map,
  selectedVertex,
  pathfindingMode,
  dispatchStats,
}) {
  const gltf = useLoader(GLTFLoader, "./playerCar3/scene.gltf");

  useEffect(() => {
    newPlayer.addMap(map);
  }, [map]);

  useFrame(() => {
    newPlayer.run();
    playerRef.current.position.x = newPlayer.currentX;
    playerRef.current.position.y = newPlayer.currentY;
    playerRef.current.rotation.y = Math.PI / 2 + newPlayer.angle;
  });

  return (
    <>
      <primitive
        ref={playerRef}
        object={gltf.scene}
        position={[75, -75, 11]}
        scale={0.01}
        rotation={[Math.PI / 2, Math.PI / 2, 0]}
      />
      <PlayerPath
        newPlayer={newPlayer}
        pathfindingMode={pathfindingMode}
        selectedVertex={selectedVertex}
        dispatchStats={dispatchStats}
      />
      <ClickIndicator selectedVertex={selectedVertex} />
    </>
  );
}
