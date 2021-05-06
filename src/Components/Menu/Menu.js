import React, { useState } from "react";
import Drawer from "@material-ui/core/Drawer";

import MenuButton from "./Components/MenuButton/MenuButton";

import { Container } from "./MenuStyle";
import Help from "./Components/Help/Help";
import ToggleTrafficLights from "./Components/ToggleTrafficLights/ToggleTrafficLights";
import ToggleCameraLock from "./Components/ToggleCameraLock/ToggleCameraLock";
import ComputerNumber from "./Components/ComputerNumber/ComputerNumber";
import ToggleCollisionBoxes from "./Components/ToggleCollisionBoxes/ToggleCollisionBoxes";
import AddRoadWorks from "./Components/AddRoadWorks/AddRoadWorks";
import RemoveRoadWorks from "./Components/RemoveRoadWorks/RemoveRoadWorks";
import ToggleTrafficConditions from "./Components/ToggleTrafficConditions/ToggleTrafficConditions";
import Mode from "./Components/Mode/Mode";

export default function Menu() {
  const [menuOpen, setMenuOpen] = useState(true);

  return (
    <>
      <MenuButton setMenuOpen={setMenuOpen} menuOpen={menuOpen} />
      <Drawer variant="persistent" anchor="left" open={menuOpen}>
        <Container>
          <Help />
          <Mode />
          <ToggleTrafficLights />
          <ToggleTrafficConditions />
          <ToggleCollisionBoxes />
          <ToggleCameraLock />
          <AddRoadWorks />
          <RemoveRoadWorks />
          <ComputerNumber />
        </Container>
      </Drawer>
    </>
  );
}
