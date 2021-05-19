import React from "react";
import { useDispatch } from "react-redux";
import MouseIcon from "@material-ui/icons/Mouse";

import { ModeButtonContainer, StyledIconButton } from "./ModeStyle";
import { mouseMode } from "../../../../redux/mode";
import { Tooltip } from "@material-ui/core";

export default function Mouse({ enabled }) {
  const dispatch = useDispatch();

  const onClick = () => {
    dispatch(mouseMode());
  };
  return (
    <ModeButtonContainer>
      <Tooltip title="Mouse">
        <StyledIconButton enabled={enabled ? 1 : 0} onClick={onClick}>
          <MouseIcon />
        </StyledIconButton>
      </Tooltip>
    </ModeButtonContainer>
  );
}
