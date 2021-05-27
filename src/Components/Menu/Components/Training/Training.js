import React, { useCallback, useEffect, useState } from "react";
import SkipNextIcon from "@material-ui/icons/SkipNext";

import {
  SubContainer,
  Row,
  ProgressBar,
  ProgressContainer,
} from "../../MenuStyle";
import { StyledIconButton } from "../ToggleButtonStyle";
import { useDispatch } from "react-redux";
import { setCurrentDNA } from "../../../../redux/training";
import { useInitalise } from "./useInitalise";
const worker = new Worker("./simWorker/simWorker.js");

export default function TrainButton({ training }) {
  const dispatch = useDispatch();
  const [score, setScore] = useState(1);
  const [avgScore, setAvgScore] = useState(1);

  const [newBestDNA, setNewBestDNA] = useState(null);
  const [newScore, setNewScore] = useState(0);
  const [newAvgScore, setNewAvgScore] = useState(0);

  const [generation, setGeneration] = useState(1);
  const [progress, setProgress] = useState(100);

  const onTrain = useCallback(() => {
    worker.postMessage("train");
    setProgress(0);
    console.time("timer");
  }, []);

  useInitalise(training, onTrain);

  const onNext = () => {
    setScore(newScore);
    setAvgScore(newAvgScore);
    setGeneration((prev) => prev + 1);
    dispatch(setCurrentDNA(newBestDNA));
    onTrain();
  };

  useEffect(() => {
    worker.onmessage = (e) => {
      if (e.data.log) {
        console.log(e.data.log);
      } else if (e.data.progress) {
        setProgress(e.data.progress);
      } else {
        const { bestDNA, bestScore, avgScore } = e.data;
        setNewBestDNA(bestDNA);
        setNewScore(Math.round(bestScore));
        setNewAvgScore(Math.round(avgScore));
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
            <ProgressContainer>
              {progress < 100 ? "Training in progress" : "Training complete"}
              <ProgressBar progress={progress} />
            </ProgressContainer>
          </SubContainer>

          <SubContainer>
            <StyledIconButton disabled={progress < 100} onClick={onNext}>
              <SkipNextIcon fontSize="large" />
            </StyledIconButton>
            Next generation
          </SubContainer>
        </>
      )}
    </>
  );
}
