import React from "react";
import { useDispatch } from "react-redux";
import SchoolIcon from "@material-ui/icons/School";

import { StyledIconButton } from "../ToggleButtonStyle";
import { toggleTraining } from "../../../../redux/training";
import { enableCameraLock } from "../../../../redux/settings";

import { SubContainer } from "../../MenuStyle";

export default function ToggleTraining({ training }) {
  const dispatch = useDispatch();

  const modeToggle = () => {
    dispatch(toggleTraining());
    dispatch(enableCameraLock());
  };

  return (
    <>
      <SubContainer>
        <StyledIconButton onClick={modeToggle}>
          <SchoolIcon fontSize="large" />
        </StyledIconButton>
        {training ? "Exit training" : "Begin training"}
      </SubContainer>
    </>
  );
}
