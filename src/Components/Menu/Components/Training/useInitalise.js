import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setCurrentDNA } from "../../../../redux/training";

export const useInitalise = (initialDNA, training, onTrain) => {
  const dispatch = useDispatch();
  const init = useRef(false);
  useEffect(() => {
    if (training && !init.current) {
      init.current = true;
      dispatch(setCurrentDNA(initialDNA));
      onTrain();
    }
  }, [dispatch, training, onTrain, initialDNA]);
};
