import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ComputerIcon from "@material-ui/icons/Computer";

import { StyledIconButton } from "../ToggleButtonStyle";
import { toggleAICar } from "../../../../redux/settings";

import { SubContainer } from "../../MenuStyle";

export default function ToggleAICar() {
  const dispatch = useDispatch();
  const AICar = useSelector(({ settings }) => settings.AICar);

  const onClick = () => {
    dispatch(toggleAICar());
  };

  return (
    <>
      <SubContainer>
        <StyledIconButton enabled={AICar ? 1 : 0} onClick={onClick}>
          <ComputerIcon fontSize="large" />
        </StyledIconButton>
        {AICar ? "remove AI Car" : "Use AI car"}
      </SubContainer>
    </>
  );
}
