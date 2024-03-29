import React from "react";
import { useRaycastVehicle } from "@react-three/cannon";

import Chassis from "./Chassis";
import Wheel from "./Wheel";
import { useWheels } from "../../Car/useWheels";

export default function Vehicle({
  chassisRef,
  vehicleRef,
  followCameraRef,
  position,
  rotation,
  angularVelocity,
  time,
  playerRef,
  obstacles,
  quality,
}) {
  const [wheels, wheelInfos] = useWheels();

  const [, api] = useRaycastVehicle(
    () => ({
      chassisBody: chassisRef,
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
        chassisRef={chassisRef}
        followCameraRef={followCameraRef}
        rotation={rotation}
        position={position}
        angularVelocity={angularVelocity}
        time={time}
        playerRef={playerRef}
        obstacles={obstacles}
        quality={quality}
      />
      <Wheel ref={wheels[0]} leftSide />
      <Wheel ref={wheels[1]} />
      <Wheel ref={wheels[2]} leftSide />
      <Wheel ref={wheels[3]} />
    </group>
  );
}
