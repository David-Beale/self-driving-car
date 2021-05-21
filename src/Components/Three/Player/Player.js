import * as d3 from "d3-ease";
import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import PlayerPath from "./Path/PlayerPath";

import ClickIndicator from "./ClickVisuals";
import Vehicle from "./Vehicle/Vehicle";
import { useManualControls } from "./Hooks/useManualControls";
import { useSubscriptions } from "./Hooks/useSubscriptions";

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
const getGuagevals = (steering, engine, braking) => {
  return {
    steering: convertSteering(steering),
    accel: getAccel(engine, braking),
  };
};

export default function Player({ selectedVertex, mode, player, setGauges }) {
  const playerRef = useRef();

  const [steeringValue, setSteeringValue] = useState(0);
  const [engineForce, setEngineForce] = useState(0);
  const [brakeForce, setBrakeForce] = useState(0);
  const [reset, setReset] = useState(false);
  const slowDown = useRef(0);
  const modeRef = useRef();
  const reverse = useRef();
  modeRef.current = mode;

  useManualControls(
    setSteeringValue,
    setEngineForce,
    setBrakeForce,
    setReset,
    parameters,
    mode,
    setGauges,
    getGuagevals
  );

  useSubscriptions(player, playerRef);

  useEffect(() => {
    if (!selectedVertex || modeRef.current !== "mouse") return;
    player.click(selectedVertex);
    slowDown.current = false;
  }, [selectedVertex, player]);

  useEffect(() => {
    player.arrayOfSteps = [];
    player.pathGeometry.setVertices([]);
  }, [player, reset]);

  useFrame(() => {
    const res = player.run();
    if (mode !== "mouse") return;
    let force = 0;
    let breakingForce = 0;
    if (slowDown.current && player.velocity > slowDown.current.minSpeed) {
      // console.log("breaking");
      breakingForce =
        parameters.maxBrakeForce * d3.easeCubicInOut(player.velocity / 18);
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
        setBrakeForce(25);
      }
      setGauges({
        steering: 0,
        accel: 0,
      });
      return;
    }
    setBrakeForce(breakingForce);
    let steering = 1.75 * currentDirection * parameters.maxSteerVal;
    if (reverse.current || Math.abs(currentDirection) > (2 * Math.PI) / 3) {
      reverse.current = true;
      steering = -steering / 2;
      force = -force;
    }
    if (reverse.current && Math.abs(currentDirection) < Math.PI / 3) {
      reverse.current = false;
      force = -force;
    }
    setSteeringValue(steering);
    setEngineForce(force);

    setGauges(getGuagevals(steering, force, breakingForce));
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
