import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import PlayerPath from "./Path/PlayerPath";
import playerClass from "./playerClass";
import ClickIndicator from "./ClickIndicator";
import Vehicle from "./Vehicle/Vehicle";
import { useManualControls } from "./useManualControls";

const newPlayer = new playerClass();
const parameters = {
  maxSteerVal: 0.51,
  maxForce: 1000,
  maxBrakeForce: 20,
};
export default function Player({ playerRef, map, selectedVertex }) {
  const [steeringValue, setSteeringValue] = useState(0);
  const [engineForce, setEngineForce] = useState(0);
  const [brakeForce, setBrakeForce] = useState(0);
  const [reset, setReset] = useState(false);
  const prevDir = useRef(0);
  const curDir = useRef(0);
  const slowDown = useRef(0);

  useManualControls(
    setSteeringValue,
    setEngineForce,
    setBrakeForce,
    setReset,
    engineForce,
    parameters
  );
  useEffect(() => {
    newPlayer.addMap(map);
    playerRef.current.api.velocity.subscribe((v) => {
      const vector = new THREE.Vector3(...v);
      newPlayer.velocity = vector.length();
    });
    playerRef.current.api.rotation.subscribe((v) => {
      newPlayer.rotation = v[1] - Math.PI / 2;
      if (newPlayer.rotation < 0) newPlayer.rotation += 2 * Math.PI;
    });
  }, [map, playerRef]);

  useFrame(() => {
    const res = newPlayer.run(
      playerRef.current.position.x,
      playerRef.current.position.z
    );
    if (res === undefined) {
      if (slowDown.current && newPlayer.velocity > 7) {
        console.log("breaking");
        setEngineForce(newPlayer.velocity * 165);
      } else if (
        slowDown.current &&
        newPlayer.velocity < 7 &&
        engineForce > 0
      ) {
        setEngineForce(0);
      }
      return;
    }
    const [currentDirection, approachingTurn, approachingEnd] = res;
    curDir.current = currentDirection;
    slowDown.current = approachingTurn || approachingEnd;
    if (currentDirection === "end") {
      setEngineForce(0);
      setBrakeForce(25);
      prevDir.current = 0;
      return;
    }
    if (
      (currentDirection && approachingTurn) ||
      prevDir.current[0] === "double turn"
    ) {
      console.log("double turn");
      const newDir = currentDirection || prevDir.current[1];
      console.log(newDir);
      setSteeringValue(newDir * 2 * parameters.maxSteerVal);
      setEngineForce(-parameters.maxForce);
      setBrakeForce(0);
      prevDir.current = currentDirection
        ? ["double turn", currentDirection]
        : 0;
    } else if (currentDirection || prevDir.current[0] === "turn") {
      console.log("single turn");
      const newDir = currentDirection || prevDir.current[1];
      setSteeringValue(newDir * parameters.maxSteerVal);
      setEngineForce(-parameters.maxForce);
      setBrakeForce(0);
      prevDir.current = currentDirection ? ["turn", currentDirection] : 0;
    } else {
      console.log("straight");
      setBrakeForce(0);
      setSteeringValue(0);
      setEngineForce(-parameters.maxForce);
      prevDir.current = currentDirection;
    }
  });

  return (
    <>
      <Vehicle
        playerRef={playerRef}
        position={[147.5, 10, 157.5]}
        rotation={[0, Math.PI, 0]}
        angularVelocity={[-1.49 * Math.PI, 0, 0]}
        steeringValue={steeringValue}
        engineForce={engineForce}
        brakeForce={brakeForce}
        reset={reset}
      />
      <PlayerPath newPlayer={newPlayer} selectedVertex={selectedVertex} />
      <ClickIndicator selectedVertex={selectedVertex} />
    </>
  );
}
