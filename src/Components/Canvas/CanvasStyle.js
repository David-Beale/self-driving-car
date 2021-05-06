import styled from "styled-components";

export const StyledCanvas = styled.canvas`
  height: 100vh;
  width: 100vw;
  cursor: ${(props) => props.cursor};
`;
