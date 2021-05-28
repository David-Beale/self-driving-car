import React, { forwardRef } from "react";
import { useBox } from "@react-three/cannon";

// The vehicle chassis
const Chassis = forwardRef(({ rotation, position, angularVelocity }, ref) => {
  const boxSize = [1.7, 1, 4]; // roughly the cars's visual dimensions
  const [, api] = useBox(
    () => ({
      mass: 500,
      position,
      rotation: rotation,
      angularVelocity: angularVelocity,
      args: boxSize,
      collisionFilterGroup: 2,
      collisionFilterMask: 1,
    }),
    ref
  );

  return (
    <mesh ref={ref} api={api}>
      <boxBufferGeometry attach="geometry" args={[1.7, 1, 4]} />
      <meshLambertMaterial color="grey" attach="material" />
    </mesh>
  );
});

export default Chassis;
