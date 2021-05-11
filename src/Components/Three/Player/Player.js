import { useEffect, useRef } from "react";
import { extend, useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as meshline from "threejs-meshline";
import PlayerPath from "./PlayerPath";
import playerClass from "./playerClass";
import ClickIndicator from "./ClickIndicator";

extend(meshline);
const newPlayer = new playerClass();

export default function Player({ map, selectedVertex }) {
  const gltf = useLoader(GLTFLoader, "./scene.gltf");
  const playerRef = useRef();

  useEffect(() => {
    newPlayer.addMap(map);
  }, [map]);

  useEffect(() => {
    if (!selectedVertex) return;
    newPlayer.click(selectedVertex);
  }, [selectedVertex]);

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
      <PlayerPath newPlayer={newPlayer} />
      <ClickIndicator selectedVertex={selectedVertex} />
    </>
  );
}
