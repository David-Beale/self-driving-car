import React from "react";
import { useRaycastVehicle } from "@react-three/cannon";

import Chassis from "./Chassis";
import Wheel from "./Wheel";
import { useWheels } from "../../Car/useWheels";

export default function Vehicle({
  ghostRef,
  vehicleRef,
  position,
  rotation,
  angularVelocity,
}) {
  const [wheels, wheelInfos] = useWheels();

  const [, api] = useRaycastVehicle(
    () => ({
      chassisBody: ghostRef,
      wheels,
      wheelInfos,
      indexForwardAxis: 2,
      indexRightAxis: 0,
      indexUpAxis: 1,
    }),
    vehicleRef
  );

  return (
    <group ref={vehicleRef} api={api}>
      <Chassis
        ghostRef={ghostRef}
        rotation={rotation}
        position={position}
        angularVelocity={angularVelocity}
      />
      <Wheel ref={wheels[0]} />
      <Wheel ref={wheels[1]} />
      <Wheel ref={wheels[2]} />
      <Wheel ref={wheels[3]} />
    </group>
  );
}
