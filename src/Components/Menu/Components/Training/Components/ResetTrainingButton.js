import React from "react";
import RefreshIcon from "@material-ui/icons/Refresh";

import { SubContainer } from "../../../MenuStyle";
import { StyledIconButton } from "../../ToggleButtonStyle";

export default function ResetTrainingButton({ disabled, onClick }) {
  return (
    <SubContainer>
      <StyledIconButton disabled={disabled} onClick={onClick}>
        <RefreshIcon fontSize="large" />
      </StyledIconButton>
      Reset training
    </SubContainer>
  );
}
