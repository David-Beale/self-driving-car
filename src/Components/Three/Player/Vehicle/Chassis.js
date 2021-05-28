import React from "react";
import { useBox } from "@react-three/cannon";
import Aston from "./Aston";

// The vehicle chassis
const Chassis = ({
  rotation,
  position,
  angularVelocity,
  followCameraRef,
  playerRef,
}) => {
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
      onCollide: onCollide,
      userData: {
        id: "playerCar",
      },
    }),
    playerRef
  );

  const onCollide = (e) => {
    // console.log("bonk!", e.body.userData);
  };
  return (
    <mesh ref={playerRef} api={api}>
      <Aston position={[0, -0.6, 0]} scale={0.01} />
      <object3D ref={followCameraRef} position={[0, 5, -8]} />
    </mesh>
  );
};

export default Chassis;
