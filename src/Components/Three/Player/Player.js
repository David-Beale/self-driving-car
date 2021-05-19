import * as THREE from "three";
import * as d3 from "d3-ease";
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
export default function Player({ playerRef, map, selectedVertex, mode }) {
  const [steeringValue, setSteeringValue] = useState(0);
  const [engineForce, setEngineForce] = useState(0);
  const [brakeForce, setBrakeForce] = useState(0);
  const [reset, setReset] = useState(false);
  const slowDown = useRef(0);
  const modeRef = useRef();
  modeRef.current = mode;

  useManualControls(
    setSteeringValue,
    setEngineForce,
    setBrakeForce,
    setReset,
    engineForce,
    parameters,
    mode
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

  useEffect(() => {
    if (!selectedVertex || modeRef.current !== "mouse") return;
    newPlayer.click(selectedVertex);
  }, [selectedVertex]);

  useFrame(() => {
    const res = newPlayer.run(
      playerRef.current.position.x,
      playerRef.current.position.z
    );
    if (mode !== "mouse") return;
    let force = 0;
    let breakingForce = 0;
    if (slowDown.current && newPlayer.velocity > slowDown.current.minSpeed) {
      // console.log("breaking");
      breakingForce = slowDown.current.breakingFactor * newPlayer.velocity;
    } else if (
      slowDown.current &&
      newPlayer.velocity < slowDown.current.minSpeed
    ) {
      slowDown.current = false;
    } else {
      force =
        -parameters.maxForce *
        d3.easeCubicOut(Math.max(18 - newPlayer.velocity, 0) / 18);
    }
    const [currentDirection, approachingTurn, approachingEnd] = res;
    if (approachingTurn) {
      slowDown.current = { minSpeed: 8, breakingFactor: 1.1 };
      // console.log("slowdown");
    } else if (approachingEnd) {
      slowDown.current = { minSpeed: 8, breakingFactor: 1.1 };
    }
    if (currentDirection === "end") {
      if (engineForce !== 0 || brakeForce !== 25) {
        setEngineForce(0);
        setBrakeForce(25);
      }
      return;
    }
    // console.log(force, breakingForce, newPlayer.velocity);
    setBrakeForce(breakingForce);
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
      <PlayerPath newPlayer={newPlayer} />
      <ClickIndicator selectedVertex={selectedVertex} />
    </>
  );
}
