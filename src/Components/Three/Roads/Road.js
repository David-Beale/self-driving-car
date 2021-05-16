import { useBox } from "@react-three/cannon";

export default function Road({ tile, mouseDown, mouseUp, mouseMove }) {
  const [ref] = useBox(() => ({
    type: "Static",
    position: [tile.x, 0, tile.z],
    args: [10, 10, 0.01],
    rotation: [-Math.PI / 2, 0, 0],
  }));

  return (
    <mesh
      ref={ref}
      frustumCulled={false}
      renderOrder={2}
      onPointerDown={(e) => mouseDown(e, tile)}
      onPointerUp={(e) => mouseUp(e, tile)}
      onPointerMove={(e) => mouseMove(e, tile)}
    >
      <planeBufferGeometry attach="geometry" args={[10, 10]} />
      <meshBasicMaterial map={tile.type} attach="material" />
    </mesh>
  );
}
