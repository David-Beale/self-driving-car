import React, { forwardRef } from "react";
import { useCylinder } from "@react-three/cannon";

// A Wheel
const Wheel = forwardRef(({ props }, ref) => {
  useCylinder(
    () => ({
      mass: 1,
      type: "Kinematic",
      collisionFilterGroup: 0,
    }),
    ref
  );

  return <></>;
});

export default Wheel;
