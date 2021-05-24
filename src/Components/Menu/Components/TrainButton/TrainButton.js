import React, { useEffect } from "react";
import SchoolIcon from "@material-ui/icons/School";

import { SubContainer } from "../../MenuStyle";
import { StyledIconButton } from "../ToggleButtonStyle";
const worker = new Worker("./simWorker/simWorker.js");

export default function TrainButton() {
  const onClick = () => {
    worker.postMessage("train");
    console.time("start");
  };

  useEffect(() => {
    worker.onmessage = (e) => {
      console.log(e.data);
      console.timeEnd("start");
    };
  }, []);

  return (
    <SubContainer>
      <StyledIconButton onClick={onClick}>
        <SchoolIcon fontSize="large" />
      </StyledIconButton>
      Train new generation
    </SubContainer>
  );
}
