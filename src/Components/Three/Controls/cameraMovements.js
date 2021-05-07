import { useRef, useEffect } from "react";

function start(parameters) {
  parameters.position.targetX = 0;
  parameters.position.targetY = 0;
  parameters.position.targetZ = 0;

  parameters.target.targetX = 0;
  parameters.target.targetY = 0;
  parameters.target.targetZ = 0;

  parameters.up.targetX = 0;
  parameters.up.targetY = 1;
  parameters.up.targetZ = 0;
}
function move(parameters, data) {
  parameters.position.targetX = data[0];
  parameters.position.targetY = data[1];
  parameters.position.targetZ = data[2];

  parameters.target.targetX = data[0];
  parameters.target.targetY = data[1];
  parameters.target.targetZ = 0;

  parameters.up.targetX = 0;
  parameters.up.targetY = 1;
  parameters.up.targetZ = 0;
}

function updateSource(parameter) {
  parameter.sourceX = parameter.x;
  parameter.sourceY = parameter.y;
  parameter.sourceZ = parameter.z;
}

function updateCoords({ parameters, movement }) {
  // update data with source and target positions
  Object.values(parameters).forEach((parameter) => updateSource(parameter));

  const { name, data } = movement;
  switch (name) {
    case "start":
      start(parameters);
      break;
    default:
      move(parameters, data);
      break;
  }
}

export function useAnimatedMovement({ parameters, movement, animate }) {
  const prevMovement = useRef(movement);
  useEffect(() => {
    if (movement && movement !== prevMovement.current) {
      updateCoords({
        parameters,
        movement,
      });

      animate.current = true;

      prevMovement.current = movement;
    }
  }, [movement, parameters, animate]);
}
