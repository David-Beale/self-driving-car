import React, { forwardRef } from "react";
import { useBox } from "@react-three/cannon";
import Aston from "./Aston";

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
      onCollide: onCollide,
      userData: {
        id: "playerCar",
      },
    }),
    ref
  );

  const onCollide = (e) => {
    // console.log("bonk!", e.body.userData);
  };
  return (
    <mesh ref={ref} api={api}>
      <Aston position={[0, -0.6, 0]} scale={0.01} />
    </mesh>
  );
});

export default Chassis;