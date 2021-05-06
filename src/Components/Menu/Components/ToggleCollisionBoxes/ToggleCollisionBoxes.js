import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ErrorIcon from "@material-ui/icons/Error";

import { toggleCollisionBoxes } from "../../../../redux/settings";
import { SubContainer } from "../../MenuStyle";
import { StyledIconButton } from "../ToggleButtonStyle";

export default function ToggleCollisionBoxes() {
  const dispatch = useDispatch();
  const enabled = useSelector(({ settings }) => settings.collisionBoxes);

  const onClick = () => {
    dispatch(toggleCollisionBoxes());
  };
  return (
    <SubContainer>
      <StyledIconButton enabled={enabled ? 1 : 0} onClick={onClick}>
        <ErrorIcon fontSize="large" />
      </StyledIconButton>
      Toggle collision boxes
    </SubContainer>
  );
}
