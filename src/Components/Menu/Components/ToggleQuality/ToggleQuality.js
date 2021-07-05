import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { Tooltip } from "@material-ui/core";
import { StyledIconButtonTop } from "../ToggleButtonStyle";
import { setQuality } from "../../../../redux/quality";

const lookup = {
  3: "HQ",
  2: "MQ",
  1: "LQ",
};

const Text = styled.div`
  font-weight: 800;
  font-size: 1.1rem;
`;

export default function ToggleQuality() {
  const dispatch = useDispatch();
  const quality = useSelector(({ quality }) => quality.quality);

  const onClick = () => {
    let nextValue = quality - 1;
    if (nextValue === 0) nextValue += 3;
    dispatch(setQuality(nextValue));
  };
  return (
    <Tooltip title="Toggle graphics quality">
      <StyledIconButtonTop onClick={onClick}>
        <Text>{lookup[quality]}</Text>
      </StyledIconButtonTop>
    </Tooltip>
  );
}
