import * as THREE from "three";
import { useEffect, useRef, useState, useMemo } from "react";
import { extend, useFrame, useLoader } from "@react-three/fiber";
import { Line, QuadraticBezierLine } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as meshline from "threejs-meshline";

import playerClass from "./playerClass";

extend(meshline);
const newPlayer = new playerClass();

export default function Player({ map, selectedVertex }) {
  const gltf = useLoader(GLTFLoader, "./scene.gltf");
  const playerRef = useRef();
  const pathRef = useRef();

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
    if (newPlayer.arrayOfSteps.length)
      pathRef.current.geometry.setVertices(newPlayer.arrayOfSteps);
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

      <mesh ref={pathRef}>
        <meshLine attach="geometry" vertices={[]} />
        <meshLineMaterial
          attach="material"
          transparent
          depthTest={false}
          lineWidth={3}
          color={"blue"}
        />
      </mesh>
    </>
  );
}
