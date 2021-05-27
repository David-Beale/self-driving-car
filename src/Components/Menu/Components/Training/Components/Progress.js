import React from "react";

import {
  SubContainer,
  ProgressContainer,
  ProgressBar,
} from "../../../MenuStyle";

export default function Progress({ progress }) {
  return (
    <SubContainer>
      <ProgressContainer>
        {progress < 100 ? "Training in progress" : "Training complete"}
        <ProgressBar progress={progress} />
      </ProgressContainer>
    </SubContainer>
  );
}
