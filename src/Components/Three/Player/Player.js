import { useEffect, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import PlayerPath from "./PlayerPath";
import playerClass from "./playerClass";
import ClickIndicator from "./ClickIndicator";

const newPlayer = new playerClass();

export default function Player({
  map,
  selectedVertex,
  pathfindingMode,
  dispatchStats,
}) {
  const gltf = useLoader(GLTFLoader, "./playerCar/scene.gltf");
  const playerRef = useRef();

  useEffect(() => {
    newPlayer.addMap(map);
  }, [map]);

  useFrame(() => {
    newPlayer.run();
    playerRef.current.position.x = newPlayer.currentX;
    playerRef.current.position.y = newPlayer.currentY;
    playerRef.current.rotation.z = Math.PI / 2 + newPlayer.angle;
  });

  return (
    <>
      <primitive
        ref={playerRef}
        object={gltf.scene.children[0]}
        position={[75, -75, 11]}
        scale={selectedVertex ? 0.05 : 0}
        rotation={[0, 0, Math.PI / 2]}
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
