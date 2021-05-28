import React, { useState } from "react";
import CustomSlider from "../../../../../Styling/Components/CustomSlider";
import { SubContainer } from "../../../MenuStyle";

export default function Ghosts({ init, populationSize, onChange }) {
  const [localSliderValue, setLocalSliderValue] = useState(init);
  const max = Math.min(populationSize, 50);

  return (
    <SubContainer>
      Ghosts (decreases performance)
      <CustomSlider
        value={localSliderValue}
        min={0}
        max={max}
        step={1}
        onChange={(e, value) => setLocalSliderValue(value)}
        onChangeCommitted={onChange}
        valueLabelDisplay="auto"
      />
    </SubContainer>
  );
}
