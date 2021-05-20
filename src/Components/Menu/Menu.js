import React, { useState, memo } from "react";
import Drawer from "@material-ui/core/Drawer";

import MenuButton from "./Components/MenuButton/MenuButton";

import { Container } from "./MenuStyle";
import Help from "./Components/Help/Help";
import ToggleTrafficLights from "./Components/ToggleTrafficLights/ToggleTrafficLights";
import ToggleCameraLock from "./Components/ToggleCameraLock/ToggleCameraLock";
import Mode from "./Components/Mode/Mode";

export default memo(function Menu() {
  const [menuOpen, setMenuOpen] = useState(true);

  return (
    <>
      <MenuButton setMenuOpen={setMenuOpen} menuOpen={menuOpen} />
      <Drawer variant="persistent" anchor="left" open={menuOpen}>
        <Container>
          <Help />
          <Mode />
          <ToggleTrafficLights />
          <ToggleCameraLock />
        </Container>
      </Drawer>
    </>
  );
});
