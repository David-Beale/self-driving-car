import styled from "styled-components";

export const TableOfContentsContainer = styled.div`
  position: absolute;
  z-index: 1;
  width: 300px;
  min-height: 100vh;
  border-right: 1px solid grey;
  padding: 50px 20px 0 0;
  background-color: white;
`;
export const Section = styled.div`
  cursor: pointer;
  margin: 5px 0;
  border-radius: 0 20px 20px 0;
  padding: 3px 10px 3px 25px;
  font-weight: 500;
  text-transform: capitalize;
  background-color: ${(props) =>
    props.current ? "rgb(232,240,254)" : "rgb(245, 245, 245)"};
  color: ${(props) => (props.current ? "rgb(24,90,188)" : "black")};
  &:hover {
    background-color: ${(props) =>
      props.current ? "rgb(232,240,254)" : "rgb(225, 225, 225)"};
  }
`;
