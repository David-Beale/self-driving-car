import React from "react";
import { useBox } from "@react-three/cannon";

// The vehicle chassis
const Chassis = ({ rotation, position, angularVelocity, ghostRef }) => {
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
    ghostRef
  );

  return (
    <mesh ref={ghostRef} api={api}>
      <boxBufferGeometry attach="geometry" args={[1.7, 1, 4]} />
      <meshLambertMaterial
        transparent={true}
        opacity={0.5}
        color="grey"
        attach="material"
      />
    </mesh>
  );
};

export default Chassis;
