import { useBox } from "@react-three/cannon";

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

  return (
    <mesh
      ref={ref}
      frustumCulled={false}
      renderOrder={2}
      onPointerDown={mouseDown}
      onPointerUp={onPointerUp}
    >
      <planeBufferGeometry attach="geometry" args={[10, 10]} />
      <meshBasicMaterial map={tile.type} attach="material" />
    </mesh>
  );
}
