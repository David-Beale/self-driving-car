import React from "react";
import AutorenewIcon from "@material-ui/icons/Autorenew";

import { SubContainer } from "../../../MenuStyle";
import { StyledIconButton } from "../../ToggleButtonStyle";

export default function ResetTrainingButton({ disabled, onClick }) {
  return (
    <SubContainer>
      <StyledIconButton disabled={disabled} onClick={onClick}>
        <AutorenewIcon fontSize="large" />
      </StyledIconButton>
      Restart training
    </SubContainer>
  );
}
