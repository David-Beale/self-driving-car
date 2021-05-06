import styled from "styled-components";
import { IconButton } from "@material-ui/core";

export const StyledIconButton = styled(IconButton)`
  color: black;
  box-shadow: ${(props) =>
    props.enabled
      ? "inset -4px -4px 8px rgba(255, 255, 255, 0.6), inset 8px 8px 16px rgba(0, 0, 0, 0.2)"
      : "-6px -6px 10px rgba(255, 255, 255, 0.7), 6px 6px 10px rgba(0, 0, 0, 0.3)"};
  position: absolute;
  left: 10px;
`;
