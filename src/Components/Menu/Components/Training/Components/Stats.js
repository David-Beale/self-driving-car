import React from "react";

import { SubContainer, Row } from "../../../MenuStyle";

export default function Stats({ generation, score, avgScore }) {
  return (
    <SubContainer>
      <div>Generation {generation}</div>
      <Row>
        <div>Best Score: {score}%</div>
        <div>Average Score: {avgScore}%</div>
      </Row>
    </SubContainer>
  );
}
