import React, { useState } from "react";
import CustomSlider from "../../../../../Styling/Components/CustomSlider";
import { SubContainer } from "../../../MenuStyle";

export default function PopulationSizeSlider({ onChange }) {
  const [localSliderValue, setLocalSliderValue] = useState(100);

  return (
    <SubContainer>
      Population size
      <CustomSlider
        value={localSliderValue}
        min={1}
        max={250}
        step={1}
        onChange={(e, value) => setLocalSliderValue(value)}
        onChangeCommitted={onChange}
        valueLabelDisplay="auto"
      />
    </SubContainer>
  );
}
