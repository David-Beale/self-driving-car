import styled from "styled-components";

const Light = styled.div`
  height: 6px;
  width: 6px;
  border-radius: 50%;
  position: absolute;
`;
export const RedLight = styled(Light)`
  background-color: red;
  top: 19px;
`;
export const YellowLight = styled(Light)`
  background-color: yellow;
`;
export const GreenLight = styled(Light)`
  background-color: green;
  top: 34px;
`;
