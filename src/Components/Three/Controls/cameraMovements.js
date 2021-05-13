import { useRef, useEffect } from "react";

function updateSource(parameter) {
  parameter.sourceX = parameter.x;
  parameter.sourceY = parameter.y;
  parameter.sourceZ = parameter.z;
}

function updateCoords({ parameters }) {
  // update data with source and target positions
  Object.values(parameters).forEach((parameter) => updateSource(parameter));
}

export function useAnimatedMovement({ parameters, movement, animating }) {
  const prevMovement = useRef(movement);
  useEffect(() => {
    if (movement && movement !== prevMovement.current) {
      updateCoords({
        parameters,
        movement,
      });

      animating.current = true;

      prevMovement.current = movement;
    }
  }, [movement, parameters, animating]);
}
