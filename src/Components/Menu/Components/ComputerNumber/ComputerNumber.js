import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { changeComputerNumber } from "../../../../redux/settings";
import CustomSlider from "../../../../Styling/Components/CustomSlider";
import { SubContainer } from "../../MenuStyle";

export default function ComputerNumber() {
  const [localSliderValue, setLocalSliderValue] = useState(60);

  // Retrieve redux dispatch
  const dispatch = useDispatch();

  return (
    <SubContainer>
      Number of computer cars
      <CustomSlider
        value={localSliderValue}
        onMouseDown={(e) => e.stopPropagation()}
        min={0}
        max={500}
        step={1}
        onChange={(e, value) => setLocalSliderValue(value)}
        onChangeCommitted={(e, value) => dispatch(changeComputerNumber(value))}
        valueLabelDisplay="auto"
      />
    </SubContainer>
  );
}
