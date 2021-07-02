import { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  margin: 20px 0;
`;

const StyledClickableImage = styled.img`
  cursor: ${(props) => (props.clicked ? "zoom-out" : "zoom-in")};
  width: ${(props) => (props.clicked ? "90vw" : "100%")};
  height: ${(props) => (props.clicked ? "90vh" : "100%")};
  position: ${(props) => (props.clicked ? "fixed" : "")};
  top: 5vh;
  left: 5vw;
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
    </Container>
  );
}
