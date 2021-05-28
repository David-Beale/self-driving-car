import React, { forwardRef } from "react";
import { useCylinder } from "@react-three/cannon";

// A Wheel
const Wheel = forwardRef(({ leftSide }, ref) => {
  useCylinder(
    () => ({
      mass: 1,
      type: "Kinematic",
      collisionResponse: false,
      collisionFilterGroup: 0,
    }),
    ref
  );

  return <></>;
});

export default Wheel;
