import { useMemo, useRef } from "react";
import ghostClass from "./ghostClass";

import Vehicle from "./Vehicle/Vehicle";
import { useSubscriptions } from "./Hooks/useSubscriptions";
import { useControls } from "./Hooks/useControls";

export default function Ghost({ ghostDNA }) {
  const ghostCar = useMemo(() => new ghostClass(), []);
  const ghostRef = useRef();
  const vehicleRef = useRef();

  useSubscriptions(ghostCar, ghostRef);

  useControls(ghostRef, vehicleRef, ghostCar, ghostDNA);

  return (
    <Vehicle
      ghostRef={ghostRef}
      vehicleRef={vehicleRef}
      position={[147.5, 4, 192.5]}
      angularVelocity={[0, 0, 0]}
      rotation={[0, Math.PI, 0]}
    />
  );
}
