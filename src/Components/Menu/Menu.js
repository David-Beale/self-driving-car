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

import { Container, TopContainer } from "./MenuStyle";
import ToggleTime from "./Components/ToggleTime/ToggleTime";
import AddObstacles from "./Components/Collisions/AddObstacles";
import RemoveObstacles from "./Components/Collisions/RemoveObstacles";
import ToggleAICar from "./Components/ToggleAICar/ToggleAICar";
import ToggleQuality from "./Components/ToggleQuality/ToggleQuality";

export default memo(function Menu() {
  const [menuOpen, setMenuOpen] = useState(true);
  const training = useSelector(({ training }) => training.training);
  const AICar = useSelector(({ settings }) => settings.AICar);
  const obstacles = useSelector(({ settings }) => settings.obstacles);

  return (
    <>
      <MenuButton setMenuOpen={setMenuOpen} menuOpen={menuOpen} />
      <Drawer variant="persistent" anchor="left" open={menuOpen}>
        <Container>
          <TopContainer>
            <ToggleQuality />
            <ToggleTime />
            <ToggleCameraLock />
            <Help />
          </TopContainer>
          {!training && (
            <>
              <Mode />
              <ToggleAICar />
            </>
          )}
          {/* <ToggleTrafficLights /> */}
          {!AICar && (
            <>
              <Training training={training} />
              <ToggleTraining training={training} />
            </>
          )}
          {!training && !AICar && (
            <>
              <AddObstacles />
              {obstacles.length > 0 && <RemoveObstacles />}
            </>
          )}
        </Container>
      </Drawer>
    </>
  );
});
