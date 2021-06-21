import React from "react";
import { useDispatch, useSelector } from "react-redux";
import AdbIcon from "@material-ui/icons/Adb";

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
          <AdbIcon fontSize="large" />
        </StyledIconButton>
        Neural network
      </SubContainer>
    </>
  );
}
