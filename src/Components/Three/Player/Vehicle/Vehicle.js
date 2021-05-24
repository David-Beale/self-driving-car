import React from "react";
import { useRaycastVehicle } from "@react-three/cannon";

import Chassis from "./Chassis";
import Wheel from "./Wheel";
import { useWheels } from "./useWheels";
import { useForces } from "./useForces";

export default function Vehicle({
  playerRef,
  followCameraRef,
  position,
  rotation,
  angularVelocity,
  forces,
  reset,
}) {
  const [wheels, wheelInfos] = useWheels();

  const [vehicle, api] = useRaycastVehicle(() => ({
    chassisBody: playerRef,
    wheels,
    wheelInfos,
    indexForwardAxis: 2,
    indexRightAxis: 0,
    indexUpAxis: 1,
  }));

  useForces(api, playerRef, forces, reset);

  return (
    <group ref={vehicle}>
      <Chassis
        ref={playerRef}
        followCameraRef={followCameraRef}
        rotation={rotation}
        position={position}
        angularVelocity={angularVelocity}
      />
      <Wheel ref={wheels[0]} leftSide />
      <Wheel ref={wheels[1]} />
      <Wheel ref={wheels[2]} leftSide />
      <Wheel ref={wheels[3]} />
    </group>
  );
}
