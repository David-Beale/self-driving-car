import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";

const RADIUS = 20;

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
    circleRef.current.scale.y += reverse.current ? -0.2 : 0.2;

    if (circleRef.current.scale.x < 0) {
      //end reached
      circleRef.current.scale.x = 0;
      circleRef.current.scale.y = 0;
      reverse.current = false;
      setEnabled(false);
    }
  });
  return (
    <>
      {enabled && (
        <mesh
          frustumCulled={false}
          position={[selectedVertex.x - 25, -selectedVertex.y + 25, 20]}
          scale={0}
          renderOrder={10}
          ref={circleRef}
        >
          <circleBufferGeometry attach="geometry" args={[RADIUS, 36]} />
          <meshBasicMaterial color="white" attach="material" />
        </mesh>
      )}
    </>
  );
}
