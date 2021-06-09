import * as THREE from "three";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useBox } from "@react-three/cannon";
import Aston from "./Aston";
import Ray from "./Ray";

const start = [0, 0, 0];
// The vehicle chassis
const Chassis = ({
  rotation,
  position,
  angularVelocity,
  followCameraRef,
  playerRef,
  time,
}) => {
  const spotlightTarget = useRef();
  const [target, setTarget] = useState(undefined);
  const boxSize = [1.7, 1, 4]; // roughly the cars's visual dimensions
  const [, api] = useBox(
    () => ({
      mass: 500,
      position,
      rotation: rotation,
      angularVelocity: angularVelocity,
      args: boxSize,
      collisionFilterGroup: 2,
      collisionFilterMask: 1,
      // onCollide: onCollide,
      userData: {
        id: "playerCar",
      },
    }),
    playerRef
  );

  useEffect(() => {
    setTarget(spotlightTarget.current);
  }, []);
  // const onCollide = (e) => {
  // console.log("bonk!", e.body.userData);
  // };

  const rayEndPoints = useMemo(() => {
    const curve = new THREE.EllipseCurve(0, 0, 5, 5, 0, Math.PI, false, 0);
    const curvePoints = curve.getPoints(10);

    return curvePoints.map((end) => [end.x, -0.5, end.y]);
  }, []);

  return (
    <mesh ref={playerRef} api={api}>
      {rayEndPoints.map((to, index) => {
        return <Ray key={index} from={start} to={to} />;
      })}
      <Aston position={[0, -0.7, 0]} scale={0.01} />
      <object3D ref={followCameraRef} position={[0, 3, -8]} />
      <object3D ref={spotlightTarget} position={[0, -2, 10]} />
      {time === "night" && (
        <>
          <spotLight
            position={[-0.8, -0.15, 1.9]}
            intensity={8}
            target={target}
            distance={20}
            angle={0.5}
            penumbra={0.4}
            color="rgb(24, 235, 254)"
          />
          <spotLight
            position={[0.8, -0.15, 1.9]}
            intensity={8}
            target={target}
            distance={20}
            angle={0.5}
            penumbra={0.4}
            color="rgb(24, 235, 254)"
          />
        </>
      )}
    </mesh>
  );
};

export default Chassis;
