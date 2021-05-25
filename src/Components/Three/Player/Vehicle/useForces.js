import { useEffect } from "react";

export const useForces = (api, playerRef, forces, reset) => {
  useEffect(() => {
    const { steering, engine, braking } = forces;
    api.applyEngineForce(engine, 2);
    api.applyEngineForce(engine, 3);

    api.setSteeringValue(steering, 0);
    api.setSteeringValue(steering, 1);

    for (let i = 0; i < 4; i++) {
      api.setBrake(braking, i);
    }
  }, [forces, api]);

  useEffect(() => {
    if (!reset) return;
    playerRef.current.api.position.set(147.5, 4, 157.5);
    playerRef.current.api.angularVelocity.set(0, 0, 0);
    playerRef.current.api.velocity.set(0, 0, 0);
    playerRef.current.api.rotation.set(0, Math.PI, 0);
  }, [reset, playerRef]);
};
