import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { setCurrentDNA } from "../../../../redux/training";

import Stats from "./Components/Stats";
import Progress from "./Components/Progress";
import NextGenButton from "./Components/NextGenButton";
import MutationRateSlider from "./Components/MutationRateSlider";
import PopulationSizeSlider from "./Components/PopulationSizeSlider";
import ResetTrainingButton from "./Components/ResetTrainingButton";

import { useInitalise } from "./useInitalise";

const worker = new Worker("./simWorker/simWorker.js");

const initialDNA = {
  steerVal: -15,
  maxForce: 3000,
  maxBrakeForce: 5,
  maxSpeed: 100,
  stoppingDistance: 100,
  slowDistance: 100,
};

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

  useInitalise(initialDNA, training, onTrain);

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

  const onNext = () => {
    setScore(newScore);
    setAvgScore(newAvgScore);
    setGeneration((prev) => prev + 1);
    dispatch(setCurrentDNA(newBestDNA));
    onTrain();
  };

  const onChangeMutationRate = (e, value) => {
    worker.postMessage({ mutationRate: value });
  };
  const onChangePopulationSize = (e, value) => {
    worker.postMessage({ populationSize: value });
  };

  const onReset = () => {
    worker.postMessage({ reset: true });
    dispatch(setCurrentDNA(initialDNA));
    setGeneration(1);
    setScore(1);
    setAvgScore(1);
    onTrain();
  };
  return (
    <>
      {training && (
        <>
          <Stats generation={generation} score={score} avgScore={avgScore} />

          <Progress progress={progress} />

          <NextGenButton disabled={progress < 100} onClick={onNext} />

          <MutationRateSlider onChange={onChangeMutationRate} />
          <PopulationSizeSlider onChange={onChangePopulationSize} />

          <ResetTrainingButton disabled={progress < 100} onClick={onReset} />
        </>
      )}
    </>
  );
}
