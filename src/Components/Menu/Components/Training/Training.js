import React, { useEffect, useState } from "react";
import SkipNextIcon from "@material-ui/icons/SkipNext";

import { SubContainer, Row, ProgressBar } from "../../MenuStyle";
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
  const [avgScore, setAvgScore] = useState(1);

  const [newBestDNA, setNewBestDNA] = useState(null);
  const [newScore, setNewScore] = useState(0);
  const [newAvgScore, setNewAvgScore] = useState(0);

  const [generation, setGeneration] = useState(1);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (training) {
      dispatch(setCurrentDNA(bestDNA));
    } else {
      dispatch(setCurrentDNA(null));
    }
  }, [dispatch, bestDNA, training]);

  const onClick = () => {
    worker.postMessage("train");
    setProgress(0);
    console.time("timer");
  };

  useEffect(() => {
    worker.onmessage = (e) => {
      if (e.data.log) {
        console.log(e.data.log);
      } else if (e.data.progress) {
        setProgress(e.data.progress);
      } else {
        const { bestDNA, bestScore, avgScore } = e.data;
        setBestDNA(bestDNA);
        setScore(Math.round(bestScore));
        setAvgScore(Math.round(avgScore));
        setGeneration((prev) => prev + 1);
        setProgress(100);
        console.timeEnd("timer");
      }
    };
  }, []);

  return (
    <>
      {training && (
        <>
          <SubContainer>
            <div>Generation {generation}</div>
            <Row>
              <div>Best Score: {score}%</div>
              <div>Average Score: {avgScore}%</div>
            </Row>
          </SubContainer>
          <SubContainer>
            {progress < 100 ? "Training in progress" : "Training complete"}
            <ProgressBar progress={progress} />
          </SubContainer>
          <SubContainer>
            <StyledIconButton disabled={progress < 100} onClick={onClick}>
              <SkipNextIcon fontSize="large" />
            </StyledIconButton>
            Next generation
          </SubContainer>
        </>
      )}
    </>
  );
}
