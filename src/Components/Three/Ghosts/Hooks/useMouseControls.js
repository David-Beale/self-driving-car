import { useFrame } from "@react-three/fiber";

export const useMouseControls = (ghostCar, setForces) => {
  useFrame(() => {
    const res = ghostCar.run();
    if (!res) return;
    setForces(res.forces);
  });
};
