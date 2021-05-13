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
  return 150 * Math.cos(angle + Math.PI / 2) + x - 1500;
};
const findFollowY = (angle, y) => {
  return 150 * Math.sin(angle + Math.PI / 2) + y + 1500;
};

const findFollowTarget = (parameters, player) => {
  parameters.position.targetX = findFollowX(
    player.rotation.y,
    player.position.x
  );
  parameters.position.targetY = findFollowY(
    player.rotation.y,
    player.position.y
  );
  parameters.position.targetZ = 100;

  parameters.target.targetX = player.position.x - 1500;
  parameters.target.targetY = player.position.y + 1500;
  parameters.target.targetZ = 0;

  parameters.up.targetX = 0;
  parameters.up.targetY = 0;
  parameters.up.targetZ = 1;
};

const findTopDownTarget = (parameters, player) => {
  parameters.position.targetX = player?.position.x - 1500 || 0;
  parameters.position.targetY = player?.position.y + 1500 || 0;
  parameters.position.targetZ = 1250;

  parameters.target.targetX = player?.position.x - 1500 || 0;
  parameters.target.targetY = player?.position.y + 1500 || 0;
  parameters.target.targetZ = 0;

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

export function useAnimatedMovement({
  controls,
  camera,
  cameraLock,
  playerRef,
}) {
  const parameters = useRef({ position: null, target: null, up: null });
  const movement = useRef(null);
  const linearProgress = useRef(0);

  useEffect(() => {
    if (cameraLock === undefined) {
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
  }, [cameraLock, camera, controls]);

  useFrame(() => {
    if (!movement.current) return;
    if (movement.current === "follow") {
      follow();
    } else {
      move();
    }
    // update the view as the vis is interacted with
    controls.current.update();
  });

  const move = () => {
    if (linearProgress.current < 1) {
      linearProgress.current += 0.01;
      const progress = d3.easeQuadInOut(linearProgress.current);
      interpolateSourceTarget(
        parameters.current,
        playerRef.current,
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
      findFollowX(playerRef.current.rotation.y, playerRef.current.position.x),
      findFollowY(playerRef.current.rotation.y, playerRef.current.position.y),
      100
    );
    controls.current.target.set(
      playerRef.current.position.x - 1500,
      playerRef.current.position.y + 1500,
      0
    );
    camera.up.set(0, 0, 1);
  };
}
