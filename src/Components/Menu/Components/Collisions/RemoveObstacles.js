import React from "react";
import { useDispatch } from "react-redux";
import NotInterestedIcon from "@material-ui/icons/NotInterested";

import { StyledIconButton } from "../ToggleButtonStyle";
import { removeObstacles } from "../../../../redux/settings";

import { SubContainer } from "../../MenuStyle";

export default function AddObstacles() {
  const dispatch = useDispatch();

  const onClick = () => {
    dispatch(removeObstacles());
  };

  return (
    <>
      <SubContainer>
        <StyledIconButton onClick={onClick}>
          <NotInterestedIcon fontSize="large" />
        </StyledIconButton>
        Remove obstacles
      </SubContainer>
    </>
  );
}
