import React from "react";

import { ModeContainer, ButtonContainer } from "./ModeStyle";

import DistanceButton from "./DistanceButton";
import CompareButton from "./CompareButton";
import TimeButton from "./TimeButton";

export default function Mode() {
  return (
    <ModeContainer>
      Pathfinding mode
      <ButtonContainer>
        <DistanceButton />
        <CompareButton />
        <TimeButton />
      </ButtonContainer>
    </ModeContainer>
  );
}
