import React from "react";
import { useDispatch, useSelector } from "react-redux";
import CommuteIcon from "@material-ui/icons/Commute";

import { toggleTrafficConditions } from "../../../../redux/settings";
import { SubContainer } from "../../MenuStyle";
import { StyledIconButton } from "../ToggleButtonStyle";

export default function ToggleTrafficConditions() {
  const dispatch = useDispatch();
  const enabled = useSelector(({ settings }) => settings.trafficConditions);

  const onClick = () => {
    dispatch(toggleTrafficConditions());
  };
  return (
    <SubContainer>
      <StyledIconButton enabled={enabled ? 1 : 0} onClick={onClick}>
        <CommuteIcon fontSize="large" />
      </StyledIconButton>
      Toggle traffic conditions
    </SubContainer>
  );
}
