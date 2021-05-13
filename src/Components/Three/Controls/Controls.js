import React, { useRef, useEffect } from "react";
import { extend, useThree } from "react-three-fiber";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
import * as THREE from "three";

import { useAnimatedMovement } from "./cameraMovements";

// extend THREE to include TrackballControls
extend({ TrackballControls });

export default function Controls({ cameraLock, roadWorks, playerRef }) {
  const controls = useRef();
  const { camera, gl, invalidate } = useThree();

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
    controls,
    camera,
    cameraLock,
    playerRef,
  });

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
