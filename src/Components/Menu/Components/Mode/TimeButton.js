import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ScheduleIcon from "@material-ui/icons/Schedule";

import {
  InfoBox,
  ModeButtonContainer,
  Row,
  StyledIconButton,
} from "./ModeStyle";
import { timeMode } from "../../../../redux/mode";
import { Tooltip } from "@material-ui/core";

export default function CompareButton() {
  const dispatch = useDispatch();
  const enabled = useSelector(({ mode }) => mode.mode === "time");
  const timeStats = useSelector(({ mode }) => mode.stats?.time);

  const onClick = () => {
    dispatch(timeMode());
  };
  return (
    <ModeButtonContainer>
      <Tooltip title="Fastest route">
        <StyledIconButton enabled={enabled ? 1 : 0} onClick={onClick}>
          <ScheduleIcon />
        </StyledIconButton>
      </Tooltip>
      {timeStats && (
        <InfoBox>
          <Row>Time: {Math.round(timeStats.time / 60)}s</Row>
          <Row>Distance: {timeStats.distance}</Row>
        </InfoBox>
      )}
    </ModeButtonContainer>
  );
}
