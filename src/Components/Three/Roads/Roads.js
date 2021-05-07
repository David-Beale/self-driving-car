import { useMemo } from "react";
import { formattedTiles } from "../data/formattedMapData";
import { textures } from "./RoadTextures";

export default function Roads() {
  const roadTiles = useMemo(() => {
    const array = [];
    for (let i = 0; i < formattedTiles.length; i++) {
      for (let j = 0; j < formattedTiles[0].length; j++) {
        let type = formattedTiles[i][j];
        if (!type) continue;
        array.push({
          type: textures[type],
          x: j * 100,
          y: -i * 100,
        });
      }
    }
    return array;
  }, []);
  return (
    <>
      {roadTiles.map((tile, index) => (
        <mesh
          key={index}
          frustumCulled={false}
          position={[tile.x, tile.y, 11]}
          renderOrder={2}
        >
          <boxBufferGeometry attach="geometry" args={[100, 100, 20]} />
          <meshStandardMaterial
            color="rgb(73, 73, 73)"
            attachArray="material"
          />
          <meshStandardMaterial
            color="rgb(73, 73, 73)"
            attachArray="material"
          />
          <meshStandardMaterial
            color="rgb(73, 73, 73)"
            attachArray="material"
          />
          <meshStandardMaterial
            color="rgb(73, 73, 73)"
            attachArray="material"
          />
          <meshStandardMaterial map={tile.type} attachArray="material" />
          <meshStandardMaterial
            color="rgb(73, 73, 73)"
            attachArray="material"
          />
        </mesh>
      ))}
    </>
  );
}
