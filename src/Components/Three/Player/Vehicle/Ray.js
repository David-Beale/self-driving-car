import * as THREE from "three";
import { useBox, useParticle, useSphere } from "@react-three/cannon";
import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

export default function Ray({ from, to, setHit }) {
  const geometry = useRef(new THREE.BufferGeometry());
  const lineRef = useRef();
  const worldVector = useRef(new THREE.Vector3());
  const [color, setColor] = useState("black");

  const onCollide = (e) => {
    console.log("bonk!", e.body.userData);
    setColor("red");
  };
  const [, api] = useParticle(() => ({
    type: "Kinetic",
    mass: 1,
    onCollide,
  }));

  useFrame(() => {
    setColor("black");
    lineRef.current.getWorldPosition(worldVector.current);
    if (!worldVector.current.x) return;
    api.position.set(
      worldVector.current.x,
      worldVector.current.y,
      worldVector.current.z
    );
  });

  useEffect(() => {
    geometry.current.setFromPoints(
      [from, to].map((v) => new THREE.Vector3(...v))
    );
  }, [from, to]);

  return (
    <>
      <mesh ref={lineRef} position={to}>
        <sphereBufferGeometry args={[0.1, 64, 64]} />
        <meshNormalMaterial />
      </mesh>
      <line geometry={geometry.current}>
        <lineBasicMaterial color={color} />
      </line>
    </>
  );
}
