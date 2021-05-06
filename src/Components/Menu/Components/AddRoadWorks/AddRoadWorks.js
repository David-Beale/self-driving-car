import React from "react";
import { useDispatch, useSelector } from "react-redux";
import DepartureBoardIcon from "@material-ui/icons/DepartureBoard";

import { SubContainer } from "../../MenuStyle";
import { StyledIconButton } from "../ToggleButtonStyle";
import { toggleAddRoadWorks } from "../../../../redux/roadWorks";

export default function AddRoadWorks() {
  const dispatch = useDispatch();
  const enabled = useSelector(({ roadWorks }) => roadWorks.addRoadWorks);

  const onClick = () => {
    dispatch(toggleAddRoadWorks());
  };
  return (
    <SubContainer>
      <StyledIconButton enabled={enabled ? 1 : 0} onClick={onClick}>
        <DepartureBoardIcon fontSize="large" />
      </StyledIconButton>
      Draw road works
    </SubContainer>
  );
}
