import * as THREE from "three";
import * as d3 from "d3-ease";
import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import PlayerPath from "./Path/PlayerPath";

import ClickIndicator from "./ClickVisuals";
import Vehicle from "./Vehicle/Vehicle";
import { useManualControls } from "./useManualControls";

const parameters = {
  maxSteerVal: 0.51,
  maxForce: 1000,
  maxBrakeForce: 20,
};
const convertSteering = (steering) => {
  if (!steering) return 0;
  if (steering < -1) return 1;
  if (steering > 1) return -1;
  return -steering;
};
const getAccel = (engine, braking) => {
  if (braking) return -braking / parameters.maxBrakeForce;
  return -engine / parameters.maxForce;
};
export default function Player({
  map,
  selectedVertex,
  mode,
  player,
  setGauges,
}) {
  const playerRef = useRef();

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
    player.addMap(map);
    playerRef.current.api.position.subscribe((p) => {
      player.position.x = p[0];
      player.position.y = p[1];
      player.position.z = p[2];
    });
    playerRef.current.api.velocity.subscribe((v) => {
      const vector = new THREE.Vector3(...v);
      player.velocity = vector.length();
    });
    playerRef.current.api.rotation.subscribe((r) => {
      player.rotation = r[1] - Math.PI / 2;
      if (player.rotation < 0) player.rotation += 2 * Math.PI;
    });
  }, [map, playerRef, player]);

  useEffect(() => {
    if (!selectedVertex || modeRef.current !== "mouse") return;
    player.click(selectedVertex);
  }, [selectedVertex, player]);

  useFrame(() => {
    const res = player.run();
    if (mode !== "mouse") return;
    let force = 0;
    let breakingForce = 0;
    if (slowDown.current && player.velocity > slowDown.current.minSpeed) {
      // console.log("breaking");
      breakingForce = Math.min(
        slowDown.current.breakingFactor * player.velocity,
        parameters.maxBrakeForce
      );
    } else if (
      slowDown.current &&
      player.velocity < slowDown.current.minSpeed
    ) {
      slowDown.current = false;
    } else {
      force =
        -parameters.maxForce *
        d3.easeCubicOut(Math.max(18 - player.velocity, 0) / 18);
    }
    const [currentDirection, approachingTurn, approachingEnd] = res;
    if (approachingTurn) {
      slowDown.current = { minSpeed: 8, breakingFactor: 1.1 };
    } else if (approachingEnd) {
      slowDown.current = { minSpeed: 3, breakingFactor: 2 };
    }
    if (currentDirection === "end") {
      if (engineForce !== 0 || brakeForce !== parameters.maxBrakeForce) {
        setEngineForce(0);
        setBrakeForce(parameters.maxBrakeForce);
      }
      setGauges({
        steering: 0,
        accel: 0,
      });
      return;
    }
    // console.log(force, breakingForce, newPlayer.velocity);
    setBrakeForce(breakingForce);
    const steering = 1.75 * currentDirection * parameters.maxSteerVal;
    setSteeringValue(steering);
    setEngineForce(force);

    setGauges({
      steering: convertSteering(steering),
      accel: getAccel(force, breakingForce),
    });
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
      <PlayerPath player={player} />
      <ClickIndicator selectedVertex={selectedVertex} />
    </>
  );
}
