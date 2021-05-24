import React, { useRef, useEffect } from "react";
import { extend, useFrame, useThree } from "react-three-fiber";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
import * as THREE from "three";

import { useAnimatedMovement } from "./cameraMovements";

// extend THREE to include TrackballControls
extend({ TrackballControls });

export default function Controls({ cameraLock, player }) {
  const controls = useRef();
  const { camera, gl, invalidate } = useThree();

  useFrame(() => {
    // update the view as the vis is interacted with
    controls.current.update();
  });
  useEffect(
    () => void controls.current.addEventListener("change", invalidate),
    [invalidate]
  );

  useEffect(() => {
    camera.position.set(150, 20, 180);
    controls.current.target.set(150, 0, 150);
  }, [camera]);

  // run the layout, animating on change
  useAnimatedMovement({
    controls,
    camera,
    cameraLock,
    player,
  });

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
      keys={[]}
    />
  );
}
