import styled from "styled-components";
import { IconButton } from "@material-ui/core";

export const ModeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: space-between; */
  margin: 5px 0;
  padding: 5px;
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 0 10px -1px slategray;
  height: 130px;
`;
export const ButtonContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-evenly;
  width: 100%;
  margin: 5px;
`;

export const StyledIconButton = styled(IconButton)`
  color: black;
  box-shadow: ${(props) =>
    props.enabled
      ? "inset -4px -4px 8px rgba(255, 255, 255, 0.6), inset 8px 8px 16px rgba(0, 0, 0, 0.2)"
      : "-6px -6px 10px rgba(255, 255, 255, 0.7), 6px 6px 10px rgba(0, 0, 0, 0.3)"};
`;
export const InfoBox = styled.div``;
export const Row = styled.div``;

export const ModeButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  font-size: 0.9rem;
  width: 33%;
`;
