import React, { useEffect, useState } from "react";
import FitnessCenterIcon from "@material-ui/icons/FitnessCenter";

import { SubContainer } from "../../MenuStyle";
import { StyledIconButton } from "../ToggleButtonStyle";
import { useDispatch } from "react-redux";
import { setCurrentDNA } from "../../../../redux/training";
const worker = new Worker("./simWorker/simWorker.js");

export default function TrainButton({ training }) {
  const dispatch = useDispatch();
  const [bestDNA, setBestDNA] = useState({
    steerVal: -15,
    maxForce: 3000,
    maxBrakeForce: 5,
    maxSpeed: 100,
    stoppingDistance: 100,
    slowDistance: 100,
  });
  const [score, setScore] = useState(1);
  const [generation, setGeneration] = useState(1);

  useEffect(() => {
    if (training) {
      dispatch(setCurrentDNA(bestDNA));
    } else {
      dispatch(setCurrentDNA(null));
    }
  }, [dispatch, bestDNA, training]);

  const onClick = () => {
    worker.postMessage("train");
    console.time("timer");
  };

  useEffect(() => {
    worker.onmessage = (e) => {
      if (e.data.log) {
        console.log(e.data.log);
      } else {
        setBestDNA(e.data[0]);
        setScore(Math.round(e.data[1].toFixed(2)));
        setGeneration((prev) => prev + 1);
      }
      console.timeEnd("timer");
    };
  }, []);

  return (
    <>
      {training && (
        <>
          <SubContainer>
            <div>Generation {generation}</div>
            <div>Score {score}%</div>
          </SubContainer>
          <SubContainer>
            <StyledIconButton onClick={onClick}>
              <FitnessCenterIcon fontSize="large" />
            </StyledIconButton>
            Next generation
          </SubContainer>
        </>
      )}
    </>
  );
}
