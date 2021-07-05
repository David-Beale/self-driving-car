import styled from "styled-components";

export const Container = styled.div`
  width: 400px;
  padding: 60px 25px 0 25px;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 1.1rem;
  font-weight: 600;
  color: darkslategray;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
`;
export const TopContainer = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 5px;
`;
export const SubContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 5px 0;
  padding: 10px;
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 0 10px -1px slategray;
  height: 70px;
`;
export const Row = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;
export const ProgressBar = styled.div`
  height: 10px;
  width: ${(props) => props.progress}%;
  align-self: flex-start;
  background: rgb(9, 90, 121);
  background: linear-gradient(
    90deg,
    rgba(9, 90, 121, 1) 35%,
    rgba(0, 189, 255, 1) 100%
  );
  border-radius: 5px;
  transition: ${(props) => (props.progress ? "0.5" : "0")}s ease-in-out;
`;
export const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100%;
`;
