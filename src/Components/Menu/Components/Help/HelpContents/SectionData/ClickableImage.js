import { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  margin: 20px 0;
`;

const StyledClickableImage = styled.img`
  cursor: ${(props) => (props.clicked ? "zoom-out" : "zoom-in")};
  max-width: ${(props) => (props.clicked ? "90vw" : "100%")};
  height: ${(props) => (props.clicked ? "90vh" : "100%")};
  position: ${(props) => (props.clicked ? "fixed" : "")};
  top: 50%;
  left: 50%;
  transform: ${(props) => (props.clicked ? "translate(-50%, -50%);" : "")};
  z-index: 1;
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  background-color: rgba(0, 0, 0, 0.7);
  width: 100vw;
  height: 100vh;
  z-index: 0;
`;
export default function ClickableImage({ src, alt, height, width }) {
  const [clicked, setClicked] = useState(false);
  return (
    <Container height={height} width={width}>
      <StyledClickableImage
        onClick={() => setClicked(!clicked)}
        clicked={clicked}
        src={src}
        alt={alt}
      />
      {clicked && <Backdrop />}
    </Container>
  );
}
