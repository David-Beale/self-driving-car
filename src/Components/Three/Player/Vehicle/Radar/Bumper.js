import React, { useRef } from "react";
import * as THREE from "three";
import { useSphere } from "@react-three/cannon";
import { useFrame } from "react-three-fiber";

export default function Bumper({
  position,
  args,
  onCollideBegin,
  onCollideEnd,
}) {
  const target = useRef(new THREE.Vector3());
  const ref1 = useRef();
  const [, api] = useSphere(() => ({
    // type: "Static",
    type: "Kinematic",

    // isTrigger: true,
    args: [2],
    // position: position,
    onCollide: onCollideBegin,
    onCollideBegin: onCollideBegin,
    // onCollideEnd: onCollideEnd,
    collisionFilterGroup: 1,
    collisionFilterMask: 1,
  }));

  useFrame(() => {
    ref1.current.getWorldPosition(target.current);
    api.position.set(target.current.x, target.current.y, target.current.z);
  });

  return (
    <>
      <mesh ref={ref1} position={position}>
        <sphereBufferGeometry args={args} />
        <meshStandardMaterial color="green" />
      </mesh>
    </>
  );
}
