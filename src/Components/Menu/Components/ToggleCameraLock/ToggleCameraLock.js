import React from "react";
import { useDispatch, useSelector } from "react-redux";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";

import { toggleCameraLock } from "../../../../redux/settings";
import { SubContainer } from "../../MenuStyle";
import { StyledIconButton } from "../ToggleButtonStyle";

export default function ToggleCameraLock() {
  const dispatch = useDispatch();
  const enabled = useSelector(({ settings }) => settings.cameraLock);

  const onClick = () => {
    dispatch(toggleCameraLock());
  };
  return (
    <SubContainer>
      <StyledIconButton enabled={enabled ? 1 : 0} onClick={onClick}>
        <PhotoCameraIcon fontSize="large" />
      </StyledIconButton>
      Toggle camera lock
    </SubContainer>
  );
}
