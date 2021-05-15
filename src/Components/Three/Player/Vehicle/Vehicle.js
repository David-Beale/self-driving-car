import React, { useRef } from "react";
import { useRaycastVehicle } from "@react-three/cannon";

import Chassis from "./Chassis";
import Wheel from "./Wheel";
import { useWheels } from "./useWheels";
import { useControls } from "./useControls";

export default function Vehicle({ position, rotation, angularVelocity }) {
  // chassisBody
  const chassis = useRef();

  const [wheels, wheelInfos] = useWheels();

  const [vehicle, api] = useRaycastVehicle(() => ({
    chassisBody: chassis,
    wheels,
    wheelInfos,
    indexForwardAxis: 2,
    indexRightAxis: 0,
    indexUpAxis: 1,
  }));

  useControls(api);

  return (
    <group ref={vehicle}>
      <Chassis
        ref={chassis}
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
