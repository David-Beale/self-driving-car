import React from "react";
import { useDispatch, useSelector } from "react-redux";
import CompareIcon from "@material-ui/icons/Compare";

import { ModeButtonContainer, StyledIconButton } from "./ModeStyle";
import { compareMode } from "../../../../redux/mode";
import { Tooltip } from "@material-ui/core";

export default function CompareButton() {
  const dispatch = useDispatch();
  const enabled = useSelector(({ mode }) => mode.mode === "compare");

  const onClick = () => {
    dispatch(compareMode());
  };
  return (
    <ModeButtonContainer>
      <Tooltip title="Compare modes">
        <StyledIconButton enabled={enabled ? 1 : 0} onClick={onClick}>
          <CompareIcon />
        </StyledIconButton>
      </Tooltip>
    </ModeButtonContainer>
  );
}
