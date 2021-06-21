import React from "react";
import RefreshIcon from "@material-ui/icons/Refresh";

import { SubContainer } from "../../../MenuStyle";
import { StyledIconButton } from "../../ToggleButtonStyle";
import { useDispatch } from "react-redux";
import { setCurrentDNA } from "../../../../../redux/training";

export default function PretrainedButton({ disabled }) {
  const dispatch = useDispatch();
  const onClick = () => {
    dispatch(setCurrentDNA());
  };

  return (
    <SubContainer>
      <StyledIconButton disabled={disabled} onClick={onClick}>
        <RefreshIcon fontSize="large" />
      </StyledIconButton>
      Pretrained settings
    </SubContainer>
  );
}
