import styled from "styled-components";

export const ThreeContainer = styled.div`
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: black;
  cursor: ${(props) =>
    props.addRoadWorks ? "crosshair" : props.removeRoadWorks ? "no-drop" : ""};
`;
