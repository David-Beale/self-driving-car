import { useEffect } from "react";

export const useControls = (api, steeringValue, engineForce, brakeForce) => {
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
};
