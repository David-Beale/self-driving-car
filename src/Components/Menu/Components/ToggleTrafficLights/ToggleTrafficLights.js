import React from "react";
import { useDispatch, useSelector } from "react-redux";
import TrafficIcon from "@material-ui/icons/Traffic";

import { toggleTrafficLights } from "../../../../redux/settings";

import { SubContainer } from "../../MenuStyle";
import { StyledIconButton } from "../ToggleButtonStyle";
import { RedLight, GreenLight, YellowLight } from "./ToggleTrafficLightsStyle";

export default function ToggleTrafficLights() {
  const dispatch = useDispatch();
  const enabled = useSelector(({ settings }) => settings.trafficLights);

  const onClick = () => {
    dispatch(toggleTrafficLights());
  };
  return (
    <SubContainer>
      <StyledIconButton enabled={enabled ? 1 : 0} onClick={onClick}>
        <TrafficIcon fontSize="large" />
        {enabled && (
          <>
            <RedLight />
            <YellowLight />
            <GreenLight />
          </>
        )}
      </StyledIconButton>
      Toggle traffic lights
    </SubContainer>
  );
}
