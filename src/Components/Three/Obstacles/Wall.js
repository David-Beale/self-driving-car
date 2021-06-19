import { useBox } from "@react-three/cannon";

export default function Wall({ wall }) {
  const [ref] = useBox(() => ({
    mass: 1000,
    position: [wall.x, 0, wall.z],
    args: [wall.w, 10, wall.h],
    collisionFilterGroup: 4,
    type: "Static",
    userData: {
      id: "wall",
    },
  }));

  return (
    <></>
    // <mesh ref={ref} frustumCulled={false}>
    //   <boxBufferGeometry attach="geometry" args={[wall.w, 10, wall.h]} />
    //   <meshBasicMaterial color={"green"} attach="material" />
    // </mesh>
  );
}
