import React from "react";
import { useDispatch } from "react-redux";
import SchoolIcon from "@material-ui/icons/School";

import { StyledIconButton } from "../ToggleButtonStyle";
import { onTrainingMode } from "../../../../redux/training";

import { SubContainer } from "../../MenuStyle";

export default function ToggleTraining({ training }) {
  const dispatch = useDispatch();

  const modeToggle = () => {
    dispatch(onTrainingMode());
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
