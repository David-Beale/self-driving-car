import { useEffect } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import PlayerPath from "./Path/PlayerPath";
import playerClass from "./playerClass";
import ClickIndicator from "./ClickIndicator";
import { useBox, useCylinder } from "@react-three/cannon";
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

  function Pillar(props) {
    const args = [3.5, 3.5, 10, 36];
    const [ref] = useCylinder(() => ({
      mass: 1,
      args,
      ...props,
    }));
    return (
      <mesh ref={ref}>
        <cylinderBufferGeometry args={args} />
        <meshNormalMaterial />
      </mesh>
    );
  }

  return (
    <>
      <Vehicle
        position={[152.5, 5, 152.5]}
        rotation={[0, Math.PI / 2, 0]}
        angularVelocity={[0, 0.5, 0]}
      />
      <Pillar
        rotation={[0, Math.PI / 2, 0]}
        position={[160, 5, 150]}
        userData={{ id: "pillar-1" }}
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
