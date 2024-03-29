/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React from "react";
import { useGLTF } from "@react-three/drei";
import cone from "../../../Assets/cone/cone.glb";

export default function Model(props) {
  const { nodes, materials } = useGLTF(cone);
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh_0.geometry}
          material={materials.cono}
        />
      </group>
    </group>
  );
}

useGLTF.preload(cone);
