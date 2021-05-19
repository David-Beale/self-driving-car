import React from "react";
import { useDispatch } from "react-redux";
import KeyboardIcon from "@material-ui/icons/Keyboard";

import { ModeButtonContainer, StyledIconButton } from "./ModeStyle";
import { keyboardMode } from "../../../../redux/mode";
import { Tooltip } from "@material-ui/core";

export default function Mouse({ enabled }) {
  const dispatch = useDispatch();

  const onClick = () => {
    dispatch(keyboardMode());
  };
  return (
    <ModeButtonContainer>
      <Tooltip title="Keyboard">
        <StyledIconButton enabled={enabled ? 1 : 0} onClick={onClick}>
          <KeyboardIcon />
        </StyledIconButton>
      </Tooltip>
    </ModeButtonContainer>
  );
}
