import React, {
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
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

const Controls = (props, ref) => {
  const controls = useRef();
  const { camera, gl, invalidate } = useThree();

  const [movement, setMovement] = useState(null);
  const parameters = useRef({ position: null, target: null, up: null });
  const linearProgress = useRef(0);
  const animate = useRef(false);

  function interpolateSourceTarget(parameters, progress) {
    Object.values(parameters).forEach((parameter) =>
      interpolate(parameter, progress)
    );
  }

  useFrame(() => {
    if (animate.current) {
      if (linearProgress.current < 1) {
        const easing =
          movement.easing === "slow" ? d3.easeCubicInOut : d3.easeQuadInOut;
        const delta = movement.easing === "slow" ? 0.005 : 0.01;

        linearProgress.current += delta;
        const progress = easing(linearProgress.current);
        interpolateSourceTarget(parameters.current, progress);
        camera.position.set(...Object.values(parameters.current.position));
        controls.current.target.set(
          ...Object.values(parameters.current.target)
        );
        camera.up.set(...Object.values(parameters.current.up));
      } else {
        animate.current = false;
        linearProgress.current = 0;
      }
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
    animate,
  });

  useImperativeHandle(ref, () => ({
    moveCamera: (movement) => {
      parameters.current.position = { ...camera.position };
      parameters.current.target = { ...controls.current.target };
      parameters.current.up = { ...camera.up };
      setMovement(movement);
    },
  }));

  return (
    <trackballControls
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
};

export default forwardRef(Controls);
