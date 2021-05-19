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
    let force = -parameters.maxForce;
    if (slowDown.current && newPlayer.velocity > 7) {
      console.log("breaking");
      force = 2400;
      slowDown.current = true;
    } else if (slowDown.current && newPlayer.velocity < 7 && engineForce > 0) {
      force = 0;
      slowDown.current = false;
    } else if (newPlayer.velocity > 18) {
      force = 0;
    }
    const [currentDirection, approachingTurn, approachingEnd] = res;
    curDir.current = currentDirection;
    if (approachingTurn || approachingEnd) {
      slowDown.current = true;
      console.log("slowdown");
    }
    if (currentDirection === "end") {
      setEngineForce(0);
      setBrakeForce(25);
      prevDir.current = 0;
      return;
    }
    console.log(1.75 * currentDirection * parameters.maxSteerVal);
    setBrakeForce(0);
    setSteeringValue(1.75 * currentDirection * parameters.maxSteerVal);
    setEngineForce(force);
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
