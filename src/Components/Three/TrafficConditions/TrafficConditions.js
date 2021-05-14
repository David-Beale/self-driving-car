import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const getColor = (average) => {
  switch (true) {
    case average === 0:
      return "rgb(70, 240, 36)";
    case average <= 15:
      return "rgb(70, 240, 36)";
    case average <= 25:
      return "rgb(226, 240, 36)";
    default:
      return "rgb(240, 36, 36)";
  }
};

const scratchObject3D = new THREE.Object3D();
const scratchColor = new THREE.Color();

export default function TrafficConditions({ map, enabled }) {
  const meshRef = useRef();
  const colorAttrib = useRef();

  const colorArray = useMemo(
    () => new Float32Array(map.array.length * 3),
    [map]
  );

  useFrame(() => {
    if (!enabled) return;
    for (let i = 0; i < map.array.length; ++i) {
      const vertex = map.graphObj[map.array[i]];
      //set color
      scratchColor.set(getColor(vertex.average));
      scratchColor.toArray(colorArray, i * 3);
    }
    colorAttrib.current.needsUpdate = true;
  });

  useEffect(() => {
    if (!enabled) return;
    for (let i = 0; i < map.array.length; ++i) {
      const vertex = map.graphObj[map.array[i]];

      const { x, y } = vertex;
      scratchObject3D.position.set(x - 25, -y + 25, 15);
      scratchObject3D.updateMatrix();
      meshRef.current.setMatrixAt(i, scratchObject3D.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [map, enabled, colorArray]);

  return (
    <>
      {enabled && (
        <instancedMesh
          ref={meshRef}
          args={[null, null, map.array.length]}
          frustumCulled={false}
          renderOrder={1}
        >
          <planeBufferGeometry attach="geometry" args={[50, 50]}>
            <instancedBufferAttribute
              ref={colorAttrib}
              attachObject={["attributes", "color"]}
              args={[colorArray, 3]}
            />
          </planeBufferGeometry>
          <meshBasicMaterial
            attach="material"
            vertexColors={THREE.VertexColors}
            transparent={true}
            opacity={0.2}
          />
        </instancedMesh>
      )}
    </>
  );
}
