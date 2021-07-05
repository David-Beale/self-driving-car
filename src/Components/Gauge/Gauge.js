import React from "react";
import ReactSpeedometer from "react-d3-speedometer";
import { useSelector } from "react-redux";
import styled from "styled-components";

export const Container = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  pointer-events: none;
`;

export default function Gauge() {
  const gauges = useSelector(({ gauges }) => gauges.gauges);
  const quality = useSelector(({ quality }) => quality.quality);
  return (
    <>
      {quality > 1 && (
        <Container>
          <ReactSpeedometer
            value={gauges?.accel}
            minValue={-1}
            maxValue={1}
            height={185}
            needleTransitionDuration={200}
            segments={100}
            maxSegmentLabels={0}
            ringWidth={10}
            currentValueText="Acceleration"
            needleTransition="easeLinear"
            needleColor={"#90f2ff"}
            needleHeightRatio={0.8}
            textColor={"#d8dee9"}
          />
          <ReactSpeedometer
            value={gauges?.steering}
            minValue={-1}
            maxValue={1}
            height={185}
            needleTransitionDuration={200}
            segments={100}
            maxSegmentLabels={0}
            ringWidth={10}
            currentValueText="Steering"
            needleTransition="easeLinear"
            needleColor={"#90f2ff"}
            needleHeightRatio={0.8}
            textColor={"#d8dee9"}
          />
        </Container>
      )}
    </>
  );
}
