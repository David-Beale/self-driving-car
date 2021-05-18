import { useEffect } from "react";

export const useControls = (
  api,
  playerRef,
  steeringValue,
  engineForce,
  brakeForce,
  reset
) => {
  useEffect(() => {
    api.applyEngineForce(engineForce, 2);
    api.applyEngineForce(engineForce, 3);
  }, [engineForce, api]);
  useEffect(() => {
    api.setSteeringValue(steeringValue, 0);
    api.setSteeringValue(steeringValue, 1);
  }, [steeringValue, api]);
  useEffect(() => {
    for (let i = 0; i < 4; i++) {
      api.setBrake(brakeForce, i);
    }
  }, [brakeForce, api]);
  useEffect(() => {
    if (!reset) return;
    playerRef.current.api.position.set(147.5, 10, 157.5);
    playerRef.current.api.velocity.set(0, 0, 0);
    playerRef.current.api.angularVelocity.set(-1.49 * Math.PI, 0, 0);
    playerRef.current.api.rotation.set(0, Math.PI, 0);
  }, [reset, playerRef]);
};
