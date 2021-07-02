import styled from "styled-components";
import Rotate90DegreesCcwIcon from "@material-ui/icons/Rotate90DegreesCcw";
import AspectRatioIcon from "@material-ui/icons/AspectRatio";
import { Button } from "@material-ui/core";

const WarningContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const WarningText = styled.div`
  font-size: 1.5rem;
  margin: 20px;
`;

export default function OrientationWarning({ warning, setOrientationCheck }) {
  const onClick = () => {
    setOrientationCheck(false);
  };
  return (
    <WarningContainer>
      {warning === "orientation" ? (
        <>
          <Rotate90DegreesCcwIcon fontSize="large" />
          <WarningText>Please rotate your device</WarningText>
        </>
      ) : (
        <>
          <AspectRatioIcon fontSize="large" />
          <WarningText>This app is not suitable for small devices</WarningText>
        </>
      )}
      <Button onClick={onClick} color="primary" variant="contained">
        Ignore
      </Button>
    </WarningContainer>
  );
}
