import React from "react";
import OrientationWarning from "./OrientationWarning";
import { useOrientation } from "./useOrientation";

export default function OrientationCheck({ children }) {
  const [orientationCheck, setOrientationCheck] = useOrientation();

  return (
    <>
      {orientationCheck ? (
        <OrientationWarning
          warning={orientationCheck}
          setOrientationCheck={setOrientationCheck}
        />
      ) : (
        <>{children}</>
      )}
    </>
  );
}
