import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import { setCurrentDNA, updateGhosts } from "../../../../redux/training";

import Stats from "./Components/Stats";
import Progress from "./Components/Progress";
import NextGenButton from "./Components/NextGenButton";
import MutationRateSlider from "./Components/MutationRateSlider";
import PopulationSizeSlider from "./Components/PopulationSizeSlider";
import ResetTrainingButton from "./Components/ResetTrainingButton";

import { useInitalise } from "./useInitalise";
import Ghosts from "./Components/Ghosts";

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
  const [populationSize, setPopulationSize] = useState(100);
  const mutationRate = useRef(0.01);
  const ghosts = useRef(0);
  const arrayOfDNA = useRef([]);
  const newArrayOfDNA = useRef([]);

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
        const { bestDNA, bestScore, avgScore, allDNA } = e.data;
        setNewBestDNA(bestDNA);
        setNewScore(Math.round(bestScore));
        setNewAvgScore(Math.round(avgScore));
        setProgress(100);
        newArrayOfDNA.current = allDNA;
        console.timeEnd("timer");
      }
    };
  }, [dispatch]);

  const onNext = () => {
    setScore(newScore);
    setAvgScore(newAvgScore);
    setGeneration((prev) => prev + 1);
    arrayOfDNA.current = newArrayOfDNA.current;
    dispatch(setCurrentDNA(newBestDNA));
    dispatch(updateGhosts(arrayOfDNA.current.slice(0, ghosts.current)));
    onTrain();
  };

  const onChangeMutationRate = (e, value) => {
    mutationRate.current = value;
    worker.postMessage({ mutationRate: value });
  };
  const onChangePopulationSize = (e, value) => {
    setPopulationSize(value);
    worker.postMessage({ populationSize: value });
  };
  const onChangeGhosts = (e, value) => {
    if (arrayOfDNA.current) {
      dispatch(updateGhosts(arrayOfDNA.current.slice(0, value)));
    }
    ghosts.current = value;
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
          <MutationRateSlider
            init={mutationRate.current}
            onChange={onChangeMutationRate}
          />
          <PopulationSizeSlider
            init={populationSize}
            onChange={onChangePopulationSize}
          />
          <Ghosts
            init={ghosts.current}
            populationSize={populationSize}
            onChange={onChangeGhosts}
          />
          <ResetTrainingButton disabled={progress < 100} onClick={onReset} />
        </>
      )}
    </>
  );
}
