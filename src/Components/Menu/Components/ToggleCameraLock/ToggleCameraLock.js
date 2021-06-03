import React from "react";
import { useDispatch, useSelector } from "react-redux";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";

import { toggleCameraLock } from "../../../../redux/settings";
import { Tooltip } from "@material-ui/core";
import { StyledIconButtonTop } from "../ToggleButtonStyle";

import styled from "styled-components";

const StyledCamera = styled.div`
  position: absolute;
  right: 75px;
  top: 5px;
`;

export default function ToggleCameraLock() {
  const dispatch = useDispatch();
  const enabled = useSelector(({ settings }) => settings.cameraLock);

  const onClick = () => {
    dispatch(toggleCameraLock());
  };
  return (
    <StyledCamera>
      <Tooltip title="Toggle camera lock">
        <StyledIconButtonTop enabled={enabled ? 1 : 0} onClick={onClick}>
          <PhotoCameraIcon />
        </StyledIconButtonTop>
      </Tooltip>
    </StyledCamera>
  );
}
