import React, { useState } from "react";
import Menu from "./Components/Menu/Menu";
import Three from "./Components/Three/Three";
import Gauge from "./Components/Gauge/Gauge";

export default function App() {
  const [steering, setSteering] = useState(null);
  return (
    <>
      <Menu />
      <Three setSteering={setSteering} />
      <Gauge steering={steering} />
    </>
  );
}
