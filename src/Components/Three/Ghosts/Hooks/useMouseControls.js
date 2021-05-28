import { useFrame } from "@react-three/fiber";

export const useMouseControls = (ghostCar, vehicleRef) => {
  useFrame(() => {
    if (!vehicleRef.current?.api) return;
    const res = ghostCar.run();
    if (!res) return;

    const { steering, engine, braking } = res.forces;
    vehicleRef.current.api.applyEngineForce(engine, 2);
    vehicleRef.current.api.applyEngineForce(engine, 3);

    vehicleRef.current.api.setSteeringValue(steering, 0);
    vehicleRef.current.api.setSteeringValue(steering, 1);

    for (let i = 0; i < 4; i++) {
      vehicleRef.current.api.setBrake(braking, i);
    }
  });
};
