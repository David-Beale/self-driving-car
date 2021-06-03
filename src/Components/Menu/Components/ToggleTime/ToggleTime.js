import React from "react";
import { useDispatch } from "react-redux";
import Brightness6Icon from "@material-ui/icons/Brightness6";

import { toggleTime } from "../../../../redux/settings";
import { Tooltip } from "@material-ui/core";
import { StyledIconButtonTop } from "../ToggleButtonStyle";

import styled from "styled-components";

const StyledTime = styled.div`
  position: absolute;
  right: 140px;
  top: 5px;
`;

export default function ToggleTime() {
  const dispatch = useDispatch();

  const onClick = () => {
    dispatch(toggleTime());
  };
  return (
    <StyledTime>
      <Tooltip title="Toggle time of day">
        <StyledIconButtonTop onClick={onClick}>
          <Brightness6Icon />
        </StyledIconButtonTop>
      </Tooltip>
    </StyledTime>
  );
}
