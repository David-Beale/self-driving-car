import { useBox } from "@react-three/cannon";
import { useEffect } from "react";

export default function Road({ tile, mouseDown, mouseUp }) {
  const [ref] = useBox(() => ({
    type: "Static",
    position: [tile.x, 0, tile.z],
    args: [10, 10, 0.01],
    rotation: [-Math.PI / 2, 0, 0],
  }));

  const onPointerUp = (e) => {
    mouseUp(e, tile);
  };
  useEffect(() => {
    ref.current.updateMatrix();
  }, [ref]);
  return (
    <mesh
      ref={ref}
      frustumCulled={false}
      renderOrder={2}
      onPointerDown={mouseDown}
      onPointerUp={onPointerUp}
      matrixAutoUpdate={false}
    >
      <planeBufferGeometry attach="geometry" args={[10, 10]} />
      <meshBasicMaterial map={tile.type} attach="material" />
    </mesh>
  );
}
