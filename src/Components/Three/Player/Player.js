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

  const [lines, setLines] = useState([]);

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

    if (!newPlayer.pathArray) return;
    const remainingPath = newPlayer.pathArray.slice(newPlayer.pathIndex + 1);
    const newLines = [];
    const vertex = map.graphObj[remainingPath[0]];
    newLines.push(new THREE.Vector3(vertex.x - 25, -vertex.y + 25, 12));

    for (let i = 1; i < remainingPath.length; i++) {
      const prevVertex = map.graphObj[remainingPath[i - 1]];
      const vertex = map.graphObj[remainingPath[i]];
      const nextVertex = map.graphObj[remainingPath[i + 1]];
      const nextNextVertex = map.graphObj[remainingPath[i + 2]];

      const turn =
        nextVertex &&
        prevVertex.x !== nextVertex.x &&
        prevVertex.y !== nextVertex.y;

      if (!turn) {
        newLines.push(new THREE.Vector3(vertex.x - 25, -vertex.y + 25, 12));
        continue;
      }

      const endVertex = nextNextVertex || nextVertex;
      const increment = nextNextVertex ? 2 : 1;
      // newLines.pop();
      newLines.push(
        new THREE.Vector3(
          (prevVertex.x + vertex.x) / 2 - 25,
          -((prevVertex.y + vertex.y) / 2) + 25,
          12
        )
      );
      // newLines.push(
      //   new THREE.Vector3(
      //     (nextVertex.x + vertex.x) / 2 - 25,
      //     -((nextVertex.y + vertex.y) / 2) + 25,
      //     12
      //   )
      // );
      if (nextNextVertex) {
        newLines.push(
          new THREE.Vector3(
            (nextVertex.x + nextNextVertex.x) / 2 - 25,
            -((nextVertex.y + nextNextVertex.y) / 2) + 25,
            12
          )
        );
      }
      newLines.push(new THREE.Vector3(endVertex.x - 25, -endVertex.y + 25, 12));
      i += increment;
    }
    console.log(newLines);
    try {
      setLines(
        new THREE.CatmullRomCurve3(newLines, false, "chordal", 0.3).getPoints(
          1000
        )
      );
    } catch (error) {
      console.log(error);
    }
  });
  return (
    <>
      <primitive
        ref={playerRef}
        object={gltf.scene.children[0]}
        position={[75, -75, 11]}
        scale={selectedVertex || newPlayer.currentVertex ? 0.05 : 0}
        rotation={[0, 0, Math.PI / 2]}
      />

      <mesh>
        <meshLine attach="geometry" vertices={lines} />
        <meshLineMaterial
          attach="material"
          transparent
          depthTest={false}
          lineWidth={3}
          color={"blue"}
          // dashArray={0.1}
          // dashRatio={0.9}
        />
      </mesh>

      {/* {lines.map((line) => {
        const { start, end, mid } = line;
        if (!mid) {
          return <Line points={[start, end]} color="blue" lineWidth={2} />;
        }
        console.log("quad", start, mid, end);
        return (
          <QuadraticBezierLine
            start={start}
            end={end}
            mid={mid}
            color="blue"
            lineWidth={2}
          />
        );
        // }
      })} */}
    </>
  );
}
