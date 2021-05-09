import { useEffect, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import playerClass from "./playerClass";
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
    playerRef.current.position.x = newPlayer.currentX - 50;
    playerRef.current.position.y = -newPlayer.currentY + 50;
    playerRef.current.rotation.z =
      -Math.PI / 2 - (newPlayer.carAngle * Math.PI) / 180;
  });

  return (
    <primitive
      ref={playerRef}
      object={gltf.scene.children[0]}
      position={[75, -75, 11]}
      scale={selectedVertex || newPlayer.currentVertex ? 0.05 : 0}
      rotation={[0, 0, Math.PI / 2]}
    />
  );
}
