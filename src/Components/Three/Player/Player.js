import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { Line, QuadraticBezierLine } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import playerClass from "./playerClass";

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
    for (let i = 1; i < remainingPath.length; i++) {
      const prevVertex = map.graphObj[remainingPath[i - 1]];
      const vertex = map.graphObj[remainingPath[i]];
      const nextVertex = map.graphObj[remainingPath[i + 1]];
      const nextNextVertex = map.graphObj[remainingPath[i + 2]];

      const start = [prevVertex.x - 25, -prevVertex.y + 25, 12];
      let end = [vertex.x - 25, -vertex.y + 25, 12];

      const turn1 =
        nextVertex &&
        prevVertex.x !== nextVertex.x &&
        prevVertex.y !== nextVertex.y;
      // const turn2 =
      //   nextNextVertex.x !== nextVertex.x || nextNextVertex.y !== nextVertex.y;
      let mid = null;
      if (turn1) {
        const endVertex = nextNextVertex || nextVertex;
        const increment = nextNextVertex ? 2 : 1;

        mid = [
          (nextVertex.x + vertex.x) / 2 - 25,
          -((nextVertex.y + vertex.y) / 2) + 25,
          12,
        ];
        end = [endVertex.x - 25, -endVertex.y + 25, 12];
        i += increment;
      }

      newLines.push({ start, end, mid });
    }
    setLines(newLines);
    // console.log(newLines);
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

      {lines.map((line) => {
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
      })}
    </>
  );
}
