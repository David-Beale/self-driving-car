import React, { useState } from "react";
import Menu from "./Components/Menu/Menu";
import Three from "./Components/Three/Three";
import Gauge from "./Components/Gauge/Gauge";
import OrientationWarning from "./Components/OrientationWarning/OrientationWarning";
import { useOrientation } from "./Components/OrientationWarning/useOrientation";

export default function App() {
  const [gauges, setGauges] = useState(null);
  const [orientationCheck, setOrientationCheck] = useOrientation();
  return (
    <>
      {orientationCheck ? (
        <OrientationWarning
          warning={orientationCheck}
          setOrientationCheck={setOrientationCheck}
        />
      ) : (
        <>
          <Menu />
          <Three setGauges={setGauges} />
          <Gauge gauges={gauges} />
        </>
      )}
    </>
  );
}
