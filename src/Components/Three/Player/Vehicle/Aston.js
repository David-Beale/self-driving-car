import React from "react";
import { useGLTF } from "@react-three/drei";

export default function Aston(props) {
  const { nodes, materials } = useGLTF("/playerCar4/aston.glb");
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.mesh_0.geometry}
        material={nodes.mesh_0.material}
        position={[0, 1.1, 1.54]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.mesh_1.geometry}
        material={nodes.mesh_1.material}
        position={[0, 1.1, 1.54]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.mesh_2.geometry}
        material={nodes.mesh_2.material}
        position={[0, 1.1, 1.54]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.mesh_3.geometry}
        material={materials.refl}
        position={[0, 1.1, 1.54]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.mesh_4.geometry}
        material={materials.lightchr}
        position={[0, 1.1, 1.54]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.mesh_5.geometry}
        material={materials.remit}
        position={[0, 1.1, 1.54]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.mesh_6.geometry}
        material={materials.material}
        position={[0, 1.1, 1.54]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.mesh_7.geometry}
        material={materials.glack}
        position={[0, 1.1, 1.54]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.mesh_8.geometry}
        material={materials.GLASS}
        position={[0, 1.1, 1.54]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.mesh_9.geometry}
        material={materials.LightsGlassFront}
        position={[0, 1.1, 1.54]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.mesh_10.geometry}
        material={materials.red2}
        position={[0, 1.1, 1.54]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.mesh_11.geometry}
        material={materials.xenon}
        position={[0, 1.1, 1.54]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.mesh_12.geometry}
        material={materials.Chrome}
        position={[0, 1.1, 1.54]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.mesh_13.geometry}
        material={materials.flack}
        position={[0, 1.1, 1.54]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.mesh_14.geometry}
        material={materials.WhitePaint}
        position={[0, 1.1, 1.54]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.mesh_16.geometry}
        material={materials.BlackPaint}
        position={[0, 1.1, 1.54]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.mesh_17.geometry}
        material={nodes.mesh_17.material}
        position={[0, 1.1, 1.54]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.mesh_15.geometry}
        material={nodes.mesh_15.material}
        position={[0, 1.1, 1.54]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
    </group>
  );
}

useGLTF.preload("/aston.glb");
