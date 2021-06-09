import React from "react";
import { useDispatch, useSelector } from "react-redux";
import NaturePeopleIcon from "@material-ui/icons/NaturePeople";

import { StyledIconButton } from "../ToggleButtonStyle";
import { addObstacles } from "../../../../redux/settings";

import { SubContainer } from "../../MenuStyle";

export default function AddObstacles() {
  const dispatch = useDispatch();

  const enabled = useSelector(({ settings }) => settings.addObstacles);

  const onClick = () => {
    dispatch(addObstacles());
  };

  return (
    <>
      <SubContainer>
        <StyledIconButton enabled={enabled ? 1 : 0} onClick={onClick}>
          <NaturePeopleIcon fontSize="large" />
        </StyledIconButton>
        Add obstacles
      </SubContainer>
    </>
  );
}
