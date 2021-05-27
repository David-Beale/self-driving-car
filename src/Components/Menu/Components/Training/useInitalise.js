import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setCurrentDNA } from "../../../../redux/training";

const initialDNA = {
  steerVal: -15,
  maxForce: 3000,
  maxBrakeForce: 5,
  maxSpeed: 100,
  stoppingDistance: 100,
  slowDistance: 100,
};

export const useInitalise = (training, onTrain) => {
  const dispatch = useDispatch();
  const init = useRef(false);
  useEffect(() => {
    if (training && !init.current) {
      init.current = true;
      dispatch(setCurrentDNA(initialDNA));
      onTrain();
    }
  }, [dispatch, training, onTrain]);
};
