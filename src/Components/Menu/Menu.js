import React, { useState, memo } from "react";
import { useSelector } from "react-redux";
import Drawer from "@material-ui/core/Drawer";

import MenuButton from "./Components/MenuButton/MenuButton";
import Help from "./Components/Help/Help";
// import ToggleTrafficLights from "./Components/ToggleTrafficLights/ToggleTrafficLights";
import ToggleCameraLock from "./Components/ToggleCameraLock/ToggleCameraLock";
import Training from "./Components/Training/Training";
import Mode from "./Components/Mode/Mode";
import ToggleTraining from "./Components/ToggleTraining/ToggleTraining";

import { Container } from "./MenuStyle";
import ToggleTime from "./Components/ToggleTime/ToggleTime";

export default memo(function Menu() {
  const [menuOpen, setMenuOpen] = useState(true);
  const training = useSelector(({ training }) => training.training);

  return (
    <>
      <MenuButton setMenuOpen={setMenuOpen} menuOpen={menuOpen} />
      <Drawer variant="persistent" anchor="left" open={menuOpen}>
        <Container>
          <Help />
          <ToggleCameraLock />
          <ToggleTime />
          {!training && (
            <>
              <Mode />
            </>
          )}
          {/* <ToggleTrafficLights /> */}
          <Training training={training} />
          <ToggleTraining training={training} />
        </Container>
      </Drawer>
    </>
  );
});
