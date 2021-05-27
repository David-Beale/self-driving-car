import React, { useState } from "react";
import CustomSlider from "../../../../../Styling/Components/CustomSlider";
import { SubContainer } from "../../../MenuStyle";

export default function MutationRateSlider({ onChange }) {
  const [localSliderValue, setLocalSliderValue] = useState(0.01);

  return (
    <SubContainer>
      Mutation rate
      <CustomSlider
        value={localSliderValue}
        min={0}
        max={1}
        step={0.01}
        onChange={(e, value) => setLocalSliderValue(value)}
        onChangeCommitted={onChange}
        valueLabelDisplay="auto"
      />
    </SubContainer>
  );
}
