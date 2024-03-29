import React, { forwardRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useCylinder } from "@react-three/cannon";
import WheelObject from "../../../../Assets/playerCar4/wheel.glb";

function WheelModel(props) {
  const { nodes, materials } = useGLTF(WheelObject);
  return (
    <group {...props} dispose={null}>
      <mesh material={materials.Rubber} geometry={nodes.wheel_1.geometry} />
      <mesh material={materials.Steel} geometry={nodes.wheel_2.geometry} />
      <mesh material={materials.Chrom} geometry={nodes.wheel_3.geometry} />
    </group>
  );
}
useGLTF.preload(WheelObject);

// A Wheel
const Wheel = forwardRef(({ leftSide }, ref) => {
  useCylinder(
    () => ({
      mass: 1,
      type: "Kinematic",
      collisionFilterGroup: 0,
    }),
    ref
  );

  return (
    <mesh ref={ref}>
      <mesh rotation={[0, 0, ((leftSide ? 1 : -1) * Math.PI) / 2]}>
        <WheelModel />
      </mesh>
    </mesh>
  );
});

export default Wheel;
