import { useBox } from "@react-three/cannon";

export default function Wall({ wall }) {
  useBox(() => ({
    mass: 1000,
    position: [wall.x, 0, wall.z],
    args: [wall.w, 10, wall.h],
    collisionFilterGroup: 4,
    type: "Static",
    userData: {
      id: "wall",
    },
  }));

  return <></>;
}
