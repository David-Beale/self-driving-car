import * as THREE from "three";
import { useRaycastClosest } from "@react-three/cannon";
import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

export default function Ray({ from, to, angle, player }) {
  const geometry = useRef(new THREE.BufferGeometry());
  const endRef = useRef();
  const fromRef = useRef();
  const worldVectorFrom = useRef(new THREE.Vector3());
  const worldVectorTo = useRef(new THREE.Vector3());
  const [color, setColor] = useState("limegreen");

  const [rayFrom, setRayFrom] = useState(from);
  const [rayTo, setRayTo] = useState(to);

  useRaycastClosest(
    {
      from: rayFrom,
      to: rayTo,
      collisionFilterGroup: 2,
      collisionFilterMask: 1,
    },
    (result) => {
      if (result.hasHit && result.body?.userData.id === "obstacle") {
        player.obstacles[angle] = result.distance;
        setColor("red");
      } else if (!result.hasHit) {
        player.obstacles[angle] = false;
        setColor("red");
      }
    },
    [rayFrom, rayTo]
  );

  useFrame(() => {
    if (!fromRef.current) return;
    setColor("limegreen");
    fromRef.current.getWorldPosition(worldVectorFrom.current);
    endRef.current.getWorldPosition(worldVectorTo.current);
    setRayTo([worldVectorTo.current.x, 0, worldVectorTo.current.z]);
    setRayFrom([worldVectorFrom.current.x, 0.5, worldVectorFrom.current.z]);
  });

  useEffect(() => {
    geometry.current.setFromPoints(
      [from, to].map((v) => new THREE.Vector3(...v))
    );
  }, [from, to]);

  return (
    <>
      <object3D ref={fromRef} position={from} />
      <object3D ref={endRef} position={to} />
      <line geometry={geometry.current}>
        <lineBasicMaterial color={color} />
      </line>
    </>
  );
}
