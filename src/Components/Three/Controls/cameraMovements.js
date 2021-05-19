import { useRef, useEffect } from "react";
import { useFrame } from "react-three-fiber";
import * as d3 from "d3-ease";

function updateSource(parameter) {
  parameter.sourceX = parameter.x;
  parameter.sourceY = parameter.y;
  parameter.sourceZ = parameter.z;
}

const interpolate = (parameter, progress) => {
  if (parameter.sourceX === undefined) return;
  parameter.x =
    (1 - progress) * parameter.sourceX + progress * parameter.targetX;
  parameter.y =
    (1 - progress) * parameter.sourceY + progress * parameter.targetY;
  parameter.z =
    (1 - progress) * parameter.sourceZ + progress * parameter.targetZ;
};

const findFollowX = (angle, x) => {
  return -30 * Math.cos(angle) + x - 150;
};
const findFollowZ = (angle, z) => {
  return 30 * Math.sin(angle) + z - 150;
};

const findFollowTarget = (parameters, player) => {
  parameters.position.targetX = findFollowX(player.rotation, player.position.x);
  parameters.position.targetY = 20;
  parameters.position.targetZ = findFollowZ(player.rotation, player.position.z);

  parameters.target.targetX = player.position.x - 150;
  parameters.target.targetY = 0;
  parameters.target.targetZ = player.position.z - 150;

  parameters.up.targetX = 0;
  parameters.up.targetY = 1;
  parameters.up.targetZ = 0;
};

const findTopDownTarget = (parameters, player) => {
  parameters.position.targetX = player?.position.x - 150 || 0;
  parameters.position.targetY = 30;
  parameters.position.targetZ = player?.position.z - 120 || 0;

  parameters.target.targetX = player?.position.x - 150 || 0;
  parameters.target.targetY = 0;
  parameters.target.targetZ = player?.position.z - 150 || 0;

  parameters.up.targetX = 0;
  parameters.up.targetY = 1;
  parameters.up.targetZ = 0;
};
function interpolateSourceTarget(parameters, player, movement, progress) {
  if (movement === "move") {
    findFollowTarget(parameters, player);
  } else if (movement === "reset") {
    findTopDownTarget(parameters, player);
  }
  Object.values(parameters).forEach((parameter) => {
    interpolate(parameter, progress);
  });
}

export function useAnimatedMovement({ controls, camera, cameraLock, player }) {
  const parameters = useRef({ position: null, target: null, up: null });
  const movement = useRef(null);
  const linearProgress = useRef(0);

  useEffect(() => {
    if (cameraLock === undefined || !player.position.x) {
      return;
    }
    parameters.current.position = { ...camera.position };
    parameters.current.target = { ...controls.current.target };
    parameters.current.up = { ...camera.up };
    linearProgress.current = 0;
    Object.values(parameters.current).forEach((parameter) =>
      updateSource(parameter)
    );
    if (cameraLock) {
      movement.current = "move";
    } else {
      movement.current = "reset";
    }
  }, [cameraLock, camera, controls, player]);

  useFrame(() => {
    if (!movement.current) return;
    if (movement.current === "follow") {
      follow();
    } else {
      move();
    }
  });

  const move = () => {
    if (linearProgress.current < 1) {
      linearProgress.current += 0.01;
      const progress = d3.easeQuadInOut(linearProgress.current);
      interpolateSourceTarget(
        parameters.current,
        player,
        movement.current,
        progress
      );
      camera.position.set(...Object.values(parameters.current.position));
      controls.current.target.set(...Object.values(parameters.current.target));
      camera.up.set(...Object.values(parameters.current.up));
    } else {
      if (movement.current === "move") movement.current = "follow";
      else movement.current = false;
    }
  };
  const follow = () => {
    camera.position.set(
      findFollowX(player.rotation, player.position.x),
      20,
      findFollowZ(player.rotation, player.position.z)
    );
    controls.current.target.set(
      player.position.x - 150,
      0,
      player.position.z - 150
    );
    camera.up.set(0, 1, 0);
  };
}
