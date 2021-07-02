import styled from "styled-components";

export const StyledHelp = styled.div`
  position: absolute;
  right: 5px;
  top: 5px;
  display: flex;
  align-items: center;
`;
export const HelpContainer = styled.div`
  height: 100vh;
  width: 100vw;
  overflow-x: hidden;
  font-size: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
`;
export const StyledCloseButton = styled.div`
  cursor: pointer;
  position: absolute;
  top: 5px;
  left: 25px;
  z-index: 2;
`;
