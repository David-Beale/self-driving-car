import React from "react";

import { ModeContainer, ButtonContainer } from "./ModeStyle";

import Keyboard from "./Keyboard";
import Mouse from "./Mouse";
import { useSelector } from "react-redux";

export default function Mode() {
  const mode = useSelector(({ mode }) => mode.mode);
  return (
    <ModeContainer>
      Control method
      <ButtonContainer>
        <Keyboard enabled={mode === "keyboard"} />
        <Mouse enabled={mode === "mouse"} />
      </ButtonContainer>
      {mode === "keyboard"
        ? "WASD to move, space to brake, r to reset"
        : "Point and click to move, r to reset"}
    </ModeContainer>
  );
}
