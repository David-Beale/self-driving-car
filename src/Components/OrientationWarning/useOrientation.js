import { useEffect, useState } from "react";

export const useOrientation = () => {
  const [orientationCheck, setOrientationCheck] = useState(false);
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 1000) setOrientationCheck("size");
      else if (window.innerHeight > window.innerWidth)
        setOrientationCheck("orientation");
      else setOrientationCheck(false);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);
  return [orientationCheck, setOrientationCheck];
};
