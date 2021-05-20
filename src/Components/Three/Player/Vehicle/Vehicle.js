import React from "react";
import { useRaycastVehicle } from "@react-three/cannon";

import Chassis from "./Chassis";
import Wheel from "./Wheel";
import { useWheels } from "./useWheels";
import { useControls } from "./useControls";

export default function Vehicle({
  playerRef,
  position,
  rotation,
  angularVelocity,
  steeringValue,
  engineForce,
  brakeForce,
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

  useControls(api, playerRef, steeringValue, engineForce, brakeForce, reset);

  return (
    <group ref={vehicle}>
      <Chassis
        ref={playerRef}
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
