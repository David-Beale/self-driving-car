import React, { useRef, useState, useEffect } from "react";
import { extend, useThree, useFrame } from "react-three-fiber";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
import * as THREE from "three";
import * as d3 from "d3-ease";
import { useAnimatedMovement } from "./cameraMovements";

// extend THREE to include TrackballControls
extend({ TrackballControls });

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

export default function Controls(
  { cameraLock, cameraReset, roadWorks, playerRef },
  ref
) {
  const controls = useRef();
  const { camera, gl, invalidate } = useThree();

  const [movement, setMovement] = useState(null);
  const parameters = useRef({ position: null, target: null, up: null });
  const linearProgress = useRef(0);
  const animating = useRef(false);
  const following = useRef(false);

  const findFollowTarget = (parameters) => {
    parameters.position.targetX = findFollowX(
      playerRef.current.rotation.y,
      playerRef.current.position.x
    );
    parameters.position.targetY = findFollowY(
      playerRef.current.rotation.y,
      playerRef.current.position.y
    );
    parameters.position.targetZ = 100;

    parameters.target.targetX = playerRef.current.position.x - 1500;
    parameters.target.targetY = playerRef.current.position.y + 1500;
    parameters.target.targetZ = 0;

    parameters.up.targetX = 0;
    parameters.up.targetY = 0;
    parameters.up.targetZ = 1;
  };
  const findTopDownTarget = (parameters) => {
    parameters.position.targetX = playerRef.current?.position.x - 1500 || 0;
    parameters.position.targetY = playerRef.current?.position.y + 1500 || 0;
    parameters.position.targetZ = 1250;

    parameters.target.targetX = playerRef.current?.position.x - 1500 || 0;
    parameters.target.targetY = playerRef.current?.position.y + 1500 || 0;
    parameters.target.targetZ = 0;

    parameters.up.targetX = 0;
    parameters.up.targetY = 1;
    parameters.up.targetZ = 0;
  };

  function interpolateSourceTarget(parameters, progress) {
    if (movement.name === "move") {
      findFollowTarget(parameters);
    } else {
      findTopDownTarget(parameters);
    }
    Object.values(parameters).forEach((parameter) => {
      interpolate(parameter, progress);
    });
  }
  const animate = () => {
    if (linearProgress.current < 1) {
      const easing = d3.easeQuadInOut;
      const delta = 0.01;

      linearProgress.current += delta;
      const progress = easing(linearProgress.current);
      interpolateSourceTarget(parameters.current, progress);
      camera.position.set(...Object.values(parameters.current.position));
      controls.current.target.set(...Object.values(parameters.current.target));
      camera.up.set(...Object.values(parameters.current.up));
    } else {
      animating.current = false;
      linearProgress.current = 0;
      if (movement.name === "move") following.current = true;
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
  useFrame(() => {
    if (animating.current) {
      animate();
    } else if (following.current) {
      follow();
    }
    // update the view as the vis is interacted with
    controls.current.update();
  });

  useEffect(
    () => void controls.current.addEventListener("change", invalidate),
    [invalidate]
  );
  useEffect(() => {
    camera.position.set(0, 0, 1250);
    controls.current.target.set(0, 0, 0);
  }, [camera]);

  // run the layout, animating on change
  useAnimatedMovement({
    parameters: parameters.current,
    movement,
    animating,
  });

  useEffect(() => {
    parameters.current.position = { ...camera.position };
    parameters.current.target = { ...controls.current.target };
    parameters.current.up = { ...camera.up };
    animating.current = false;
    following.current = false;
    if (cameraLock) {
      setMovement({ name: "move" });
    } else {
      setMovement({ name: "start" });
    }
  }, [cameraLock, camera]);

  return (
    <trackballControls
      enabled={!roadWorks}
      ref={controls}
      args={[camera, gl.domElement]}
      enableDamping
      dynamicDampingFactor={0.1}
      maxDistance={3000}
      mouseButtons={{
        LEFT: THREE.MOUSE.PAN, // make pan the default instead of rotate
        MIDDLE: THREE.MOUSE.ZOOM,
        RIGHT: THREE.MOUSE.ROTATE,
      }}
    />
  );
}
