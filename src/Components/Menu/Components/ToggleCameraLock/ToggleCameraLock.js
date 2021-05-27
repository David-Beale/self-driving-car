import React from "react";
import { useDispatch, useSelector } from "react-redux";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";

import { toggleCameraLock } from "../../../../redux/settings";
import { StyledCamera, StyledCameraButton } from "./ToggleCameraStyle";
import { Tooltip } from "@material-ui/core";

export default function ToggleCameraLock() {
  const dispatch = useDispatch();
  const enabled = useSelector(({ settings }) => settings.cameraLock);

  const onClick = () => {
    dispatch(toggleCameraLock());
  };
  return (
    <StyledCamera>
      <Tooltip title="Toggle camera lock">
        <StyledCameraButton enabled={enabled ? 1 : 0} onClick={onClick}>
          <PhotoCameraIcon />
        </StyledCameraButton>
      </Tooltip>
    </StyledCamera>
  );
}
