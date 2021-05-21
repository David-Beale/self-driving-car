import { useEffect, useRef } from "react";
import * as d3 from "d3-ease";
import { useFrame } from "@react-three/fiber";

export const useMouseControls = (
  selectedVertex,
  player,
  modeRef,
  parameters,
  setForces,
  setGauges,
  getGuagevals
) => {
  const slowDown = useRef(0);
  const reverse = useRef();

  useEffect(() => {
    if (!selectedVertex || modeRef.current !== "mouse") return;
    player.click(selectedVertex);
    slowDown.current = false;
  }, [modeRef, selectedVertex, player]);

  const destinationReached = () => {
    setForces({ steering: 0, engine: 0, braking: 25 });
    setGauges({
      steering: 0,
      accel: 0,
    });
  };
  const getForces = (currentDirection) => {
    let engine = 0;
    let braking = 0;
    let steering = 1.75 * currentDirection * parameters.maxSteerVal;

    if (slowDown.current && player.velocity > slowDown.current) {
      //braking
      braking =
        parameters.maxBrakeForce * d3.easeCubicInOut(player.velocity / 18);
    } else if (slowDown.current && player.velocity < slowDown.current) {
      //cancel braking
      slowDown.current = false;
    } else {
      //accelerating
      engine =
        -parameters.maxForce *
        d3.easeCubicOut(Math.max(18 - player.velocity, 0) / 18);
    }

    //check if reversing required
    if (reverse.current && Math.abs(currentDirection) < Math.PI / 3) {
      //cancel reverse
      reverse.current = false;
    } else if (reverse.current || Math.abs(currentDirection) > Math.PI / 2) {
      reverse.current = true;
      steering = -steering / 2;
      engine = -engine;
    }

    return [steering, engine, braking];
  };

  useFrame(() => {
    const res = player.run();
    if (modeRef.current !== "mouse") return;

    const [currentDirection, approachingTurn, approachingEnd] = res;

    if (currentDirection === "end") return destinationReached();

    if (approachingTurn) {
      slowDown.current = 8;
    } else if (approachingEnd) {
      slowDown.current = 3;
    }

    let [steering, engine, braking] = getForces(currentDirection);

    setForces({ steering, engine, braking });

    setGauges(getGuagevals(steering, engine, braking));
  });
};
