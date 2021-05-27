import React from "react";
import SkipNextIcon from "@material-ui/icons/SkipNext";

import { SubContainer } from "../../../MenuStyle";
import { StyledIconButton } from "../../ToggleButtonStyle";

export default function NextGenButton({ disabled, onClick }) {
  return (
    <SubContainer>
      <StyledIconButton disabled={disabled} onClick={onClick}>
        <SkipNextIcon fontSize="large" />
      </StyledIconButton>
      Next generation
    </SubContainer>
  );
}
