import { useEffect } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import PlayerPath from "./Path/PlayerPath";
import playerClass from "./playerClass";
import ClickIndicator from "./ClickIndicator";
import Vehicle from "./Vehicle/Vehicle";

// const newPlayer = new playerClass();

export default function Player({
  // playerRef,
  map,
  selectedVertex,
  pathfindingMode,
  dispatchStats,
}) {
  // const gltf = useLoader(GLTFLoader, "./playerCar4/scene.gltf");

  // useEffect(() => {
  //   newPlayer.addMap(map);
  // }, [map]);

  useFrame(() => {
    // newPlayer.run();
    // playerRef.current.position.x = newPlayer.currentX;
    // playerRef.current.position.y = newPlayer.currentY;
    // playerRef.current.rotation.y = Math.PI / 2 + newPlayer.angle;
  });

  // const [playerRef, playerApi] = useBox(() => ({
  //   type: "Dynamic",
  //   mass: 1,
  //   args: [25, 5, 5],
  //   position: [75, -75, 11],
  //   rotation: [Math.PI / 2, Math.PI / 2, 0],
  // }));

  return (
    <>
      <Vehicle
        position={[147.5, 5, 157.5]}
        rotation={[0, Math.PI / 2, 0]}
        angularVelocity={[0, 1.69, 0]}
      />
      {/* <primitive ref={playerRef} object={gltf.scene} scale={0.1} /> */}
      {/* <PlayerPath
        newPlayer={newPlayer}
        pathfindingMode={pathfindingMode}
        selectedVertex={selectedVertex}
        dispatchStats={dispatchStats}
      />
      <ClickIndicator selectedVertex={selectedVertex} /> */}
    </>
  );
}
