import React from "react";
import { useDispatch, useSelector } from "react-redux";
import TimelineIcon from "@material-ui/icons/Timeline";

import {
  InfoBox,
  ModeButtonContainer,
  Row,
  StyledIconButton,
} from "./ModeStyle";
import { distanceMode } from "../../../../redux/mode";
import { Tooltip } from "@material-ui/core";

export default function DistanceButton() {
  const dispatch = useDispatch();
  const enabled = useSelector(({ mode }) => mode.mode === "distance");
  const distanceStats = useSelector(({ mode }) => mode.stats?.distance);

  const onClick = () => {
    dispatch(distanceMode());
  };
  return (
    <ModeButtonContainer>
      <Tooltip title="Shortest route">
        <StyledIconButton enabled={enabled ? 1 : 0} onClick={onClick}>
          <TimelineIcon />
        </StyledIconButton>
      </Tooltip>
      {distanceStats && (
        <InfoBox>
          <Row>Time: {Math.round(distanceStats.time / 60)}s</Row>
          <Row>Distance: {distanceStats.distance}</Row>
        </InfoBox>
      )}
    </ModeButtonContainer>
  );
}
