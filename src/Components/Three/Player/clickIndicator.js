import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";

const RADIUS = 1.5;

export default function ClickIndicator({ selectedVertex }) {
  const [enabled, setEnabled] = useState(false);
  const reverse = useRef(false);
  const circleRef = useRef();

  useEffect(() => {
    if (!selectedVertex) return;
    setEnabled(true);
  }, [selectedVertex]);

  useFrame(() => {
    if (!enabled) return;
    if (circleRef.current.scale.x > 1) {
      //reverse pulse
      reverse.current = true;
    }
    circleRef.current.scale.x += reverse.current ? -0.2 : 0.2;
    circleRef.current.scale.z += reverse.current ? -0.2 : 0.2;

    if (circleRef.current.scale.x < 0) {
      //end reached
      circleRef.current.scale.x = 0;
      circleRef.current.scale.z = 0;
      reverse.current = false;
      setEnabled(false);
    }
  });

  return (
    <>
      {enabled && (
        <mesh
          frustumCulled={false}
          position={[selectedVertex.x - 2.5, 0.1, selectedVertex.z - 2.5]}
          scale={0}
          renderOrder={10}
          ref={circleRef}
        >
          <sphereBufferGeometry attach="geometry" args={[RADIUS, 36]} />
          <meshBasicMaterial color="lightgreen" attach="material" />
        </mesh>
      )}
    </>
  );
}
