import { useEffect, useRef, useState } from "react";
import { useKeyboardControls } from "./useKeyboardControls";
import { useMouseControls } from "./useMouseControls";

export const useControls = (
  player,
  parameters,
  mode,
  setGauges,
  selectedVertex
) => {
  const [forces, setForces] = useState({ steering: 0, engine: 0, braking: 0 });
  const [reset, setReset] = useState(false);

  const modeRef = useRef();

  modeRef.current = mode;

  const getGuagevals = (steering, engine, braking) => {
    const convertSteering = (steering) => {
      if (!steering) return 0;
      if (steering < -1) return 1;
      if (steering > 1) return -1;
      return -steering;
    };
    const getAccel = (engine, braking) => {
      if (braking) return -braking / parameters.maxBrakeForce;
      return -engine / parameters.maxForce;
    };
    return {
      steering: convertSteering(steering),
      accel: getAccel(engine, braking),
    };
  };

  useKeyboardControls(
    setForces,
    setReset,
    parameters,
    mode,
    setGauges,
    getGuagevals
  );

  useMouseControls(
    selectedVertex,
    player,
    modeRef,
    parameters,
    setForces,
    setGauges,
    getGuagevals
  );

  useEffect(() => {
    if (!reset) return;
    player.arrayOfSteps = [];
    player.pathGeometry.setVertices([]);
  }, [player, reset]);

  return [forces, reset];
};
