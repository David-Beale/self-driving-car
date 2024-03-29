import React, { useRef, useEffect } from "react";
import { extend, useFrame, useThree, invalidate } from "@react-three/fiber";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
import * as THREE from "three";

import { useAnimatedMovement } from "./cameraMovements";

// extend THREE to include TrackballControls
extend({ TrackballControls });

export default function Controls({ cameraLock, player, isPaused }) {
  const controls = useRef();
  const { camera, gl } = useThree();

  useFrame(() => {
    // update the view as the vis is interacted with
    controls.current.update();
    if (!isPaused) invalidate();
  });

  useEffect(() => {
    camera.position.set(147.5, 20, 222.5);
    controls.current.target.set(147.5, 0, 192.5);
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
