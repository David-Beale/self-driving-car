import * as THREE from "three";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useBox } from "@react-three/cannon";
import Aston from "./Aston";
import Ray from "./Ray";

const from = [0, 0, 0];
// The vehicle chassis
const Chassis = ({
  rotation,
  position,
  angularVelocity,
  followCameraRef,
  playerRef,
  time,
  player,
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
    let segments = 4;
    let curve = new THREE.EllipseCurve(
      0,
      0,
      12,
      12,
      (3.5 * Math.PI) / 8,
      (4.5 * Math.PI) / 8,
      false,
      0
    );
    let curvePoints = curve.getPoints(segments);
    let eachAngle = (1 * Math.PI) / (8 * segments);
    let currentAngle = (0.5 * Math.PI) / 8;

    const longRangePoints = curvePoints.map((end) => {
      const pos = [end.x, 0, end.y];
      const angle = currentAngle;
      currentAngle -= eachAngle;
      return { pos, angle };
    });

    segments = 14;
    curve = new THREE.EllipseCurve(
      0,
      0,
      7,
      7,
      (2 * Math.PI) / 8,
      (6 * Math.PI) / 8,
      false,
      0
    );
    curvePoints = curve.getPoints(segments);
    eachAngle = (4 * Math.PI) / (8 * segments);
    currentAngle = (2 * Math.PI) / 8;

    const shortRangePoints = curvePoints.map((end) => {
      const pos = [end.x, 0, end.y];
      const angle = currentAngle;
      currentAngle -= eachAngle;
      return { pos, angle };
    });
    return [...longRangePoints, ...shortRangePoints];
  }, []);
  return (
    <mesh ref={playerRef} api={api}>
      {rayEndPoints.map((ray, index) => {
        return (
          <Ray
            key={index}
            from={from}
            to={ray.pos}
            angle={ray.angle}
            player={player}
          />
        );
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
