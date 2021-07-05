import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Brightness5Icon from "@material-ui/icons/Brightness5";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import NightsStayIcon from "@material-ui/icons/NightsStay";

import { toggleTime } from "../../../../redux/settings";
import { Tooltip } from "@material-ui/core";
import { StyledIconButtonTop } from "../ToggleButtonStyle";

export default function ToggleTime() {
  const time = useSelector(({ settings }) => settings.time);
  const dispatch = useDispatch();

  const onClick = () => {
    dispatch(toggleTime());
  };
  return (
    <Tooltip title="Toggle time of day">
      <StyledIconButtonTop onClick={onClick}>
        {
          {
            day: <Brightness5Icon />,
            sunset: <Brightness4Icon />,
            night: <NightsStayIcon />,
          }[time]
        }
      </StyledIconButtonTop>
    </Tooltip>
  );
}
