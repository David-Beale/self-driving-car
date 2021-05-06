import React from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import DepartureBoardIcon from "@material-ui/icons/DepartureBoard";
import BlockIcon from "@material-ui/icons/Block";

import { SubContainer } from "../../MenuStyle";
import { StyledIconButton } from "../ToggleButtonStyle";
import { toggleRemoveRoadWorks } from "../../../../redux/roadWorks";

const StyledBlockIcon = styled(BlockIcon)`
  position: absolute;
  height: 65px;
  width: 65px;
  opacity: 0.7;
`;

export default function RemoveRoadWorks() {
  const dispatch = useDispatch();
  const enabled = useSelector(({ roadWorks }) => roadWorks.removeRoadWorks);

  const onClick = () => {
    dispatch(toggleRemoveRoadWorks());
  };
  return (
    <SubContainer>
      <StyledIconButton enabled={enabled ? 1 : 0} onClick={onClick}>
        <DepartureBoardIcon fontSize="large" />
        <StyledBlockIcon fontSize="large" />
      </StyledIconButton>
      Remove road works
    </SubContainer>
  );
}
